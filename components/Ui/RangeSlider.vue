<template>
  <div class="range" :class="modifiers">
    <label v-if="label" class="input__label text-s c-gray" :for="id">{{ label }}</label>
    <div class="range__wrapper">
      <div class="range__tooltip text-xs">{{ display.value }}</div>
      <input
        :id="id"
        ref="inputRef"
        type="range"
        class="range__input"
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        :list="`tick_${id}`"
        @input="setValue"
      />
      <datalist :id="`tick_${id}`" class="range__ticks">
        <option :value="min" :label="display.min" />
        <option :value="max" :label="display.max" />
      </datalist>
    </div>
    <div v-if="showErrorText" class="range__error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { minutesToTimestamp } from '#imports'

const id = nanoid()
const inputRef = ref(null)

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  // modifiers
  minutes: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, Boolean],
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onChange'])

const modifiers = computed(() => [
  props.error && '_error',
  props.disabled && '_disabled',
  // `_${props.theme}`,
  // `_${props.size}`,
])

const setValue = (e) => {
  emit('onChange', e.target.value)
}

// display
const display = computed(() => {
  if (props.minutes) {
    return {
      min: minutesToTimestamp(props.min),
      max: minutesToTimestamp(props.max),
      value: minutesToTimestamp(props.value),
    }
  }

  return {
    min: props.min,
    max: props.max,
    value: props.value,
  }
})

const displayMax = computed(() => {
  if (props.minutes) {
    return minutesToTimestamp(props.max)
  }

  return props.max
})

// error
const showErrorText = computed(() => {
  return typeof props.error === 'string'
})
</script>

<style lang="scss" scoped>
.range {
  margin-top: -10px;
  &__wrapper {
    padding-top: 28px;
    position: relative;
  }
  &__input {
    -webkit-appearance: none;
    height: 6px;
    width: 100%;
    margin: 0;
    background: transparent;
    &:focus {
      outline: none;
    }
    &::-ms-track {
      width: 100%;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    // thumb
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: 0;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--color-primary);
      cursor: pointer;
      margin-top: -6px;
      box-shadow: 0;
    }
    &::-moz-range-thumb {
      box-shadow: 0;
      border: 0;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--color-primary);
      cursor: pointer;
    }
    &::-ms-thumb {
      box-shadow: 0;
      border: 0;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--color-primary);
      cursor: pointer;
    }

    // track
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      box-shadow: none;
      background: var(--color-bg);
      border-radius: 2px;
      border: 0;
    }

    &:focus::-webkit-slider-runnable-track {
      background: var(--color-bg);
    }

    &::-moz-range-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      box-shadow: none;
      background: var(--color-bg);
      border-radius: 2px;
      border: 0;
    }

    &::-ms-track {
      width: 100%;
      height: 8.4px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      border-width: 16px 0;
      color: transparent;
    }
    &::-ms-fill-lower {
      background: #2a6495;
      border: none;
      border-radius: 2px;
      box-shadow: none;
    }
    &:focus::-ms-fill-lower {
      background: var(--color-bg);
    }
    &::-ms-fill-upper {
      background: var(--color-bg);
      border: 0;
      border-radius: 2px;
      box-shadow: none;
    }
    &:focus::-ms-fill-upper {
      background: var(--color-bg);
    }
  }

  &__tooltip {
    position: absolute;
    top: 0;
    left: 0;
    padding: 8px 15px;
    background: #ffffff;
    box-shadow: 0px 16px 48px rgba(0, 0, 0, 0.08);
    font-weight: 500;
  }

  &__ticks {
    display: flex;
    justify-content: space-between;
    option {
      margin-top: 16px;
      padding: 0;
      font-size: 12px;
      color: var(--color-gray);
      pointer-events: none;
    }
  }

  &__error {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--color-red);
  }
}
</style>
