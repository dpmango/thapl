<template>
  <main class="page__content">
    <OrderCheckout v-if="cartStore.cart.length > 0" />
    <OrderCheckoutEmpty v-else />
  </main>
</template>

<script setup>
import { useCartStore } from '~/store'
// definePageMeta({ layout: 'default' })
const { $env, $log } = useNuxtApp()

const cartStore = useCartStore()

useHead({
  title: `Оформление заказа - ${$env.projectName}`,
})
</script>

<style lang="scss" scoped></style>
