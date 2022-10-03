<template>
  <div v-if="products" class="cart">
    <div class="cart__head">
      <div class="h2-title">Корзина</div>
    </div>
    <div class="cart__list">
      <CartProduct v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div class="cart__cta">
      <UiButton :block="true" :disabled="true">
        Оформить заказ &bull; {{ cartStore.cartPrice }} ₽
      </UiButton>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/store'

const cartStore = useCartStore()
const { products } = storeToRefs(cartStore)
</script>

<style lang="scss" scoped>
.cart {
  &__list {
    margin-top: 28px;
  }
}
</style>
