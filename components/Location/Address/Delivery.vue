<template>
  <div class="delivery">
    <div v-if="!geoData.requested">
      <UiButton
        icon-left="location"
        theme="primary"
        size="small"
        :loading="geolocationLoading"
        @click="findMyLocation"
      >
        Найти меня
      </UiButton>

      <div class="list">
        <li v-for="address in userAddress" @click="setAddress(address)">
          <p class="text-m">{{ address.name }}</p>
          <p class="text-s c-gray">{{ address.description }}</p>
        </li>
      </div>
    </div>

    <div v-else-if="zone.found">
      <LocationAddressFound
        :coordinates="[geoData.latitude, geoData.longitude]"
        :marker="geoData.text"
      />
    </div>

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
const { zone, userAddress } = storeToRefs(deliveryStore)

const emit = defineEmits(['setSearch'])

// geolocation
const geoData = ref({
  requested: false,
  latitude: null,
  longitude: null,
  text: '',
})

const setAddress = async ({ latitude, longitude, fullText }) => {
  emit('setSearch', fullText)

  const zone = await deliveryStore.checkZone({ latitude, longitude })

  geoData.value = {
    requested: true,
    latitude,
    longitude,
    text: fullText,
  }
}

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

    await setAddress({ latitude, longitude, fullText: geocoderAddress })

    deliveryStore.saveAddress({
      latitude,
      longitude,
      name: geocoderTargetObj.name,
      description: geocoderTargetObj.description,
      fullText: geocoderAddress,
    })
  } catch {
    geolocationFailure({ code: 500 })
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
.list {
  margin-top: 12px;
  li {
    padding: 15px 0;
    border-bottom: 1px solid var(--color-border);
    cursor: pointer;
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
