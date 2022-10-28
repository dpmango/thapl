<template>
  <main class="page__content page">
    <div class="container">
      <UiCrumbs class="page__crumbs" :show-home="false" :list="crumbs" />
    </div>

    <ProductCategory :show-title="false" :category="categoryData" />
  </main>
</template>

<script setup>
import { useProductStore } from '~/store'
const { $env, $log } = useNuxtApp()

const { params } = useRoute()
const productStore = useProductStore()

// TODO - watch the order of async requests (catalog req goes from app.vue - it's ok for now)
const DangerAsyncCategoryInStore = productStore.categoryBySlug(params.slug)

if (!DangerAsyncCategoryInStore) {
  throw createError({ statusCode: 404 })
}

const { data: categoryData, error: categoriesError } = await useAsyncData(
  `catalog-${params.slug}`,
  () =>
    useApi('catalog/get-catalog-data', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        id: DangerAsyncCategoryInStore.id,
        // slug: params.slug
      },
    })
)

useHead({
  title: `${categoryData.value.title} - ${$env.projectName}`,
})

$log.log(`🧙‍♂️ ASYNC catalog-id ${params.slug}`, { category: categoryData.value })

if (!categoryData.value) {
  throw createError({ statusCode: 404 })
}

const crumbs = ref([
  { href: '/', label: 'Каталог' },
  { href: `/category/${params.slug}`, label: categoryData.value.title },
])
</script>

<style lang="scss" scoped>
.page {
  &__crumbs {
    margin: 60px 0 32px;
  }
}
</style>
