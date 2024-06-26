<template>
  <div
    class="plusminus"
    :class="[`_${size}`, disabled && '_disabled', asInput && '_asinput', minWeight && ' _weight']"
  >
    <i class="plusminus__minus" @click="handleMinusClick" />

    <input
      v-if="minWeight === 0"
      class="plusminus__input"
      :value="value + productpricepm"
      inputmode="numeric"
      @keydown="preventInput"
      @input="(e: any) => handleChange(e.target.value)"
    />
    <span v-else class="plusminus__input">
      {{ weightDisplay }}
    </span>
    <i :class="['plusminus__plus', value === maxValue && '_hidden']" @click="handlePlusClick" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Number,
    required: true,
    default: 1,
  },
  minWeight: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  maxValue: {
    type: Number,
    default: 99,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 1,
  },
  isDeletable: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v: string) => ['medium', 'mediummodal', 'small'].includes(v),
  },
  asInput: {
    type: Boolean,
    default: false,
  },
  productpricepm: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['onChange'])

const weightDisplay = computed(() => {
  return formatGramm(props.value)
})

const handlePlusClick = () => {
  handleChange(props.value + props.step)
}

const handleMinusClick = () => {
  handleChange(props.value - props.step)
}

const preventInput = (e) => {
  let prevent = false

  if (!Number.isFinite(+e.key)) prevent = true
  if (props.value >= props.maxValue) prevent = true
  if (['Backspace', 'ArrowRight', 'ArrowLeft'].includes(e.key)) prevent = false

  if (prevent) e.preventDefault()
}

const handleChange = (value) => {
  if (props.disabled) return
  let emitValue = value

  if (!value) emitValue = 0

  // исключения минимального веса для весовых товаров
  if (props.minWeight) {
    if (value < props.minWeight) emitValue = 0
  } else if (value < props.minValue) {
    emitValue = 0
  }

  if (value > props.maxValue) emitValue = props.maxValue
  if (!Number.isFinite(+value)) emitValue = props.value

  emit('onChange', +emitValue)
}
</script>

<style lang="scss" scoped>
.plusminus {
  display: inline-flex;
  align-items: center;
  background: var(--color-bg);
  border-radius: 24px;
  &__plus,
  &__minus {
    flex: 0 0 auto;
    position: relative;
    z-index: 2;
    cursor: pointer;
    transition: opacity 0.2s $ease;
    &::before,
    &::after {
      display: inline-block;
      content: ' ';
      position: absolute;
      top: 50%;
      border-radius: 1px;
      background: var(--plusminus-control-color);
      transition: background 0.25s $ease;
    }
    &::before {
      transform: translate(0, -50%);
    }
    &::after {
      transform: translate(0, -50%) rotate(90deg);
    }
    &:hover {
      &::before,
      &::after {
        background: var(--color-primary);
      }
    }
    &._hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__minus {
    &::after {
      display: none;
    }
  }
  &__input {
    flex: 1 1 auto;
    width: min-content;
    -webkit-appearance: none;
    font-weight: 500;
    line-height: 1.5;
    min-width: 1px;
    background: transparent;
    border: 0;
    box-shadow: none;
    text-align: center;
    color: var(--color-font);
  }

  &._medium {
    max-width: 127px;
    .plusminus {
      &__plus,
      &__minus {
        width: calc(14px + 16px + 16px);
        padding: 22px 16px;
        &::before,
        &::after {
          width: 14px;
          height: 2px;
        }
      }
      &__input {
        padding: 9px 0px;
        font-size: 16px;
      }
    }
  }

  &._mediummodal {
    .plusminus {
      &__plus,
      &__minus {
        width: calc(14px + 16px + 16px);
        padding: 22px 16px;
        &::before,
        &::after {
          width: 14px;
          height: 2px;
        }
      }
      &__input {
        padding: 9px 0px;
        font-size: 16px;
      }
    }
  }
  &._small {
    max-width: 104px;
    .plusminus {
      &__plus,
      &__minus {
        width: calc(12px + 12px + 12px);
        padding: 14px 12px;
        &::before,
        &::after {
          width: 12px;
          height: 2px;
        }
      }
      &__input {
        padding: 8px 0px;
        font-size: 14px;
      }
    }
  }
  &._asinput {
    max-width: 100%;
    width: 100%;
    border-radius: var(--input-border-radius);
    background: var(--input-background-color);
    border: 1px solid var(--color-border);
    .plusminus {
      &__input {
        order: 1;
        text-align: left;
        padding-left: 16px;
        padding-right: 16px;
      }
      &__minus {
        order: 2;
        border-left: 1px solid var(--color-separator);
      }
      &__plus {
        order: 3;
        border-left: 1px solid var(--color-separator);
      }
    }
  }

  &._weight {
    max-width: 100%;
    .plusminus {
      &__input {
        white-space: nowrap;
      }
    }
  }

  &._disabled {
    pointer-events: none;
    .plusminus {
      &__minus,
      &__plus {
        opacity: 0;
      }
    }
  }
}
</style>
