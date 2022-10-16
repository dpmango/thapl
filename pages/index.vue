<template>
  <main class="page__content">
    <PromoSlider :slides="promoData" />
    <OrderLast />
    <ProductPopular />
    <ProductCategory
      v-for="category in productStore.catalogWithFilter"
      :key="category.id"
      :category="category"
    />
    <ProductQuickFilter />
    <UiDevInfo />
    <InfoAbout />
  </main>
</template>

<script setup>
import { useProductStore } from '~/store'

// definePageMeta({ layout: 'default' })
const productStore = useProductStore()
const { $env } = useNuxtApp()

useHead({
  title: 'Главная',
})

const headers = useHeaders()

const { data: promoData, error: promoError } = await useAsyncData('promo', () =>
  useApi('promo/get-for-main-page', {
    method: 'GET',
    headers,
    params: {
      list_type: $env.promoListType,
    },
  })
)

// const { data: categories2, error } = await useAsyncData('categories2', () =>
//   productStore.getCategories()
// )

console.log({ promoData })
</script>
