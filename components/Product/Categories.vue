<template>
  <section class="categories">
    <div class="container">
      <div class="row">
        <div
          v-for="category in categories"
          class="col"
          :class="{
            'sm col-3 col-md-6': category.image_view_type == 10,
            'lg col-6 col-md-12': category.image_view_type == 20,
            'sq col-3 col-md-6': category.image_view_type == 30,
            'xl col-6 col-md-12': category.image_view_type == 40,
          }"
        >
          <NuxtLink
            :to="`/category/${category.slug}`"
            class="category"
            :class="{
              'is-shadow': isShowCategoyName && isShowShadow,
            }"
            :data-id="category.id"
          >
            <div v-if="category.image" class="category__image">
              <img :src="category.image" :alt="category.title" />
            </div>
            <div class="category__content">
              <div v-if="isShowCategoyName" class="category__title h2-title">
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

const isShowCategoyName = $env.showCategoryName ? $env.showCategoryName : true
const isShowShadow = $env.categoryNameShadow ? $env.categoryNameShadow : true
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
}

.sm {
  .category {
    aspect-ratio: 268/336;
  }
}

.lg {
  .category {
    aspect-ratio: 568/336;
  }
}

.sq {
  .category {
    aspect-ratio: 1;
  }
}

.xl {
  .category {
    aspect-ratio: 568/260;
  }
}

.category {
  flex: 1 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  // height: var(--category-height-md);
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
    z-index: 3;
    margin-top: auto;
    padding: 32px;
  }

  &__title {
    color: var(--color-primary);
  }

  &.is-shadow {
    .category__title {
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
      z-index: 2;
    }
  }
}

@include r($lg) {
  .category {
    &__title {
      font-size: 24px;
    }
    &__content {
      padding: 24px 24px;
    }
  }
}

@include r($md) {
  .category {
    margin-bottom: 24px;
    &__title {
      font-size: 18px;
    }
  }
}

@include r($sm) {
  .category {
    margin-bottom: 12px;
    &__content {
      padding: 24px 16px;
    }
  }
}
</style>
