<template>
  <main class="page__content">
    <PromoSlider v-if="promoData" :slides="promoData" />
    <OrderLast />

    <ProductPopular v-for="item in popularList.defaults" :key="item.id" :data="item" />

    <template v-if="$env.catalogType === 'singlepage'">
      <ProductCategoriesNav />
      <template v-for="category in productStore.catalogWithStoplistAndFilter" :key="category.id">
        <LazyProductCategory :category="category" />
        <ProductPopular
          v-if="findPopularForCategory(category.id)"
          :data="findPopularForCategory(category.id)"
        />
      </template>

      <ProductQuickFilter />
    </template>

    <ProductCategories
      v-else-if="$env.catalogType === 'categories'"
      :categories="productStore.catalogWithStoplistAndFilter"
    />

    <ProductConceptions
      v-else-if="$env.catalogType === 'conceptions'"
      :categories="productStore.catalogWithStoplistAndFilter"
    />

    <InfoAbout />
  </main>
</template>

<script setup lang="ts">
import { IPopularItemsDto } from '~/interface/Dto/Catalog.dto'
import { IPromoListDto } from '~/interface/Promo'

import { useProductStore } from '~/store'

const productStore = useProductStore()
const { $env, $log } = useNuxtApp()

useHead({
  title: `Главная - ${$env.projectName}`,
})

const { data: promoData, error: promoError } = await useAsyncData(
  'promo',
  () =>
    useApi('promo/get-for-main-page', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        list_type: $env.promoListType,
      },
    }) as Promise<IPromoListDto[]>
)

$log.log('🧙‍♂️ ASYNC PROMO', { promoData: promoData.value })

const { data: popular, error: popularError } = await useAsyncData(
  'popular',
  () =>
    useApi('catalog/get-popular-items', {
      method: 'GET',
      headers: useHeaders(),
    }) as Promise<IPopularItemsDto[]>
)

$log.log('🧙‍♂️ ASYNC POPULAR', { popular: popular.value })

const popularList = computed(() => {
  if (popular.value) {
    return {
      defaults: popular.value.filter((x) => !x.show_after_category_id),
      ids: popular.value.filter((x) => x.show_after_category_id),
    }
  }
  return {
    defaults: [],
    ids: [],
  }
})

const findPopularForCategory = (catId) => {
  return popularList.value.ids.find((x) => catId === x.show_after_category_id)
}
</script>
