<template>
  <div class="delivery">
    <template v-if="!geoData.requested">
      <UiButton
        icon-left="location"
        theme="primary"
        size="small"
        :loading="geolocationLoading"
        @click="findMyLocation"
      >
        Найти меня
      </UiButton>

      <ul class="delivery__list">
        <LocationAddressList
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
        <UiButton href="https://t.me/r" target="_blank">Написать в Телеграм</UiButton>
      </template>
    </UiAtomErrorMessage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { YandexGeocoderResponce } from '~/interface/Geolocation'
import { useDeliveryStore } from '~/store'

const toast = useToast()
const { $env } = useNuxtApp()

const deliveryStore = useDeliveryStore()
const { zone, userAddress, currentAddress } = storeToRefs(deliveryStore)

const emit = defineEmits(['setSearch'])

const props = defineProps({
  geocoderSuggestionObj: Object,
})

// geolocation
const geoData = ref({
  requested: false,
  latitude: null,
  longitude: null,
  text: '',
})

// Приходит от родительского компонента с поиском
watch(
  () => props.geocoderSuggestionObj,
  async (newVal) => {
    const coordinates = newVal.geometry._coordinates
    const data = newVal.properties._data

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
  { latitude, longitude, name, description, fullText },
  setInput = true
) => {
  if (setInput) emit('setSearch', fullText)

  const zone = await deliveryStore.checkZone({ latitude, longitude })

  // store
  deliveryStore.setCurrentAddress({
    type: 'delivery',
    name,
    latitude,
    longitude,
    org_id: zone.organization.id,
  })

  // display component
  geoData.value = {
    requested: true,
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
        latitude: null,
        longitude: null,
        text: '',
      }
    }
  }
)

const geolocationLoading = ref(false)

const findMyLocation = () => {
  if (navigator.geolocation) {
    geolocationLoading.value = true
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure)
  } else {
    toast.error('Ваш браузер не поддерживает геолокацию')
    geolocationLoading.value = false
  }
}

const geolocationSuccess = async (position) => {
  if (!position.coords.latitude || !position.coords.longitude) {
    return null
  }

  geolocationLoading.value = true
  const { latitude, longitude } = position.coords

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
      description: geocoderTargetObj.description,
      fullText: geocoderAddress,
    })
  } catch {
    geolocationFailure({ code: 500 })
    geolocationLoading.value = false
  }

  geolocationLoading.value = false
}

const geolocationFailure = (positionError) => {
  try {
    if (positionError.code === 1) {
      toast.error('Разрешите геолокацию в браузере')
    } else if (positionError.code === 500) {
      toast.error('Ошибка, попробуйте еще раз')
    } else {
      throw new Error('unknown')
    }
  } catch {
    toast.error('Ошибка в определении координаты')
  }
}
</script>

<style lang="scss">
.delivery {
  &__list {
    margin-top: 12px;
  }
}
</style>
