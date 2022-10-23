<template>
  <AuthModal />
  <CartModal />
  <LocationRegionModal v-if="$env.useRegions" />
  <LocationAddressModal />
  <LocationClosedModal />
  <ContactModal />
  <ProductModal />
  <ProductSearchOverlay />
</template>

<script setup>
const { $env } = useNuxtApp()
</script>
