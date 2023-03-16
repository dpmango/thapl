<template>
  <a
    href="#"
    class="card"
    :class="[isProductInCart && '_incart', stoplisted && '_stoplisted']"
    @click="handleProductClick"
  >
    <div class="card__media">
      <div class="card__image">
        <UiAtomProductImage :src="product.image" :alt="product.title" />
      </div>
    </div>
    <div class="card__body">
      <div class="card__title text-s fw-500">
        <UiAtomLongWords :text="product.title" />
      </div>
      <div v-if="product.packing_weights" class="card__description text-s c-gray">
        {{ product.packing_weights }}
      </div>
    </div>
    <div class="card__actions">
      <div class="card__price text-s fw-600">{{ formatPrice(product.price) }}</div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IProduct } from '~/interface/Product'
import { formatPrice } from '#imports'
import { useCartStore } from '~/store'

const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => {},
  },
  stoplisted: {
    type: Boolean,
    default: false,
  },
})

const isProductInCart = computed(() => {
  return cartStore.productQuantityInCart(props.product.id)
})

const handleProductClick = () => {
  if (!isProductInCart.value) {
    cartStore.addToCart(props.product, 1, [])
  }
}
</script>

<style lang="scss" scoped>
.card {
  flex: 1 0 auto;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: var(--product-background);
  box-shadow: var(--box-shadow-large);
  border-radius: var(--card-border-radius-sm);
  cursor: pointer;
  &._incart {
    cursor: default;
    outline: 2px solid var(--color-primary);
  }
  &._stoplisted {
    outline: none;
    .card__image {
      filter: grayscale(1);
    }
    .card__price {
      display: none;
    }
  }
  &__media {
    flex: 0 0 48px;
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
    margin-left: 16px;
    padding-right: 8px;
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
    margin-top: 4px;
    display: inline;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
  }
  &__actions {
    flex: 0 0 auto;
    margin-left: auto;
  }
  &__price {
    color: var(--color-primary);
  }
}
</style>