<template>
  <div class="delivery">
    <template v-if="!geoData.requested">
      <UiButton
        icon-left="location"
        theme="primary"
        size="small"
        :loading="geolocationLoading"
        @click="getUserLocation"
      >
        Найти меня
      </UiButton>

      <ul class="delivery__list">
        <UiAtomAddressRow
          v-for="(address, idx) in userAddress"
          :key="idx"
          :title="address.name"
          :description="[address.description]"
          @click="setAddress(address)"
        />
      </ul>
    </template>

    <template v-else-if="zone.found">
      <LocationAddressDetails
        :coordinates="[geoData.latitude, geoData.longitude]"
        :marker="geoData.text"
      />
    </template>

    <UiAtomErrorMessage v-else title="Плохие новости">
      <template #content>
        По выбранному адресу мы не доставляем заказы, но вы можете написать нам. Возможно, мы его
        добавим в будущем в зону доставки.
      </template>
      <template #action>
        <UiButton v-if="tg" :href="buildLink(tg)" target="_blank"> Написать в Телеграм </UiButton>
      </template>
    </UiAtomErrorMessage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { IGeoCoords, IGeoDataRef, YandexGeocoderResponce } from '~/interface/Geolocation'
import { useDeliveryStore, useProductStore, useSessionStore } from '~/store'
import { buildLink } from '#imports'

const toast = useToast()
const { $env } = useNuxtApp()

const productStore = useProductStore()
const deliveryStore = useDeliveryStore()
const sessionStore = useSessionStore()
const {
  app_settings: { default_phone, tg },
} = sessionStore
const { zone, userAddress, currentAddress } = storeToRefs(deliveryStore)

const emit = defineEmits(['setSearch'])

const props = defineProps({
  geocoderSuggestionObj: Object,
})

// geolocation
const geoData = ref<IGeoDataRef>({
  requested: false,
  found: false,
  latitude: null,
  longitude: null,
  text: '',
})

// Приходит от родительского компонента с поиском
watch(
  () => props.geocoderSuggestionObj,
  async (newVal) => {
    const coordinates = newVal?.geometry._coordinates
    const data = newVal?.properties._data

    await setAddress(
      {
        latitude: coordinates[0],
        longitude: coordinates[1],
        name: data.name,
        description: data.description,
        fullText: data.text,
      },
      false
    )
  }
)

const setAddress = async (
  {
    latitude,
    longitude,
    name,
    description,
    fullText,
  }: { latitude: number; longitude: number; name: string; description: string; fullText: string },
  setInput = true
) => {
  if (setInput) emit('setSearch', fullText)

  const zone = await deliveryStore.checkZone({ latitude, longitude })
  if (!zone.found) {
    geoData.value = {
      requested: true,
      found: true,
      latitude: null,
      longitude: null,
      text: '',
    }
    return
  }

  // store
  deliveryStore.setCurrentAddress({
    type: 'delivery',
    name,
    latitude,
    longitude,
    org_id: zone.organization.id,
  })

  if (zone.organization.has_spec_prices) {
    productStore.getCatalog()
  }

  // display component
  geoData.value = {
    requested: true,
    found: true,
    latitude,
    longitude,
    text: fullText,
  }

  // localstorage
  deliveryStore.saveAddress({
    latitude,
    longitude,
    name,
    description,
    fullText,
  })
}

watch(
  () => currentAddress.value,
  (newVal) => {
    if (!newVal) {
      geoData.value = {
        requested: false,
        found: false,
        latitude: null,
        longitude: null,
        text: '',
      }
    }
  }
)

// Геолокация
const onGeolocationSuccess = async ({ latitude, longitude }: IGeoCoords) => {
  const geocoderResponce = (await useApi(
    `https://geocode-maps.yandex.ru/1.x/?geocode=${longitude},${latitude}&apikey=${$env.yandexMapsKey}&lang=ru&format=json`,
    { method: 'GET' },
    { externalUrl: true }
  )) as YandexGeocoderResponce

  try {
    const geocoderTargetObj =
      geocoderResponce.response.GeoObjectCollection.featureMember[0].GeoObject

    const geocoderAddress = geocoderTargetObj.metaDataProperty.GeocoderMetaData.Address.formatted

    await setAddress({
      latitude,
      longitude,
      name: geocoderTargetObj.name,
      description: geocoderTargetObj.description || '',
      fullText: geocoderAddress,
    })
  } catch {
    geolocationFailure({ code: 500 })
    geolocationLoading.value = false
  }
}

const { geolocationLoading, getUserLocation, geolocationFailure } = useGeolocation({
  onGeolocationSuccess,
})
</script>

<style lang="scss" scoped>
.delivery {
  &__list {
    margin-top: 12px;
  }
}
</style>
