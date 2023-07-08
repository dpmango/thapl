<template>
  <main class="page__content page">
    <div class="container">
      <UiCrumbs class="page__crumbs" :show-home="false" :list="crumbs" />
    </div>

    <ProductCategory
      v-if="categoryDataFiltered"
      :show-title="false"
      :category="categoryDataFiltered"
    />

    <ProductQuickFilter :category-data="categoryData" />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProductStore, useDeliveryStore } from '~/store'
import { ICategoryFull, IProduct } from '~/interface'

const { $env, $log } = useNuxtApp()

const { params } = useRoute()
const productStore = useProductStore()
const deliveryStore = useDeliveryStore()
const { currentAddressType, zone, takeawayOrganization } = storeToRefs(deliveryStore)
const { activeFilterKey } = storeToRefs(productStore)

activeFilterKey.value = 'all'

const categoryInStore = productStore.categoryBySlug(params.slug)
if (!categoryInStore) {
  throw createError({ statusCode: 404, fatal: true })
}

const categoryData = ref<ICategoryFull | null>(null)

const fetchCatalog = async () => {
  const data = (await useApi('catalog/get-catalog-data', {
    method: 'GET',
    headers: useHeaders(),
    params: {
      id: categoryInStore.id,
      // slug: params.slug
    },
  })) as ICategoryFull

  if (data) {
    categoryData.value = data
  } else {
    throw createError({ statusCode: 404, fatal: true })
  }

  return data
}

const { data: categoryDataAsync, error: categoriesError } = await useLazyAsyncData(
  `catalog-${params.slug}`,
  () => fetchCatalog()
)

categoryData.value = categoryDataAsync.value

watch(categoryDataAsync, (newData) => {
  categoryData.value = newData

  $log.log(`🧙‍♂️ ASYNC catalog-id ${params.slug}`, { category: categoryData.value })
})

useHead({
  title: () => `${categoryData.value?.title || 'Загрузка...'} - ${$env.projectName}`,
})

if (categoryData.value) {
  $log.log(`🧙‍♂️ ASYNC catalog-id ${params.slug}`, { category: categoryData.value })
}

// TODO - сделать общую логику с product.store (вынести в хелперы)
const categoryDataFiltered = computed(() => {
  if (!categoryData.value) return null

  const organizationData =
    currentAddressType?.value === 'delivery' ? zone.value?.organization : takeawayOrganization.value

  const productFilteringFunc = (p: IProduct) => {
    let isStoplisted = organizationData?.stop_list?.includes(p.id)

    if (isStoplisted && +$env.stopListType === 2) {
      isStoplisted = !p.preorder_delay
    } else if (isStoplisted && +$env.stopListType === 3) {
      isStoplisted = false
    }

    if (activeFilterKey.value && activeFilterKey.value !== 'all') {
      return p[activeFilterKey.value] && !isStoplisted
    }

    return !isStoplisted
  }

  return {
    ...categoryData.value,
    catalog_items: categoryData.value.catalog_items
      ? categoryData.value.catalog_items.filter(productFilteringFunc)
      : [],
    sub_categories: categoryData.value.sub_categories
      ? categoryData.value.sub_categories.map((subcat) => ({
          ...subcat,
          catalog_items: subcat.catalog_items.filter(productFilteringFunc),
        }))
      : [],
  }
})

const crumbs = computed(() => [
  { href: '/', label: 'Каталог' },
  { href: `/category/${params.slug}`, label: categoryData.value?.title },
])
</script>

<style lang="scss" scoped>
.page {
  &__crumbs {
    margin: 60px 0 32px;
  }
}
</style>
