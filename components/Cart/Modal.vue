<template>
  <ClientOnly>
    <UiModal name="cart" position="aside" height="fill" :padding="false" :scrolling="false">
      <CartEmpty v-if="products.length === 0" />
      <CartSummary v-else />
    </UiModal>
  </ClientOnly>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore, useProductStore } from '~/store'

const { $env, $log } = useNuxtApp()

const cartStore = useCartStore()
const productStore = useProductStore()
const { cart, products } = storeToRefs(cartStore)
const { flatCatalog } = storeToRefs(productStore)

onMounted(async () => {
  // if (cart.value.length === 0) return
  // Убрано так как не выдаются группы модификаторов
  // Данные с async каталога
  // if ($env.catalogType === 'singlepage') {
  //   cart.value.forEach((c) => {
  //     const product = flatCatalog.value.find((x) => x.id === c.id)
  //     if (product) {
  //       cartStore.hydrateProducts(product)
  //     } else {
  //       cartStore.removeFromCart(c.id)
  //     }
  //   })
  // } else {
})
</script>

<style lang="scss" scoped>
.cart {
  flex: 1 1 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
