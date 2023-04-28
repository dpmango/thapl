<template>
  <AuthModal />
  <CartModal />
  <CartStopList />
  <CartSelectGift />
  <LocationRegionModal v-if="$env.useRegions" />
  <LocationAddressModal />
  <LocationClosedModal />
  <LocationOrgNotFoundModal />
  <InfoContactModal />
  <ProductModal />
  <ProductSearchOverlay />
  <OrderReviewModal />
</template>

<script setup lang="ts">
const { $env } = useNuxtApp()
</script>
