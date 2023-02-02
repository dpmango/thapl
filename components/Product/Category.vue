<template>
  <section :id="category.slug" class="category" :data-id="category.id">
    <div class="container">
      <template v-if="category.catalog_items.length">
        <h2 v-if="showTitle" class="category__title h2-title">{{ category.title }}</h2>

        <ProductCategoryList :list="category.catalog_items" />
      </template>

      <div v-for="subcategory in category.sub_categories" class="category__sub">
        <template v-if="subcategory.catalog_items.length">
          <h2 class="category__title h3-title">{{ subcategory.title }}</h2>

          <ProductCategoryList :list="subcategory.catalog_items" />
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ICategoryFull } from '~/interface/Product'

const props = defineProps({
  category: {
    type: Object as PropType<ICategoryFull>,
    default: () => {},
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
})
</script>

<style lang="scss" scoped>
.category {
  margin: 40px 0;
}
</style>
