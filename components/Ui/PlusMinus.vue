<template>
  <div class="plusminus" :class="[`_${size}`]">
    <i class="plusminus__minus" @click="handleMinusClick" />
    <input
      class="plusminus__input"
      :value="value"
      inputmode="numeric"
      @keydown="preventInput"
      @input="(e) => handleChange(e.target.value)"
    />
    <i class="plusminus__plus" @click="handlePlusClick" />
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  maxValue: {
    type: Number,
    default: 99,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['medium', 'small'].includes(v),
  },
})

const emit = defineEmits(['onChange'])

const handlePlusClick = () => {
  handleChange(props.value + 1)
}

const handleMinusClick = () => {
  handleChange(props.value - 1)
}

const preventInput = (e) => {
  let prevent = false

  if (!Number.isFinite(+e.key)) prevent = true
  if (props.value >= props.maxValue) prevent = true
  if (['Backspace', 'ArrowRight', 'ArrowLeft'].includes(e.key)) prevent = false

  if (prevent) e.preventDefault()
}

const handleChange = (value) => {
  let emitValue = value

  if (!value) emitValue = 0
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
  }

  &__minus {
    &::after {
      display: none;
    }
  }
  &__input {
    flex: 0 1 auto;
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
}
</style>
