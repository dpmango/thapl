<template>
  <div
    class="toggle"
    :class="[`_${theme}`, `_${size}`, autosize && '_autosize', error && '_error']"
  >
    <label
      v-for="(item, idx) in list"
      :key="item.id || idx"
      class="toggle__item"
      :class="[value === (item.id || idx) && '_active', item.disabled && '_disabled']"
      @click.prevent="() => change(item.id || idx)"
    >
      <span class="toggle__text">
        {{ item.label || item }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { IToggleOption } from '~/interface/Ui'

const emit = defineEmits(['onChange'])

const props = defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  list: {
    type: Array as PropType<IToggleOption[]>,
    default: () => [],
  },
  error: {
    type: [String, Boolean],
    required: false,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v: string) => ['medium', 'small'].includes(v),
  },
  theme: {
    type: String,
    default: 'default',
    validator: (v: string) => ['default', 'spaced'].includes(v),
  },
  autosize: {
    type: Boolean,
    default: false,
  },
})

const change = (id) => {
  emit('onChange', id)
}
</script>

<style lang="scss" scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  position: relative;
  border-radius: 30px;
  background: var(--color-bg);
  &__item {
    flex: 0 0 auto;
    border-radius: 30px;
    cursor: pointer;
    transition: background 0.25s $ease, box-shadow 0.25s $ease;
    &._active {
      background: var(--component-background);
      box-shadow: var(--box-shadow-large);
      .toggle__text {
        color: var(--color-font);
      }
    }
    &._disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    &:hover {
      .toggle__text {
        color: var(--color-font);
      }
    }
  }
  &__text {
    font-weight: 500;
    color: var(--color-gray);
    transition: color 0.25s $ease;
  }

  &._spaced {
    flex-wrap: wrap;
    background: transparent;
    border-radius: 0;
    margin-bottom: -20px;
    .toggle {
      &__item {
        margin-right: 20px;
        margin-bottom: 20px;
        background: var(--color-bg);
        &:last-child {
          margin-right: 0;
        }
        &._active {
          background: var(--component-background);
        }
      }
    }
  }

  &._medium {
    .toggle {
      &__item {
        padding: 10px 24px;
      }
      &__text {
        font-size: 16px;
        line-height: calc(26 / 16);
      }
    }
  }

  &._small {
    .toggle {
      &__item {
        padding: 8px 16px;
      }
      &__text {
        font-size: 12px;
        line-height: calc(20 / 12);
      }
    }
  }

  &._autosize {
    display: flex;
    .toggle__item {
      flex: 1 1 auto;
      padding-left: 8px;
      padding-right: 8px;
      text-align: center;
    }
  }

  &._error {
    outline: 2px solid var(--color-red);
    &._spaced {
      outline: none;
      .toggle__item {
        outline: 2px solid var(--color-red);
      }
    }
  }
}
</style>
