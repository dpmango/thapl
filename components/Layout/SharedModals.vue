<template>
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
  <OrderReviewModal v-if="$env.useTestimonials" />
  <AuthModal />
</template>

<script setup lang="ts">
const { $env } = useNuxtApp()
</script>
