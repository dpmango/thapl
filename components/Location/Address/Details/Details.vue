<template>
  <div class="location">
    <ClientOnly>
      <div class="location__map">
        <YandexMap
          :coordinates="coordinates"
          :zoom="15"
          :controls="['zoomControl']"
          :scroll-zoom="false"
        >
          <YandexMarker :marker-id="1" :coordinates="coordinates">
            <template #component>
              <div class="text-m">{{ marker }}</div>
            </template>
          </YandexMarker>
        </YandexMap>
      </div>
    </ClientOnly>

    <div class="location__info">
      <LocationAddressDetailsOrganization v-if="organization" :organization="organization" />
      <LocationAddressDetailsZone v-else />
    </div>
  </div>
</template>

<script setup>
// Отображение зависит от полученного prop organization
// (откуда получены данные, разные ключи и параметры)
import { storeToRefs } from 'pinia'
import { useDeliveryStore } from '~/store'

const props = defineProps({
  coordinates: {
    type: Array,
    default: () => [],
  },
  marker: {
    type: String,
    default: '',
  },
  organization: {
    type: Object,
    default: null,
  },
})

const deliveryStore = useDeliveryStore()
const { zone } = storeToRefs(deliveryStore)
</script>

<style lang="scss" scoped>
.location {
  &__map {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: var(--map-border-radius);
    overflow: hidden;
    height: 240px;
    background: var(--color-bg);
    > section {
      flex: 1 1 auto;
      height: 100%;
    }
    :deep(.yandex-balloon) {
      width: 140px;
      height: 80px;
    }
  }
  &__info {
    margin-top: 12px;
  }
  &__cta,
  :deep(.location__cta) {
    margin-top: 66px;
  }
}
</style>
