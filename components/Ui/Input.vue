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

      <div ref="iconsRef" class="input__icons">
        <i v-if="loading" class="input__icon _loading">
          <nuxt-icon name="loading" />
        </i>
        <i
          v-if="!showError && value.length && clearable"
          class="input__icon _clear"
          @click="clearInput"
        >
          <nuxt-icon name="close" />
        </i>
        <i v-if="showError && clearable" class="input__icon _error" @click="clearInput">
          <nuxt-icon name="close" />
        </i>
        <i v-if="icon" class="input__icon">
          <nuxt-icon :name="icon" />
        </i>
        <span v-if="changable" class="input__changable" @click="emit('onChangable')">
          <span v-if="typeof changable === 'string'">{{ changable }}</span>
          <span v-else>Изменить</span>
        </span>
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

    <div v-if="helper" class="input__helper text-s c-gray">{{ helper }}</div>
    <div
      v-if="maxCount"
      class="input__helper text-s c-gray"
      :class="[value.length > maxCount && 'c-red']"
    >
      {{ value.length }}/{{ maxCount }}
    </div>

    <div v-if="showErrorText" class="input__error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { nanoid } from 'nanoid'
import { capitalizeFirstLetter } from '#imports'
// const { $sanitize } = useNuxtApp()

const id = nanoid()
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits(['onChange', 'onChangable'])

defineExpose({ inputRef })

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
  name: {
    type: String,
    default: '',
  },
  helper: {
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
  changable: {
    type: [Boolean, String],
    default: false,
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
    default: true,
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
  maxCount: {
    type: Number,
    required: false,
  },
  // https://github.com/beholdr/maska
  mask: {
    type: [Object, String],
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
  `_ipos-${props.iconPosition}`,
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
  return !!props.error && !isFocused.value
})

const setValue = (e) => {
  const value = e.target.value

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
  if (e.target.getAttribute('id') === id) {
    if (e.target.hasAttribute('autocompleted')) {
      isFocused.value = true
    }
  }
}

// inputs width watcher
const iconsRef = ref(null)

const setInputOffsets = () => {
  // if (props.iconPosition === 'left') return
  try {
    if (iconsRef.value && inputRef.value) {
      const iconsWidth = iconsRef.value.offsetWidth + 15 + 10
      inputRef.value.style[
        `padding${capitalizeFirstLetter(props.iconPosition)}`
      ] = `${iconsWidth}px`
    }
  } catch {}
}

watch(
  () => [props.value, props.error],
  () => {
    nextTick(setInputOffsets)
  }
)

// error
const showErrorText = computed(() => {
  if (isFocused.value) return false
  return typeof props.error === 'string'
})

const currentInputType = computed(() => {
  return props.type
})

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
const suggestionsList = ref<any[]>([])
const suggestionsVisible = ref(false)
const loading = ref(false)

const showSuggestions = computed(() => {
  return suggestionsVisible.value && suggestionsList.value.length
})

const handleSuggestion = async (text) => {
  loading.value = true

  const suggestions = (await useApi(props.suggestions, {
    params: {
      text,
    },
  })) as any[]

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

  inputRef.value?.focus()
}

// textarea autosize
const height = ref('')
const resizeTextarea = () => {
  height.value = 'auto !important'
  nextTick(() => {
    if (!inputRef.value) return
    const style = window.getComputedStyle(inputRef.value)
    const padding = parseInt(style.paddingTop) + parseInt(style.paddingBottom)
    const lineHeight = parseInt(style.lineHeight)
    const maxHeight = lineHeight * props.maxRows + padding + 2

    let newHeight = inputRef.value?.scrollHeight + 2
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

// hooks
onMounted(() => {
  if (props.focusOnMount) {
    inputRef.value?.focus()
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1;
  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
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
    transition-property: border, color, background, box-shadow;
    transition-duration: 0.25s;
    transition-timing-function: $ease;
    &::placeholder {
      color: var(--color-disabled);
    }
    &:focus,
    &:active {
      border-color: var(--color-font);
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 97, 174, 0.3);
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
    min-width: 16px;
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

  &__changable {
    font-weight: 500;
    font-size: 14px;
    line-height: calc(22 / 14);
    color: var(--color-primary);
    cursor: pointer;
    transition: color 0.25s $ease;
    &:hover {
      color: var(--color-font);
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

  &__helper {
    margin-top: 12px;
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
