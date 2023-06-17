<template>
  <section class="categories">
    <div class="container">
      <div class="row">
        <div v-for="category in categories" class="col">
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
</script>

<style lang="scss" scoped>
.categories {
  margin: 68px 0 80px;
  .col {
    flex: 0 0 $col3;
    &:first-child {
      flex-basis: $col6;
    }
    &:nth-child(6) {
      flex-basis: $col6;
    }
  }
}

@include r($lg) {
  .categories {
    .col {
      flex: 0 0 $col4;
      &:first-child {
        flex-basis: $col8;
      }
      &:nth-child(6) {
        flex-basis: $col8;
      }
    }
  }
}

@include r($md) {
  .categories {
    margin: 36px 0 52px;
    .col {
      flex: 0 0 $col6;
      &:first-child {
        flex-basis: $col12;
      }
      &:nth-child(6) {
        flex-basis: $col12;
      }
    }
  }
}

@include r($sm) {
  .categories {
    .col {
      flex: 0 0 $col12;
    }
  }
}

.category {
  flex: 1 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  min-height: var(--category-height);
  background: rgba(var(--color-primary-rgb), 0.12);
  border-radius: var(--card-border-radius);
  overflow: hidden;
  &__image {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    img {
      flex: 1 1 auto;
      object-fit: cover;
    }
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

@include r($md) {
  .category {
    min-height: var(--category-height-md);
    margin-bottom: 24px;
  }
}

@include r($sm) {
  .category {
    min-height: var(--category-height-sm);
    margin-bottom: 12px;
  }
}
</style>
