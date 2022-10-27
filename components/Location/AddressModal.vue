<template>
  <UiModal name="address" size="large">
    <div class="address" :class="[`_type-${deliveryType}`]">
      <div class="address__head">
        <div class="h2-title">
          <template v-if="deliveryType === 1">Куда доставить?</template>
          <template v-else-if="deliveryType === 2">Откуда заберете?</template>
        </div>

        <UiToggle
          v-if="showDeliveryType"
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
      />
    </div>
  </UiModal>
</template>

<script setup>
import { loadYmap } from 'vue-yandex-maps'
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { useDeliveryStore, useSessionStore } from '~/store'

const { $env, $log, $ymConfig } = useNuxtApp()

const session = useSessionStore()
const deliveryStore = useDeliveryStore()

const { app_settings } = storeToRefs(session)

// тип доставки
const deliveryOptions = ref([
  { id: 1, label: 'Доставка' },
  { id: 2, label: 'Самовывоз' },
])

const showDeliveryType = computed(() => {
  return app_settings.value.takeaway_enabled || !$env.takeawayOnly
})

const deliveryType = ref(showDeliveryType.value ? 1 : 2)

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

const { value: search } = useField('search')

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
const ymapsInstance = ref(null)
const searchRef = ref(null)
const suggestView = ref(null)
const geocoderSuggestionObj = ref(null)

const initSuggestions = (ym) => {
  ymapsInstance.value = ym

  let boundedBy = null
  // преобразование env array
  if ($env.geocoderBoundedBy) {
    const boundArr = $env.geocoderBoundedBy.split(',')
    if (boundArr.length === 4) {
      boundedBy = [
        [boundArr[0], boundArr[1]],
        [boundArr[2], boundArr[3]],
      ]
    }
  }

  // конструктор SuggestView
  // https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/SuggestView.html
  suggestView.value = new ym.SuggestView(searchRef.value.inputRef, {
    ...{
      provider: {
        suggest: (request) => {
          return ymaps.suggest(request).then(transformSuggestions)
        },
      },
    },
    ...{ boundedBy },
  })

  // suggestView.value.state.events.add('change', _suggestStateChange)
  suggestView.value.events.add('select', (event) => {
    const text = event.get('item').value
    setFieldValue('search', text)
    ymaps.geocode(text).then(geocoderHandler, useCatchError)
  })
}

// фильтрует по городам и убирает лишние строки из подсказок
const transformSuggestions = (suggestions) => {
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].displayName = suggestions[i].displayName.replace(', Россия', '')
    suggestions[i].value = suggestions[i].value.replace('Россия, ', '')
  }

  const searchedCities = $env.geocoderSearchedCities ? $env.geocoderSearchedCities.split(',') : null

  if (searchedCities && suggestions.length) {
    return suggestions.filter((item) => searchedCities.some((city) => item.value.includes(city)))
  }

  return suggestions
}

// действия с результатом геокодера
const geocoderHandler = (res) => {
  const geoObject = res.geoObjects.get(0)

  let errorText = ''
  if (geoObject) {
    const precision = geoObject.properties.get('metaDataProperty.GeocoderMetaData.precision')
    // console.log({ precision })
    switch (precision) {
      case 'exact':
        errorText = ''
        break
      case 'number':
        break
      case 'near':
        break
      case 'range':
        errorText = 'Неточный адрес. Уточните номер дома'
        break
      case 'street':
        errorText = 'Неполный адрес. Уточните номер дома'
        break
      case 'other':
        errorText = 'Уточните адрес'
        break
      default:
        errorText = 'Уточните адрес'
    }
  } else {
    errorText = 'Адрес не найден. Уточните адрес'
  }

  if (errorText) {
    setErrors({ search: errorText })
    setTimeout(() => suggestView.value.state.set('panelClosed', false), 100)
    return
  }

  setErrors({ search: false })
  geocoderSuggestionObj.value = geoObject
  setTimeout(() => suggestView.value.state.set('panelClosed', true), 100)
}

onMounted(async () => {
  await loadYmap($ymConfig)
  initSuggestions(window.ymaps)
})
</script>

<style lang="scss" scoped>
.address {
  // &__title {
  // }
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
      top: 16px;
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
  &._type-2 {
    :deep(ymaps) {
      display: none !important;
    }
  }
}

@include r($md) {
  .address {
    &__head {
      display: block;
      .toggle {
        margin-top: 28px;
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
