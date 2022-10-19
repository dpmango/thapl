<template>
  <div v-click-outside="() => (suggestionsVisible = false)" class="input" :class="modifiers">
    <label v-if="label" class="input__label text-s c-gray" :for="id">{{ label }}</label>
    <div class="input__wrapper">
      <component
        :is="getElement"
        :id="id"
        ref="inputRef"
        v-maska="mask"
        class="input__input"
        :name="name"
        :value="value"
        :type="currentInputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="textareaStyle"
        v-bind="$attrs"
        @input="setValue"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <span v-if="showLivePlaceholder" class="input__live-placeholder">
        <span v-for="word in livePlaceholderWords" :class="[!word.visible && '_hidden']">
          {{ word.content }}&nbsp;
        </span>
      </span>

      <div class="input__icons">
        <i v-if="loading" class="input__icon _loading">
          <nuxt-icon name="loading" />
        </i>
        <i v-if="clearable" class="input__icon _clear" @click="clearInput">
          <nuxt-icon name="close" />
        </i>
        <i v-if="showError" class="input__icon _error" @click="clearInput">
          <nuxt-icon name="close" />
        </i>
        <i v-if="icon" class="input__icon">
          <nuxt-icon :name="icon" />
        </i>
      </div>

      <div class="input__suggestions suggestions" :class="[showSuggestions && '_active']">
        <ul class="suggestions__list">
          <li v-for="sug in suggestionsList">
            <span
              class="text-m suggestions__link"
              @click="selectSuggestion(sug.text)"
              v-html="sug.text_html"
            />
          </li>
        </ul>
      </div>
    </div>
    <div v-if="showErrorText" class="input__error">{{ error }}</div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { nanoid } from 'nanoid'
// const { $sanitize } = useNuxtApp()

const id = nanoid()
const inputRef = ref(null)

const emit = defineEmits(['onChange'])

const props = defineProps({
  value: {
    type: String,
    default: '',
    required: true,
  },
  type: {
    type: String,
    default: 'text', // textarea for :is="getElement"
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  livePlaceholder: {
    type: [Array, null],
    default: null,
  },
  name: {
    type: String,
    default: '',
  },
  // presentation
  theme: {
    type: String,
    default: 'primary',
    validator: (theme) => ['primary', 'secondary'].includes(theme),
  },
  size: {
    type: String,
    default: 'normal',
    validator: (size) => ['normal', 'small'].includes(size),
  },
  icon: {
    type: String,
    required: false,
  },
  iconPosition: {
    type: String,
    default: 'right',
    validator: (size) => ['left', 'right'].includes(size),
  },
  // modifiers
  error: {
    type: [String, Boolean],
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  // functional
  focusOnMount: {
    type: Boolean,
    default: false,
  },
  closeOnSelect: {
    type: Boolean,
    default: true,
  },
  // https://github.com/beholdr/maska
  mask: {
    type: String,
    default: '',
  },
  suggestions: {
    type: String,
    default: '',
  },
  // textarea
  maxRows: {
    type: Number,
    default: 5,
  },
})

const modifiers = computed(() => [
  isFocusedOrNotBlank.value && '_focused',
  showError.value && '_error',
  props.disabled && '_disabled',
  (props.icon || props.error) && `_ipos-${props.iconPosition}`,
  `_${props.theme}`,
  `_${props.size}`,
])

// general logic
const isTextarea = computed(() => {
  return props.type === 'textarea'
})

const getElement = computed(() => {
  if (isTextarea.value) {
    return 'textarea'
  }

  return 'input'
})

const showError = computed(() => {
  return props.error && !isFocused.value
})

const setValue = (e) => {
  let value = e.target.value

  if (props.livePlaceholder) {
    value = value.replace(/\s{2,}/g, ' ') // clears double spaces
  }

  emit('onChange', value)

  if (isTextarea.value) {
    resizeTextarea()
  }

  if (props.suggestions) {
    if (value && value.trim().length > 2) {
      debounceSuggestion(value)
    } else {
      suggestionsVisible.value = false
      loading.value = false
    }
  }
}

// focus handle
const isFocused = ref(false)

const isFocusedOrNotBlank = computed(() => {
  if (props.value && props.value.trim().length > 0) {
    return true
  }
  return isFocused.value
})

const handleFocus = (e) => {
  isFocused.value = true
}
const handleBlur = () => {
  isFocused.value = false
}

const handleAutocompleate = (e) => {
  if (parseInt(e.target.getAttribute('id')) === id) {
    if (e.target.hasAttribute('autocompleted')) {
      isFocused.value = true
    }
  }
}

// error
const showErrorText = computed(() => {
  if (isFocused.value) return false
  return typeof props.error === 'string'
})

// password
const passwordVisible = ref(false)

const isPassword = computed(() => {
  return props.type === 'password'
})

const currentInputType = computed(() => {
  if (isPassword.value) {
    return passwordVisible.value ? 'text' : 'password'
  }

  return props.type
})

const handlePasswordClick = () => {
  passwordVisible.value = !this.passwordVisible.value
}

// clear
const isClearable = computed(() => {
  if (props.clearable) {
    return props.value && props.value.replace(/^\s+|\s+$/g, '').length > 1
  } else {
    return false
  }
})

const clearInput = () => {
  emit('onChange', '')
}

// suggestions
const suggestionsList = ref([])
const suggestionsVisible = ref(false)
const loading = ref(false)

const showSuggestions = computed(() => {
  return suggestionsVisible.value && suggestionsList.value.length
})

const handleSuggestion = async (text) => {
  loading.value = true

  const suggestions = await useApi(props.suggestions, {
    params: {
      text,
    },
  })

  let visible = false
  if (suggestions && suggestions.length) {
    suggestionsList.value = suggestions
    visible = true

    if (suggestions.length === 1) {
      // do not show same suggestion as already inputed
      if (text.toLowerCase() === suggestions[0].text.toLowerCase()) {
        visible = false
      }
    }
  }

  suggestionsVisible.value = visible
  loading.value = false
}

const debounceSuggestion = _.debounce(handleSuggestion, 500)

const selectSuggestion = (suggestion) => {
  emit('onChange', suggestion)

  if (isTextarea.value) resizeTextarea()

  if (props.closeOnSelect) {
    suggestionsVisible.value = false
  } else {
    handleSuggestion(suggestion)
  }

  inputRef.value.focus()
}

// textarea autosize
const height = ref('')
const resizeTextarea = () => {
  height.value = 'auto !important'
  nextTick(() => {
    const style = window.getComputedStyle(inputRef.value)
    const padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom)
    const lineHeight = parseInt(style.lineHeight)
    const maxHeight = lineHeight * props.maxRows + padding + 2

    let newHeight = inputRef.value.scrollHeight + 2
    if (newHeight >= maxHeight) newHeight = maxHeight

    height.value = `${newHeight}px`
  })
}

const textareaStyle = computed(() => {
  if (isTextarea.value) {
    return { height: height.value }
  } else {
    return {}
  }
})

// livePlaceholder
const showLivePlaceholder = computed(() => {
  return props.livePlaceholder && isFocusedOrNotBlank.value
})

const livePlaceholderWords = computed(() => {
  if (!props.livePlaceholder) return ''

  const inputWords = props.value.split(' ')

  const mindInputs = props.livePlaceholder.map((word, idx) => {
    // const wordLength = word.length

    if (inputWords[idx]) {
      // const inputWordLength = inputWords[idx].length

      return {
        visible: false,
        content: inputWords[idx],
      }
    }

    return {
      visible: true,
      content: word,
    }
  })

  return mindInputs
})

// hooks
onMounted(() => {
  if (props.focusOnMount) {
    inputRef.value.focus()
  }
  if (isTextarea.value) resizeTextarea()

  document.addEventListener('onautocomplete', handleAutocompleate, false)
})

onBeforeUnmount(() => {
  document.removeEventListener('onautocomplete', handleAutocompleate, false)
})
</script>

<style lang="scss" scoped>
.input {
  position: relative;
  z-index: 1;
  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  &__label {
    display: block;
    font-weight: 500;
    margin-bottom: 12px;
  }

  &__input {
    position: relative;
    z-index: 2;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    border: 1px solid var(--color-border);
    background: var(--input-background-color);
    border-radius: var(--input-border-radius);
    font-style: normal;
    font-weight: 400;
    line-height: 1.5;
    color: var(--color-font);
    resize: vertical;
    overflow: hidden;
    box-shadow: none;
    transition-property: border, color, background, outline;
    transition-duration: 0.25s;
    transition-timing-function: $ease;
    &::placeholder {
      color: var(--color-disabled);
    }
    &:focus,
    &:active {
      border-color: var(--color-font);
      outline: 4px solid rgba(0, 97, 174, 0.3);
    }
    &:hover {
      border-color: var(--color-font);
    }
    &[readonly],
    &[disabled] {
      color: #c0cdda;
      background-color: var(--color-bg);
      border-color: #e3e9ef;
      &:hover,
      &:focus,
      &:active {
        color: #c0cdda;
        background-color: var(--color-bg);
        border-color: #e3e9ef;
        outline: none;
      }
    }
  }

  // compontents
  &__icons {
    position: absolute;
    z-index: 3;
    display: flex;
    align-items: center;
    top: 50%;
    font-size: 0;
    transform: translateY(-50%);
    > * {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__icon {
    color: var(--color-disabled);
    transition: color 0.25s $ease, opacity 0.25s $ease;
    &._error {
      color: var(--color-red);
      cursor: pointer;
      &:hover {
        color: var(--color-font);
      }
    }
    &._loading {
      color: var(--color-gray);
      animation: rotateLoader 1s linear infinite;
    }
    &._clear {
      color: var(--color-gray);
      cursor: pointer;
      &:hover {
        color: var(--color-red);
      }
    }
  }

  &__live-placeholder {
    position: absolute;
    z-index: 2;
    color: var(--color-disabled);
    line-height: 1.5;
    pointer-events: none;
    span._hidden {
      opacity: 0;
    }
  }

  &__suggestions {
    position: absolute;
    z-index: 1;
    top: calc(100% - 8px);
    left: 0;
    right: 0;
    padding-top: 8px;
    background: var(--input-background-color);
    box-shadow: 0px 13px 30px -10px #e6e6e6;
    border-radius: 8px;
    max-height: 208px;
    overflow-y: auto;
  }

  &__error {
    // position: absolute;
    // top: 100%;
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--color-red);
  }
  // &__eye {
  //   cursor: pointer;
  //   color: var(--color-gray);
  //   transition: color 0.25s $ease;
  //   &:hover {
  //     color: var(--color-primary);
  //   }
  //   &.active {
  //     color: var(--color-primary);
  //   }
  // }

  // SIZE modifiers
  &._normal {
    .input {
      &__input {
        font-size: 16px;
        padding: 11px 15px;
      }
      &__icon,
      &__eye {
        font-size: 16px;
      }

      &__live-placeholder {
        font-size: 15px;
        left: 15px;
        top: 11px;
      }
    }
    &._focused {
      // .input {
      // }
    }
    &._ipos-left {
      .input {
        &__icons {
          left: 16px;
        }
        &__input {
          padding-left: 46px;
        }
      }
    }
    &._ipos-right {
      .input {
        &__icons {
          right: 16px;
        }
        &__input {
          padding-right: 46px;
        }
      }
    }
    &._error {
      .input {
        // &__input {
        //   padding-right: 84px;
        // }
      }
    }
    .suggestions {
      &__link {
        padding: 12px 20px;
      }
    }
  }

  &._focused {
    z-index: 4;
    .input {
      &__input {
        border-color: #7ca1bf;
      }
    }
  }

  &._error {
    .input {
      &__input {
        border-color: var(--color-red);
        color: var(--color-red);
      }
    }
  }
  &._disabled {
    .input {
      &__label {
        color: var(--color-disabled);
      }
    }
  }
  &._focused {
  }
}

.suggestions {
  transition: opacity 0.25s $ease;
  opacity: 0;
  pointer-events: none;
  &._active {
    opacity: 1;
    pointer-events: all;
  }
  &__list {
    margin: 4px 0 0;
    padding: 0;
    li {
      display: block;
    }
  }
  &__link {
    display: block;
    color: var(--color-gray);
    cursor: pointer;
    transition: color 0.25s $ease;
    :deep(span) {
      color: var(--color-primary);
      font-weight: 600;
    }
    &:hover {
      color: var(--color-primary);
    }
  }
}

@keyframes rotateLoader {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
</style>

<style lang="scss">
.ui-label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: calc(22 / 14);
  color: var(--color-gray);
}
</style>
