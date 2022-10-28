<template>
  <AuthModal />
  <CartModal />
  <LocationRegionModal v-if="$env.useRegions" />
  <LocationAddressModal />
  <LocationClosedModal />
  <InfoContactModal />
  <ProductModal />
  <ProductSearchOverlay />
</template>

<script setup>
const { $env } = useNuxtApp()
</script>
