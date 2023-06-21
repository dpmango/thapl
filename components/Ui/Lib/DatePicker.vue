<template>
  <div class="date-picker">
    <VueDatePicker
      :model-value="props.modelValue"
      format="dd.MM.yyyy"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.date-picker {
  .dp {
    &__main {
      max-width: 175px;
      @include r($sm) {
        max-width: 100%;
      }
    }
    &__input {
      padding-top: 11px;
      padding-bottom: 11px;
      border-radius: var(--input-border-radius);
    }
  }
}
</style>
