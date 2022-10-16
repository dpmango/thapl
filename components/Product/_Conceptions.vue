<template>
  <section class="categories">
    <div class="container">
      <div class="row">
        <div v-for="category in categories" class="col col-3 col-lg-6 col-sm-12">
          <NuxtLink :to="`/category/${category.slug}`" class="category" :data-id="category.id">
            <div v-if="category.image" class="category__image">
              <img :src="category.image" :alt="category.title" />
            </div>
            <div class="category__content">
              <div class="category__title h2-title">{{ category.title }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ICategory } from '~/interface/Product'

const props = defineProps({
  categories: Array as PropType<ICategory[]>,
})

// TODO - col size control (by index or backend-defined)
</script>

<style lang="scss" scoped>
.categories {
  margin: 68px 0 80px;
}

.category {
  flex: 1 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  background: rgba(var(--color-primary-rgb), 0.12);
  border-radius: var(--card-border-radius);
  overflow: hidden;
  &__image {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
  }
  &__content {
    position: relative;
    z-index: 2;
    margin-top: auto;
    padding: 32px;
  }
  &__title {
    color: var(--color-primary);
  }
}
</style>
