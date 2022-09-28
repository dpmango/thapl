<template>
  <UiModal name="cart" position="aside" height="fill">
    <CartEmpty v-if="store.products.length === 0" />
  </UiModal>
</template>

<script setup>
import { useCartStore } from '~/store'

const store = useCartStore()
</script>

<style lang="scss" scoped>
.cart {
  flex: 1 0 auto;
}
</style>
