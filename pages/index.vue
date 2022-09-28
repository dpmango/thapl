<template>
  <main class="page__content">
    <PromoSlider :slides="promoData" />
    <OrderLast />
    <ProductPopular />
    <ProductCategory
      v-for="category in productStore.catalog"
      :key="category.id"
      :category="category"
    />
    <DevInfo />
    <InfoAbout />
  </main>
</template>

<script setup>
import { useSessionStore, useProductStore } from '~/store'

// definePageMeta({ layout: 'default' })
const session = useSessionStore()
const productStore = useProductStore()

useHead({
  title: 'Главная',
})

const headers = useHeaders()

const { data: promoData, error: promoError } = await useAsyncData('promo', () =>
  useApi('promo/get-for-main-page', {
    method: 'GET',
    headers,
    params: {
      list_type: 1,
    },
  })
)

// const { data: categories2, error } = await useAsyncData('categories2', () =>
//   productStore.getCategories()
// )

// console.log({ promoData })
</script>
