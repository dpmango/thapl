<template>
  <div class="card">
    <div class="card__media">
      <div class="card__image">
        <UiAtomProductImage :src="product.image" :alt="product.title" />
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h6-title">
        <UiAtomLongWords :text="product.title" />
      </div>
      <div class="card__description text-s c-gray">
        {{ product.description }}
      </div>
      <div class="card__actions">
        <div class="card__price text-l">{{ formatPrice(product.price) }} ₽</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IProduct } from '~/interface/Product'
import { formatPrice } from '#imports'

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => {},
  },
})
</script>

<style lang="scss" scoped>
.card {
  flex: 1 0 auto;
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: var(--product-background);
  box-shadow: var(--box-shadow-large);
  border-radius: var(--card-border-radius);
  &__media {
    flex: 0 0 120px;
  }
  &__image {
    position: relative;
    z-index: 1;
    border-radius: 8px;
    font-size: 0;
    padding-bottom: var(--product-card-mini-ar);
    background: var(--color-bg);
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease-out;
    }
  }
  &__body {
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    min-width: 1px;
  }
  &__title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__description {
    margin-top: 8px;
    display: inline;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
  }
  &__actions {
    padding-top: 16px;
    margin-top: auto;
  }
  &__price {
    color: var(--color-primary);
  }
}
</style>
