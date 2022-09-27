<template>
  <main class="page__content">
    <PromoSlider />
    <OrderLast />
    <ProductPopular />
    <ProductCategory
      v-for="category in categories"
      :key="category.id"
      :name="category.name"
      :list="category.dump"
    />
    <!-- <DevInfo /> -->
    <InfoAbout />
  </main>
</template>

<script setup>
import { useSessionStore, useProductStore } from '~/store'

// definePageMeta({ layout: 'default' })
const api = useApi
const session = useSessionStore()
const productStore = useProductStore()

useHead({
  title: 'Главная',
})

const headers = useHeaders()

const { data: promoData, error: promoError } = await useAsyncData('promo', () =>
  api('promo/get-for-main-page', {
    method: 'GET',
    headers,
    params: {
      list_type: 1,
    },
  })
)

const { data: catagoriesData, error: categoriesError } = await useAsyncData('promo', () =>
  api('catalog/get-main-page-categories', {
    method: 'GET',
    headers,
  })
)

console.log(catagoriesData.value)

const categories = ref([
  {
    id: 1,
    name: 'Бургеры и сендвичи',
    dump: [...Array(3)],
  },
  {
    id: 2,
    name: 'Супы',
    dump: [...Array(5)],
  },
])
</script>
