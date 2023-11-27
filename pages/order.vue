<template>
  <main class="page__content">
    <OrderCheckout v-if="cartStore.cart.length > 0" />
    <OrderCheckoutEmpty v-else />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore, useUiStore, useSessionStore, useDeliveryStore } from '~/store'

const { $env, $log } = useNuxtApp()

const cartStore = useCartStore()
const sessionStore = useSessionStore()
const deliveryStore = useDeliveryStore()
const ui = useUiStore()
const { isAuthenticated } = storeToRefs(sessionStore)

useHead({
  title: `Оформление заказа - ${$env.projectName}`,
})

// possible temp fix
deliveryStore.hydrateZone()

onMounted(() => {
  if ($env.orderAskAuth && !isAuthenticated.value) {
    ui.setModal({ name: 'auth', params: { closable: false } })
  }
})
</script>
