<template>
  <div class="card">
    <div class="card__media">
      <div class="card__image">
        <img :src="product.image" :alt="product.title" />
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h6-title">
        <UiLongWords :text="product.title" />
      </div>
      <div class="card__description text-s c-gray">
        {{ product.packing_weights }}
      </div>
      <div class="card__action">
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
import { useCartStore } from '~/store'

const cartStore = useCartStore()
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
</script>

<style lang="scss" scoped>
.card {
  flex: 1 0 auto;
  display: flex;
  align-items: flex-start;
  padding: 24px 0;
  &__media {
    flex: 0 0 64px;
  }
  &__image {
    position: relative;
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
  &__action {
    display: flex;
    align-items: center;
    margin-top: 12px;
  }
  &__meta {
    flex: 0 0 auto;
  }
  &__price {
    color: var(--color-primary);
  }
}
</style>
