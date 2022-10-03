<template>
  <ClientOnly>
    <UiModal name="cart" position="aside" height="fill">
      <CartEmpty v-if="products.length === 0" />
      <CartSummary v-else />
    </UiModal>
  </ClientOnly>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore, useProductStore } from '~/store'
import { PerformanceLog } from '~/utils'

const { $env, $log } = useNuxtApp()

const cartStore = useCartStore()
const productStore = useProductStore()
const { cart, products } = storeToRefs(cartStore)
const { catalog } = storeToRefs(productStore)

onMounted(() => {
  // populate cart products by ids (SSR + cookie)
  const DEV_perf = performance.now()

  const flatCatalog = catalog.value.reduce((acc, x) => {
    acc = [...acc, ...x.catalog_items]
    x.sub_categories.forEach((sub) => {
      acc = [...acc, ...sub.catalog_items]
    })

    return acc
  }, [])
  PerformanceLog(DEV_perf, 'flatCatalog')

  // $log.log({ flatCatalog })

  cart.value.forEach((c) => {
    const product = flatCatalog.find((x) => x.id === c.id)
    cartStore.hydrateProducts(product)
  })

  PerformanceLog(DEV_perf, 'cartPopulated')
})
</script>

<style lang="scss" scoped>
.cart {
  flex: 1 0 auto;
}
</style>
