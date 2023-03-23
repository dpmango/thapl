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

<script setup lang="ts">
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
    z-index: 1;
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
    margin-bottom: -12px;
    display: flex;
    flex-wrap: wrap;
    .button {
      margin-right: 12px;
      margin-bottom: 12px;
    }
  }
}

@include r($md) {
  .location {
    &__info {
      margin-top: 4px;
    }
    &__map {
      height: 180px;
    }
  }
}

@include r($sm) {
  .location {
    padding-bottom: calc(76px - 24px + 16px);
    &__map {
      height: 105px;
    }
    &__cta,
    :deep(.location__cta) {
      position: absolute;
      z-index: 2;
      bottom: 0;
      left: 0;
      right: 0;
      margin-top: 0px;
      padding: 16px 24px;
      background: var(--modal-body-background);
      box-shadow: var(--box-shadow-extra-large);
      button {
        width: 100%;
      }
    }
  }
}
</style>
