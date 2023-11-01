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
        <UiImage :src="renderProduct.image" :alt="renderProduct.title" />
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h6-title"><UiAtomLongWords :text="renderProduct.title" /></div>
      <span
        v-for="(mod, idx) in productModifiersVerbose"
        :key="idx"
        class="card__modifiers text-xs c-gray"
      >
        {{ mod.label }}<template v-if="mod.value">: {{ mod.value }}</template>
      </span>
      <div
        v-if="renderProduct.packing_weights.split(' ')[0][0] !== '0'"
        class="card__description text-s c-gray"
      >
        {{ renderProduct.packing_weights }}
      </div>
      <div v-if="isPreorder" class="card__preorder text-s c-primary">
        <template v-if="+$env.stopListType === 1">Эта позиция не доступна</template>
        <template v-else> Этот товар доступен только по предзаказу</template>
      </div>
      <div
        v-if="!isGift"
        class="card__action"
        @click.stop
        @mouseenter="setFocused(false)"
        @mouseleave="setFocused(true)"
      >
        <UiPlusMinus
          v-if="!isProductHardStopped && productQuantityInCartWithModifiers !== 0"
          size="small"
          :value="productQuantityInCartWithModifiers || 0"
          :min-weight="plusminusParams.minWeight"
          :min-value="plusminusParams.min"
          :max-value="plusminusParams.max"
          :step="plusminusParams.step"
          @on-change="(n) => handleQuantityChange(n)"
        />
        <template v-else-if="!isProductHardStopped">
          <UiButton theme="secondary" @click="handleReturn"> Вернуть </UiButton>
          <UiButton theme="secondary" @click="handleRemove"> Удалить </UiButton>
        </template>
        <UiButton v-if="isPreorder" theme="secondary" @click="handleRemove"> Удалить </UiButton>
      </div>
    </div>
    <div class="card__meta">
      <div class="card__price h5-title">
        <template v-if="!isGift"> {{ formatPrice(productPrice.raw * cartItem?.q || 0) }}</template>
        <template v-else>Бесплатно</template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { IProduct } from '~/interface/Product'
import { ICartInner } from '~/interface/Cart'
import { useCartStore, useUiStore } from '~/store'
import { useProduct } from '#imports'

const { $env } = useNuxtApp()
const cartStore = useCartStore()
const { cartStoped } = storeToRefs(cartStore)
const ui = useUiStore()

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => ({}),
  },
  cartItem: {
    type: Object as PropType<ICartInner>,
    default: null,
  },
  isGift: {
    type: Boolean,
    default: false,
  },
})

const { renderProduct, productPrice, productModifiersVerbose, productQuantityInCartWithModifiers } =
  useProduct({
    cartItem: props.cartItem,
    product: props.product,
  })

const isPreorder = computed(() => {
  return cartStoped.value.includes(renderProduct.value.id) || renderProduct.value.only_pre_order
})

const plusminusParams = computed(() => {
  let minWeight = 0
  const min = renderProduct.value.min_items || 0
  let max = 99
  let step = 1

  if (renderProduct.value.sale_by_weight) {
    minWeight = renderProduct.value.min_weight || 100
    max = renderProduct.value.max_weight || 100 * 1000
    step = renderProduct.value.weight_step || 100
  }

  return {
    minWeight,
    min,
    max,
    step,
  }
})

const isProductHardStopped = computed(() => {
  if (isPreorder.value) {
    return +$env.stopListType === 1
  }
  return false
})

const handleReturn = () => {
  cartStore.changeQuantity({
    id: renderProduct.value.id,
    quantity: 1,
    modifiers: props.cartItem?.modifiers || [],
  })
}

const handleRemove = () => {
  cartStore.removeFromCart(renderProduct.value.id, props.cartItem?.modifiers)
}

const handleQuantityChange = (n: number) => {
  // disables return/remove functionality
  if (n === 0) {
    handleRemove()
  } else {
    cartStore.changeQuantity({
      id: renderProduct.value.id,
      quantity: n,
      modifiers: props.cartItem?.modifiers || [],
    })
  }
}

const handleProductClick = () => {
  ui.setModal({
    name: 'product',
    keepPrevious: true,
    params: { id: renderProduct.value.id, critical: renderProduct.value, isGift: props.isGift },
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
    .plusminus {
      margin-right: 12px;
    }
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
