<template>
  <div class="category-page">
    <ProductCategory :category="category" />
  </div>
</template>

<script setup>
import { useProductStore } from '~/store'
const { $env, $log } = useNuxtApp()

// НЕ ДЛЯ single page представления
const { data: category, error: categoriesError } = await useAsyncData('catalog-id', () =>
  useApi('catalog/get-catalog-data', {
    method: 'GET',
    headers: useHeaders(),
    params: {
      id: 27,
    },
  })
)

$log.log('catalog-id', { category })
</script>
