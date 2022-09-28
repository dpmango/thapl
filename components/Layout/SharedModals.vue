<template>
  <AuthModal />
  <CartModal />
  <LocationRegionModal v-if="$env.useRegions" />
  <LocationAddressModal />
</template>

<script setup>
const { $env } = useNuxtApp()
</script>
