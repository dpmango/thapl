<template>
  <main class="page__content">
    <OrderCheckout />
  </main>
</template>

<script setup>
// definePageMeta({ layout: 'default' })
const { $env, $log } = useNuxtApp()

useHead({
  title: `Оформление заказа - ${$env.projectName}`,
})
</script>

<style lang="scss" scoped></style>
