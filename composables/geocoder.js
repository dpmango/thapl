import { loadYmap } from 'vue-yandex-maps'
import { useCatchError } from '#imports'

export const useGeocoder = ({ searchRef, setFieldValue, setErrors, onMounted: onMountedCb }) => {
  const { $env, $ymConfig } = useNuxtApp()

  // Подсказки яндекс
  const ymapsInstance = ref(null)
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
      setFieldValue && setFieldValue('search', text)
      ymaps.geocode(text).then(geocoderHandler, useCatchError)
    })
  }

  // фильтрует по городам и убирает лишние строки из подсказок
  const transformSuggestions = (suggestions) => {
    for (let i = 0; i < suggestions.length; i++) {
      suggestions[i].displayName = suggestions[i].displayName.replace(', Россия', '')
      suggestions[i].value = suggestions[i].value.replace('Россия, ', '')
    }

    const searchedCities = $env.geocoderSearchedCities
      ? $env.geocoderSearchedCities.split(',')
      : null

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
    onMountedCb && onMountedCb(window.ymaps)
  })

  return {
    ymapsInstance,
    geocoderSuggestionObj,
  }
}
