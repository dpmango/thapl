<template>
  <div
    class="select"
    :class="[{ 'has-error': error }, theme, opened && 'is-opened', value && 'has-value']"
  >
    <label v-if="label" class="select__label" :for="id">{{ getLabel }}</label>

    <vue-select
      :id="id"
      v-model="valueModel"
      :options="options"
      :error="error"
      :placeholder="placeholder"
      :searchable="searchable"
      v-bind="$attrs"
      @option:selected="setSelected"
      @open="opened = true"
      @close="opened = false"
    >
      <template #open-indicator="{ attributes }">
        <span v-bind="attributes">
          <nuxt-icon name="chevron-down" />
        </span>
      </template>
      <template #no-options="{}">
        <span> Не найдено</span>
      </template>
    </vue-select>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
// @ts-ignore
import VueSelect from 'vue-select'
import { ISelect } from '~/interface/Ui'

const id = nanoid()

defineComponent(VueSelect)
const emit = defineEmits(['onSelect'])

const props = defineProps({
  value: {
    type: Object,
    required: false,
    default() {
      return null
    },
  },
  options: {
    type: Array,
    required: true,
    default() {
      return []
    },
  },
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: 'Выберите',
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    required: false,
  },
  error: {
    type: [String, Array],
    required: false,
  },
})

// state
const valueModel = ref(props.value)
const opened = ref(false)

const getLabel = computed(() => {
  return typeof props.error === 'string' ? props.error : props.label
})

const setSelected = (v: ISelect) => {
  emit('onSelect', v)
}

watch(
  () => valueModel.value,
  (newVal) => {
    emit('onSelect', newVal)
  }
)
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  &.has-error {
    .select__label {
      color: var(--color-red);
    }
  }
}
</style>

<style lang="scss">
@import 'vue-select/dist/vue-select.css';

.select {
  .vs__dropdown-toggle {
    background: transparent;
    border: 2px solid var(--color-border);
    padding: 0;
    border-radius: 20px;
    transition: border 0.25s $ease, background 0.25s $ease;
    &:hover {
      background-color: transparent;
    }
  }

  .vs__selected-options {
    padding: 0;
    min-width: 1px;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow: hidden;
  }

  .vs__search,
  .vs__search:focus {
    margin: 0;
    padding: 12px 0 12px 20px;
    font-family: var(--font-base);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.35;
    border: 0;
    color: var(--color-gray);
  }

  .vs__selected {
    position: relative;
    color: var(--color-font);
    background: transparent;
    margin: 0;
    padding: 12px 20px;
    border: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.35;
    + .vs__selected {
      padding-left: 0;
      margin-left: -6px;
      &::before {
        display: inline-block;
        content: ',';
        position: absolute;
        left: -13px;
        top: 13px;
      }
    }
    + .vs__search {
      margin-left: 0px;
      // padding-left: 0;
    }
  }

  .vs__actions {
    padding-top: 0;
    padding-right: 25px;
  }

  .vs__open-indicator {
    flex: 0 0 auto;
    fill: var(--color-gray) !important;
    font-size: 0;
    .nuxt-icon {
      font-size: 8px;
    }
  }

  .vs__dropdown-menu {
    top: calc(100% - 1px);
    padding: 0;
    border: 0;
    background: white;
    border: 0px solid transparent;
    border-radius: 0 0 20px 20px;
    box-shadow: 0px 4px 15px rgba(105, 78, 75, 0.14);
  }

  .vs__dropdown-option {
    position: relative;
    padding: 14px 20px;
    color: var(--color-font);
    font-family: var(--font-base);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background 0.1s $ease, color 0.25s $ease;
  }

  .vs__dropdown-option--highlight {
    background: #ecf4fd;
    color: var(--color-font);
  }

  .vs__dropdown-option--selected {
    padding-right: 16px;
  }

  .vs__no-options {
    padding: 14px 20px;
    font-size: 14px;
    text-align: center;
  }

  .vs__clear {
    display: none;
    margin-right: 12px;
    font-size: 0;
    .nuxt-icon {
      font-size: 10px;
    }
    &:hover {
      color: var(--color-primary);
    }
  }

  &.has-error {
    .vs__dropdown-toggle {
      border-color: var(--color-red);
    }
  }

  .vs--open {
    .vs__open-indicator {
      transform: none;
    }
    .vs__dropdown-toggle {
      border-color: var(--color-font);
    }
  }

  &.ghost {
    .vs__dropdown-toggle {
      border-color: transparent;
    }
    .vs__search,
    .vs__search:focus {
      padding: 6px 0;
    }
    .vs__selected {
      padding: 6px 0;
    }

    // &.vs--open {
    //   .vs__dropdown-toggle {
    //     border-color: var(--color-font);
    //   }
    // }
  }
}
</style>
