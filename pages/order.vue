<template>
  <main class="page__content">
    <OrderCheckout v-if="cartStore.cart.length > 0" />
    <OrderCheckoutEmpty v-else />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore, useUiStore, useSessionStore } from '~/store'

const { $env, $log } = useNuxtApp()

const cartStore = useCartStore()
const sessionStore = useSessionStore()
const ui = useUiStore()
const { userNameVerbose } = storeToRefs(sessionStore)

useHead({
  title: `Оформление заказа - ${$env.projectName}`,
})

onMounted(() => {
  if ($env.orderAskAuth && !userNameVerbose.value) {
    ui.setModal({ name: 'auth', params: { closable: false } })
  }
})
</script>

<style lang="scss" scoped></style>
