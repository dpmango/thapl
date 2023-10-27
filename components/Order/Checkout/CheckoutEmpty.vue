<template>
  <div class="empty">
    <UiAtomErrorMessage icon="cart-outline" title="В корзине пусто">
      <template #content>
        Зайдите в меню, выберите блюда, которые хотите съесть
        <template v-if="minOrderPrice">
          &nbsp;, а мы оперативно доставим ваш заказ от {{ formatPrice(minOrderPrice) }}.
        </template>
      </template>
      <template #action>
        <UiButton to="/">Перейти в меню</UiButton>
      </template>
    </UiAtomErrorMessage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDeliveryStore } from '~/store'
import { formatPrice } from '#imports'

const deliveryStore = useDeliveryStore()

const { minOrderPrice } = storeToRefs(deliveryStore)
</script>

<style lang="scss" scoped>
.empty {
  padding: 80px 0 120px;
  margin: auto;
  max-width: 330px;
}
</style>
