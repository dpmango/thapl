<template>
  <div
    class="card"
    :class="[focused && '_focused']"
    @click="handleProductClick"
    @mouseenter="setFocused(true)"
    @mouseleave="setFocused(false)"
  >
    <div class="card__media">
      <div class="card__image">
        <img :src="product.image || '/no_photo.jpg'" :alt="product.title" />
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h6-title">
        <UiAtomLongWords :text="product.title" />
      </div>
      <div v-if="!product.only_pre_order" class="card__description text-s c-gray">
        {{ product.packing_weights }}
      </div>
      <div v-else class="card__preorder text-s c-primary">
        Этот товар доступен только по предзаказу
      </div>
      <div
        class="card__action"
        @click.stop
        @mouseenter="setFocused(false)"
        @mouseleave="setFocused(true)"
      >
        <UiPlusMinus
          v-if="productQuantityInCart(product.id) !== 0"
          size="small"
          :value="productQuantityInCart(product.id)"
          @on-change="handleQuantityChange"
        />
        <template v-else>
          <UiButton theme="secondary" @click="handleReturn"> Вернуть </UiButton>
          <UiButton theme="secondary" @click="handleRemove"> Удалить </UiButton>
        </template>
      </div>
    </div>
    <div class="card__meta">
      <div class="card__price h6-title">{{ product.price }} ₽</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PropType } from 'vue'
import { IProduct } from '~/interface/Product'
import { useCartStore, useUiStore } from '~/store'

const cartStore = useCartStore()
const ui = useUiStore()
const { productQuantityInCart } = storeToRefs(cartStore)

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
  },
})

const handleReturn = () => {
  cartStore.changeQuantity({ id: props.product.id, quantity: 1 })
}

const handleRemove = () => {
  cartStore.removeFromCart(props.product.id)
}

const handleQuantityChange = (n: number) => {
  // Don't remove, instead show return to cart (with quantity = 0)
  cartStore.changeQuantity({ id: props.product.id, quantity: n })
}

const handleProductClick = () => {
  ui.setModal({
    name: 'product',
    keepPrevious: true,
    params: { id: props.product.id, critical: props.product },
  })
}

// focus
const focused = ref(false)
const setFocused = (v) => {
  focused.value = v
}
</script>

<style lang="scss" scoped>
.card {
  flex: 1 0 auto;
  display: flex;
  align-items: flex-start;
  padding: 24px 0;
  cursor: pointer;
  &__media {
    flex: 0 0 64px;
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
      max-width: auto;
      object-fit: cover;
      transition: transform 0.35s ease-out;
    }
  }
  &__body {
    flex: 1 1 auto;
    padding-left: 20px;
    padding-right: 20px;
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
  &__preorder {
    margin-top: 4px;
  }
  &__action {
    display: flex;
    align-items: center;
    margin-top: 12px;
    cursor: default;
  }
  &__meta {
    flex: 0 0 auto;
  }
  &__price {
    color: var(--color-primary);
  }
  &._focused {
    .card__image img {
      transform: scale(1.1);
    }
  }
}
</style>
