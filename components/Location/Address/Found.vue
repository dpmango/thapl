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

    <div class="location__info row">
      <div class="location__info-col col">
        <p class="text-s">Можем доставить</p>
        <h5 class="h5-title">
          <template v-if="zone.is_open">Сегодня</template>
          <template v-else>Завтра</template>
        </h5>
      </div>
      <div class="location__info-col col">
        <p class="text-s">Время доставки</p>
        <h5 class="h5-title">
          <template v-if="zone.organization.is_high_load_state">is_high_load_state - icon</template>
          <template v-if="zone.max_time">{{ formatMinutes(zone.max_time) }}</template>
        </h5>
      </div>
      <div v-if="workingTime" class="location__info-col col">
        <p class="text-s">Часы работы</p>
        <h5 class="h5-title">
          {{ workingTime }}
        </h5>
      </div>
      <div v-if="minOrderPrice" class="location__info-col col">
        <p class="text-s">Заказ от</p>
        <h5 class="h5-title">{{ formatPrice(minOrderPrice) }} ₽</h5>
      </div>
      <div v-if="zone.delivery_price" class="location__info-col col">
        <p class="text-s">Стоимость доставки</p>
        <h5 class="h5-title">{{ formatPrice(zone.delivery_price) }} ₽</h5>
      </div>
      <div v-if="zone.free_delivery_min_price" class="location__info-col col">
        <p class="text-s">Бесплатная доcтавка от</p>
        <h5 class="h5-title">{{ formatPrice(zone.free_delivery_min_price) }} ₽</h5>
      </div>
    </div>

    <div class="location__cta">
      <UiButton v-if="zone.is_open">Перейти к заказу</UiButton>
      <UiButton v-else>Сделать предзаказ</UiButton>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDeliveryStore } from '~/store'
import { formatMinutes, formatPrice } from '~/utils'

const props = defineProps({
  coordinates: {
    type: Array,
    default: () => [],
  },
  marker: {
    type: String,
    default: '',
  },
})

const deliveryStore = useDeliveryStore()
const { zone, workingTime, minOrderPrice } = storeToRefs(deliveryStore)
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
  &__info-col {
    margin-top: 16px;
    .h5-title {
      margin-top: 8px;
    }
  }
  &__cta {
    margin-top: 66px;
  }
}
</style>
