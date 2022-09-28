<template>
  <section :id="category.slug" class="category" :data-id="category.id">
    <div class="container">
      <h2 class="category__title h2-title">{{ category.title }}</h2>

      <ProductCategoryList v-if="category.catalog_items" :list="category.catalog_items" />

      <div v-if="category.sub_categories">
        <div v-for="subcategory in category.sub_categories" class="category__sub">
          <h2 class="category__title h3-title">{{ subcategory.title }}</h2>

          <ProductCategoryList v-if="category.catalog_items" :list="category.catalog_items" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ICategory } from '~/interface/Product'

const props = defineProps({
  category: Object as PropType<ICategory>,
})
</script>

<style lang="scss" scoped>
.category {
  margin: 40px 0;
}
</style>
