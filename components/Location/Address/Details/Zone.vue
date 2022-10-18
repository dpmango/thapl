<template>
  <div class="info row">
    <div class="info__col col">
      <p class="text-s">Можем доставить</p>
      <h5 class="info__value h5-title">
        <template v-if="zone.is_open">Сегодня</template>
        <template v-else><strong>Завтра</strong></template>
      </h5>
    </div>
    <div class="info__col col">
      <p class="text-s">Время доставки</p>
      <h5 class="info__value h5-title">
        <NuxtIcon v-if="zone.organization.is_high_load_state" name="high-load" />
        <template v-if="zone.max_time">{{ formatMinutes(zone.max_time) }}</template>
      </h5>
    </div>
    <div v-if="workingTime" class="info__col col">
      <p class="text-s">Часы работы</p>
      <h5 class="info__value h5-title">
        {{ workingTime }}
      </h5>
    </div>
    <div v-if="minOrderPrice" class="info__col col">
      <p class="text-s">Заказ от</p>
      <h5 class="info__value h5-title">{{ formatPrice(minOrderPrice) }} ₽</h5>
    </div>
    <div v-if="zone.delivery_price" class="info__col col">
      <p class="text-s">Стоимость доставки</p>
      <h5 class="info__value h5-title">{{ formatPrice(zone.delivery_price) }} ₽</h5>
    </div>
    <div v-if="zone.free_delivery_min_price" class="info__col col">
      <p class="text-s">Бесплатная доcтавка от</p>
      <h5 class="info__value h5-title">{{ formatPrice(zone.free_delivery_min_price) }} ₽</h5>
    </div>
  </div>

  <div class="location__cta" @click="handleToOrderClick">
    <UiButton v-if="zone.is_open">Перейти к заказу</UiButton>
    <UiButton v-else-if="isPreorderAvailable">Сделать предзаказ</UiButton>
    <UiButton v-else>Посмотреть меню</UiButton>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDeliveryStore, useSessionStore, useUiStore } from '~/store'
import { formatMinutes, formatPrice } from '~/utils'

const deliveryStore = useDeliveryStore()
const sessionStore = useSessionStore()
const ui = useUiStore()

const { zone, workingTime, minOrderPrice } = storeToRefs(deliveryStore)

const { isPreorderAvailable } = storeToRefs(sessionStore)

const handleToOrderClick = () => {
  ui.closeModal()
}
</script>

<style lang="scss" scoped>
.info {
  &__col {
    margin-top: 16px;
  }
  .info__value {
    display: inline-flex;
    align-items: center;
    margin-top: 8px;
    svg {
      color: var(--color-primary);
      font-size: 22px;
      margin-right: 6px;
    }
  }
}
</style>
