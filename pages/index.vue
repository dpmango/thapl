<template>
  <main class="page__content">
    <PromoSlider :slides="promoData" />
    <OrderLast />
    <ProductPopular />

    <template v-if="$env.catalogType === 'singlepage'">
      <ProductCategory
        v-for="category in productStore.catalogWithFilter"
        :key="category.id"
        :category="category"
      />
      <ProductQuickFilter />
    </template>

    <ProductCategories
      v-else-if="$env.catalogType === 'categories'"
      :categories="productStore.catalog"
    />

    <!-- <ProductConceptions
      v-else-if="$env.catalogType === 'conceptions'"
      :categories="productStore.catalog"
    /> -->
    <template v-else-if="$env.catalogType === 'conceptions'">
      <h2 class="h2-title">TODO {{ productStore.catalog }}</h2>
    </template>

    <UiDevInfo />
    <InfoAbout />
  </main>
</template>

<script setup>
import { useProductStore } from '~/store'

// definePageMeta({ layout: 'default' })
const productStore = useProductStore()
const { $env, $log } = useNuxtApp()

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

$log.log({ promoData: promoData.value })
</script>
