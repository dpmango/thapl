<template>
  <UiModal name="address" size="large">
    <div class="address" :class="[`_type-${deliveryType}`]">
      <div class="address__head">
        <div class="h2-title">
          <template v-if="deliveryType === 1">Куда доставить?</template>
          <template v-else-if="deliveryType === 2">Откуда заберете?</template>
        </div>

        <UiToggle
          v-if="showTakeaway"
          class="address__toggle"
          :list="deliveryOptions"
          :value="deliveryType"
          @on-change="handleDeliveryTypeChange"
        />
      </div>

      <div class="address__search">
        <UiInput
          ref="searchRef"
          name="address"
          type="text"
          :placeholder="placeholderText"
          icon="location"
          icon-position="left"
          :value="search"
          :error="errors.search"
          @on-change="handleSearchChange"
        />
      </div>

      <LocationAddressDelivery
        v-if="deliveryType === 1"
        class="address__delivery"
        :geocoder-suggestion-obj="geocoderSuggestionObj"
        @set-search="(v) => setFieldValue('search', v)"
      />

      <LocationAddressTakeaway
        v-if="deliveryType === 2"
        class="address__delivery"
        :search="search"
        @set-search="(v) => setFieldValue('search', v)"
      />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { useDeliveryStore, useSessionStore } from '~/store'

const { $env, $log, $ymConfig } = useNuxtApp()

const session = useSessionStore()
const deliveryStore = useDeliveryStore()
const { currentAddress } = storeToRefs(deliveryStore)
const { app_settings } = storeToRefs(session)

// тип доставки
const deliveryOptions = ref([
  { id: 1, label: 'Доставка' },
  { id: 2, label: 'Самовывоз' },
])

const showTakeaway = computed(() => {
  if ($env.takeawayOnly) return false
  return app_settings.value.takeaway_enabled
})

const deliveryType = ref($env.takeawayOnly ? 2 : 1)

const handleDeliveryTypeChange = (v) => {
  deliveryType.value = v
  setFieldValue('search', '')
  deliveryStore.setCurrentAddress(null)
}

// работа с поиском
const loading = ref(false)
const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { search: '' },
})

const { value: search } = useField<string>('search')

const placeholderText = computed(() => {
  if (deliveryType.value === 1) {
    return 'Укажите новый адрес'
  } else if (deliveryType.value === 2) {
    return 'Найти ресторан'
  }

  return ''
})

const handleSearchChange = (v) => {
  setFieldValue('search', v)
  deliveryStore.setCurrentAddress(null)
}

// Подсказки яндекс
const searchRef = ref(null)
const suggestionsDisabled = computed(() => deliveryType.value === 2)
const { ymapsInstance, geocoderSuggestionObj } = useGeocoder({
  searchRef,
  disabled: suggestionsDisabled,
  setFieldValue,
  setErrors,
})

// обнуление поиска
watch(
  () => currentAddress.value,
  (newCurAddr) => {
    if (!newCurAddr) {
      search.value = ''
    }
  }
)
</script>

<style lang="scss" scoped>
.address {
  // &__title {
  // }
  min-height: 440px;
  &__head {
    display: flex;
    align-items: center;
  }
  &__toggle {
    margin-left: auto;
    flex: 0 0 auto;
  }
  &__search {
    margin-top: 28px;
    :deep(.ymaps-2-1-79-search__suggest) {
      top: 22px;
      border: 0;
      border-radius: var(--input-border-radius);
      overflow: hidden;
    }
    :deep(.ymaps-2-1-79-suggest-item) {
      margin: 0;
      font-family: var(--font-base);
      font-size: 16px;
      line-height: 26px;
      border-bottom: 1px solid var(--color-border);
    }
    :deep(.ymaps-2-1-79-search__suggest-item) {
      padding: 19px 24px;
      transition: background 0.25s $ease;
    }
    :deep(.ymaps-2-1-79-search__suggest-item_selected_yes) {
      background: var(--color-bg);
    }
    :deep(.ymaps-2-1-79-search__suggest-highlight) {
      font-weight: 500;
    }
  }
  &__delivery {
    margin-top: 28px;
  }
}

@include r($md) {
  .address {
    &__head {
      display: block;
      .toggle {
        margin-top: 28px;
        // autosize
        display: flex;
        :deep .toggle__item {
          flex: 1 1 auto;
          padding-left: 8px;
          padding-right: 8px;
          text-align: center;
        }
      }
    }
    &__search {
      margin-top: 16px;
      :deep(.ymaps-2-1-79-search__suggest-item) {
        padding: 12px 16px;
      }
    }
    &__delivery {
      margin-top: 16px;
    }
  }
}
</style>
