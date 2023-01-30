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
        <UiAtomProductImage :src="product.image" :alt="product.title" />
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h6-title">
        <UiAtomLongWords :text="product.title" />
      </div>
      <div
        v-if="product.packing_weights && !product.only_pre_order"
        class="card__description text-s c-gray"
      >
        {{ product.packing_weights }}
      </div>
      <div v-else-if="product.only_pre_order" class="card__preorder text-s c-primary">
        Этот товар доступен только по предзаказу
      </div>
      <div
        v-if="!isGift"
        class="card__action"
        @click.stop
        @mouseenter="setFocused(false)"
        @mouseleave="setFocused(true)"
      >
        <UiPlusMinus
          v-if="isAddProduct || productQuantityInCart(product.id) !== 0"
          size="small"
          :value="
            isAddProduct
              ? productQuantityInCart(product.id) || additiveCount
              : productQuantityInCart(product.id)
          "
          @on-change="(n) => handleQuantityChange(n, isAddProduct)"
        />
        <template v-else>
          <UiButton theme="secondary" @click="handleReturn"> Вернуть </UiButton>
          <UiButton theme="secondary" @click="handleRemove"> Удалить </UiButton>
        </template>
      </div>
    </div>
    <div class="card__meta">
      <div class="card__price h6-title">
        <template v-if="!isGift">{{ formatPrice(product.price) }}</template>
        <template v-else>Бесплатно</template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PropType } from 'vue'
import { IProduct } from '~/interface/Product'
import { ICartInner } from '~/interface/Cart'
import { useCartStore, useUiStore } from '~/store'

const cartStore = useCartStore()
const ui = useUiStore()
const { productQuantityInCart } = storeToRefs(cartStore)

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => {},
  },
  cartItem: {
    type: Object as PropType<ICartInner>,
    default: null,
  },
  additiveCount: {
    type: Number,
    required: false,
    default: null,
  },
  isGift: {
    type: Boolean,
    default: false,
  },
})

const isAddProduct = computed(() => {
  return typeof props.additiveCount === 'number'
})

const handleReturn = () => {
  cartStore.changeQuantity({ id: props.product.id, quantity: 1 })
}

const handleRemove = () => {
  cartStore.removeFromCart(props.product.id)
}

const handleQuantityChange = (n: number, isAddProduct) => {
  // Don't remove, instead show return to cart (with quantity = 0)
  if (isAddProduct) {
    // сперва добавить в корзину
    if (productQuantityInCart.value(props.product.id) === null) {
      cartStore.addToCart(props.product, 1, [])
    }
  }

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
