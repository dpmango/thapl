<template>
  <div class="info row">
    <div class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Можем доставить</p>
      <h5 class="info__value h5-title h6-title-md">
        <template v-if="zone.is_open">Сегодня</template>
        <template v-else><strong>Завтра</strong></template>
      </h5>
    </div>
    <div class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Время доставки</p>
      <h5 class="info__value h5-title h6-title-md">
        <NuxtIcon v-if="zone.organization.is_high_load_state" name="high-load" />
        <template v-if="zone.max_time">{{ formatMinutes(zone.max_time) }}</template>
      </h5>
    </div>
    <div v-if="workingTime" class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Часы работы</p>
      <h5 class="info__value h5-title h6-title-md">
        {{ workingTime }}
      </h5>
    </div>
    <div v-if="minOrderPrice" class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Заказ от</p>
      <h5 class="info__value h5-title h6-title-md">{{ formatPrice(minOrderPrice) }} ₽</h5>
    </div>
    <div v-if="zone.delivery_price" class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Стоимость доставки</p>
      <h5 class="info__value h5-title h6-title-md">{{ formatPrice(zone.delivery_price) }} ₽</h5>
    </div>
    <div v-if="zone.free_delivery_min_price" class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Бесплатная доcтавка от</p>
      <h5 class="info__value h5-title h6-title-md">
        {{ formatPrice(zone.free_delivery_min_price) }} ₽
      </h5>
    </div>
  </div>

  <div class="location__cta" @click="handleToOrderClick">
    <UiButton v-if="zone.is_open">Перейти к заказу</UiButton>
    <UiButton v-else-if="isPreorderAvailable">Сделать предзаказ</UiButton>
    <UiButton v-else>Посмотреть меню</UiButton>

    <UiButton theme="outline" @click.stop="handleReturn">Выбрать другой адрес</UiButton>
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

const handleReturn = () => {
  deliveryStore.setCurrentAddress(null)
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
    .nuxt-icon {
      color: var(--color-primary);
      font-size: 22px;
      margin-right: 6px;
    }
  }
}

@include r($md) {
  .info {
    &__col {
      margin-top: 20px;
    }
  }
}

@include r($sm) {
  .info {
    &__value {
      margin-top: 4px;
      .nuxt-icon {
        font-size: 18px;
        margin-right: 4px;
      }
    }
  }
}
</style>
