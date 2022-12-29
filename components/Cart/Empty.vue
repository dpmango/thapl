<template>
  <div class="empty">
    <UiAtomErrorMessage icon="cart-outline" title="В корзине пусто">
      <template #content>
        Зайдите в меню, выберите блюда, которые хотите съесть, а мы оперативно доставим ваш заказ от
        {{ formatPrice(minOrderPrice) }}.
      </template>
      <template #action>
        <UiButton to="/" @click="ui.closeModal()">Перейти в меню</UiButton>
      </template>
    </UiAtomErrorMessage>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore, useUiStore, useDeliveryStore } from '~/store'
import { formatPrice } from '#imports'

const sessionStore = useSessionStore()
const deliveryStore = useDeliveryStore()
const ui = useUiStore()

const { app_settings } = storeToRefs(sessionStore)
const { minOrderPrice } = storeToRefs(deliveryStore)
</script>

<style lang="scss" scoped>
.empty {
  margin: auto;
  max-width: 330px;
}
</style>
