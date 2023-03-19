<template>
  <main class="page__content">
    <ProfileOrders />
  </main>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/store'

const { $env, $log } = useNuxtApp()

const profileStore = useProfileStore()

useHead({
  title: `Личный кабинет - ${$env.projectName}`,
})

const { data: orders, error: ordersError } = await useAsyncData('profile/get-orders', () =>
  profileStore.getOrders()
)

$log.log('🧙‍♂️ ASYNC ORDERS', { orders: orders.value })
</script>
