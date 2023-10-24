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
  <OrderReviewModal v-if="$env.useTestimonials" />
</template>

<script setup lang="ts">
const { $env } = useNuxtApp()
</script>
