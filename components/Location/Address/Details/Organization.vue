<template>
  <div class="info row">
    <div class="info__col col">
      <p class="text-s">Можете забрать</p>
      <h5 class="info__value h5-title">
        <template v-if="organization.is_open">Сегодня</template>
        <template v-else><strong>Завтра</strong></template>
      </h5>
    </div>
    <div class="info__col col">
      <p class="text-s">Время готовки</p>
      <h5 class="info__value h5-title">TODO</h5>
    </div>
    <div class="info__col col">
      <p class="text-s">Часы работы</p>
      <h5 class="info__value h5-title">TODO</h5>
    </div>
    <div class="info__col col">
      <p class="text-s">Заказ от</p>
      <h5 class="info__value h5-title">TODO</h5>
    </div>
    <!-- <div class="info__col col">
      <p class="text-s">Время доставки</p>
      <h5 class="info__value h5-title">
        <template v-if="organization.is_high_load_state">is_high_load_state - icon</template>
        <template v-if="zone.max_time">{{ formatMinutes(zone.max_time) }}</template>
      </h5>
    </div> -->
    <!-- <div v-if="workingTime" class="info__col col">
      <p class="text-s">Часы работы</p>
      <h5 class="info__value h5-title">
        {{ workingTime }}
      </h5>
    </div> -->
  </div>

  <div class="location__cta" @click="handleToOrderClick">
    <UiButton v-if="organization.is_open">Перейти к заказу</UiButton>
    <UiButton v-else-if="isPreorderAvailable">Сделать предзаказ</UiButton>
    <UiButton v-else>Посмотреть меню</UiButton>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDeliveryStore, useSessionStore, useUiStore } from '~/store'
// import { formatMinutes, formatPrice } from '~/utils'

const props = defineProps({
  organization: {
    type: Object,
    default: () => {},
  },
})

const deliveryStore = useDeliveryStore()
const sessionStore = useSessionStore()
const { isPreorderAvailable } = storeToRefs(sessionStore)

const ui = useUiStore()

const handleToOrderClick = () => {
  ui.closeModal()
}
</script>

<style lang="scss" scoped>
.info {
  &__col {
    margin-top: 16px;
  }
  &__value {
    margin-top: 8px;
  }
}
</style>
