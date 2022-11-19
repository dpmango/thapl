<template>
  <main class="page__content">
    <ProfileOrders :orders="orders" />
  </main>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

useHead({
  title: `Личный кабинет - ${$env.projectName}`,
})

const { data: orders, error: ordersError } = await useAsyncData('profile/get-orders', () =>
  useApi('profile/get-orders', {
    headers: useHeaders(),
  })
)

$log.log('🧙‍♂️ ASYNC ORDERS', { orders: orders.value })
</script>
