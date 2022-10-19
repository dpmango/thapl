<template>
  <AuthModal />
  <CartModal />
  <LocationRegionModal v-if="$env.useRegions" />
  <LocationAddressModal />
  <ContactModal />
  <ProductModal />
</template>

<script setup>
const { $env } = useNuxtApp()
</script>
