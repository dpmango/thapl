<template>
  <div class="date-picker">
    <VueDatePicker
      format="dd.MM.yyyy"
      auto-apply
      placeholder="Выберите дату"
      :day-names="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
      :months="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
      :model-value="props.modelValue"
      :enable-time-picker="false"
      @update:modelValue="emit('update:modelValue', $event)"
    >
      <template #month-overlay-value="{ value }">
        {{ months[value] }}
      </template>
      <template #month="{ value }">
        {{ months[value] }}
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/css/elements/_date-picker.scss'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const months: any = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
]
</script>

<style lang="scss">
.date-picker {
  .dp {
    &__main {
      max-width: 180px;
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
