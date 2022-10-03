<template>
  <div class="digits">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      ref="inputRefs"
      class="digit"
      maxlength="1"
      type="text"
      :value="digit"
      @keydown="(e) => handleKeyBackspace(e, index)"
      @input="(e: any) => handleChangeDigits(e.target.value, index)"
    />
  </div>
</template>

<script setup lang="ts">
const initialDigits = Array.from<string>({ length: 4 }).fill('')
const enLettersRegex = /^[a-zA-Z]+$/

const props = defineProps({
  allowLetters: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onChange'])

const digits = ref(initialDigits)
const inputRefs = ref([])

const updateDigits = (i: number, value: string) => {
  if (!props.allowLetters && +value < 0 && +value > 9) {
    return
  } else if (props.allowLetters && +value < 0 && +value > 9 && !enLettersRegex.test(value)) {
    return
  }

  const newDigits = [...digits.value]
  newDigits[i] = props.allowLetters ? value.toUpperCase() : value.replace(/[^\d]$/, '')
  emit('onChange', newDigits.join(''))
  digits.value = newDigits
}

const handleChangeDigits = (value: string, i: number) => {
  if (!props.allowLetters && isNaN(+value)) {
    return
  } else if (props.allowLetters && isNaN(+value) && !enLettersRegex.test(value)) {
    return
  }

  updateDigits(i, value)

  if (i < inputRefs.value.length - 1) {
    inputRefs.value[i + 1].focus({ cursor: 'all' })
  } else if (i !== inputRefs.value.length - 1) {
    inputRefs.value[i].blur()
  }
}

const handleKeyBackspace = (event: KeyboardEvent, i: number) => {
  const keyPressed = event.key
  if (keyPressed !== 'Backspace') return

  if (digits.value[i]) {
    updateDigits(i, '')
  } else if (i > 0) {
    updateDigits(i - 1, '')
    inputRefs.value[i - 1].focus()
  }
}
</script>

<style lang="scss" scoped>
.digits {
  display: flex;
  max-width: 212px;
  margin-left: auto;
  margin-right: auto;
  .digit {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.digit {
  flex: 0 1 auto;
  position: relative;
  z-index: 2;
  min-width: 1px;
  -webkit-appearance: none;
  border: 1px solid var(--color-border);
  background: white;
  border-radius: var(--input-border-radius);
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  font-size: 20px;
  padding: 11px 15px;
  transition: border 0.25s $ease;
  &::placeholder {
    color: var(--color-disabled);
  }
  &:focus,
  &:active {
    border-color: var(--color-font);
    outline: 4px solid rgba(0, 97, 174, 0.3);
  }
  &:hover {
    outline: none;
    border-color: var(--color-font);
  }
}
</style>
