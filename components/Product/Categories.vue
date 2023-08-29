<template>
  <section class="categories">
    <div class="container">
      <div class="row">
        <div v-for="category in categories" class="col">
          <NuxtLink
            :to="`/category/${category.slug}`"
            class="category"
            :class="{
              sm: category.image_view_type == 10,
              lg: category.image_view_type == 20,
              sq: category.image_view_type == 30,
              'is-shadow': $env.showCategoryName && $env.categoryNameShadow,
            }"
            :data-id="category.id"
          >
            <div v-if="category.image" class="category__image">
              <img :src="category.image" :alt="category.title" />
            </div>
            <div class="category__content">
              <div v-if="$env.showCategoryName" class="category__title h2-title">
                {{ category.title }}
              </div>
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
const { $env } = useNuxtApp()
</script>

<style lang="scss" scoped>
.categories {
  margin: 68px 0 80px;

  @include r($md) {
    margin: 36px 0 52px;
  }

  .row {
    align-items: flex-start;
  }

  .col {
    flex: 0 0 $col3;

    @include r($lg) {
      flex-basis: $col4;
    }

    @include r($md) {
      flex-basis: $col6;
    }

    &:first-child {
      flex-basis: $col6;

      @include r($lg) {
        flex-basis: $col8;
      }

      @include r($md) {
        flex-basis: $col12;
      }
    }

    &:nth-child(6) {
      flex-basis: $col6;

      @include r($lg) {
        flex-basis: $col8;
      }

      @include r($md) {
        flex-basis: $col12;
      }
    }
  }
}

.category {
  $self: &;

  flex: 1 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  height: var(--category-height-md);
  background: rgba(var(--color-primary-rgb), 0.12);
  border-radius: var(--card-border-radius);
  overflow: hidden;

  @include r($md) {
    margin-bottom: 24px;
  }

  @include r($sm) {
    margin-bottom: 12px;
  }

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

  &.sm {
    aspect-ratio: 4/5;
  }

  &.lg {
    aspect-ratio: 17/10;
  }

  &.sq {
    aspect-ratio: 1;
  }

  &.is-shadow {
    #{$self}__title {
      color: #fff;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    }
  }
}
</style>
