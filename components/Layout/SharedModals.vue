<template>
  <AuthModal />
  <CartModal />
  <CartStopList />
  <LocationRegionModal v-if="$env.useRegions" />
  <LocationAddressModal />
  <LocationClosedModal />
  <LocationOrgNotFoundModal />
  <InfoContactModal />
  <ProductModal />
  <ProductSearchOverlay />
</template>

<script setup>
const { $env } = useNuxtApp()
</script>
