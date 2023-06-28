<template>
  <main class="page__content page">
    <div class="container">
      <UiCrumbs class="page__crumbs" :show-home="false" :list="crumbs" />
    </div>

    <ProductCategory v-if="categoryData" :show-title="false" :category="categoryData" />
  </main>
</template>

<script setup lang="ts">
import { useProductStore } from '~/store'
import { ICategoryFull } from '~/interface'

const { $env, $log } = useNuxtApp()

const { params } = useRoute()
const productStore = useProductStore()

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
