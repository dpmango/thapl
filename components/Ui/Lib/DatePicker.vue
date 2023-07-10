<template>
  <div class="date-picker">
    <VueDatePicker
      format="dd.MM.yyyy"
      auto-apply
      placeholder="Выберите дату"
      hide-offset-dates
      :min-date="props.minDate"
      :max-date="props.maxDate"
      :day-names="days"
      :model-value="props.modelValue"
      :enable-time-picker="false"
      :state="!props.error"
      @update:model-value="emit('update:modelValue', $event)"
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
  minDate: {
    type: [String, Date],
    default: null,
  },
  maxDate: {
    type: [String, Date],
    default: null,
  },
  error: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const days: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const months: string[] = [
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
      max-width: 185px;
      @include r($sm) {
        max-width: 100%;
      }
    }

    &__input {
      padding-top: 11px;
      padding-bottom: 11px;
      border-radius: 23px;
    }

    &__overlay {
      border-radius: 23px;
    }

    &__input_invalid {
      box-shadow: none;
      border-width: 2px;
      border-color: var(--color-red);
    }

    &__input_valid {
      box-shadow: none;
      border-color: var(--dp-border-color);
    }
  }
}
</style>
