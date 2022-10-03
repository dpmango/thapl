<template>
  <AuthModal />
  <CartModal />
  <LocationRegionModal v-if="$env.useRegions" />
  <LocationAddressModal />
  <ContactModal />
</template>

<script setup>
const { $env } = useNuxtApp()
</script>
