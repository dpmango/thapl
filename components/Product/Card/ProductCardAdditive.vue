<template>
  <div class="card">
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
      <div class="card__action">
        <UiPlusMinus
          v-if="!isProductHardStopped"
          size="small"
          :value="additiveCounter.total"
          :min-weight="plusminusParams.minWeight"
          :min-value="plusminusParams.min"
          :max-value="plusminusParams.max"
          :step="plusminusParams.step"
          :is-deletable="false"
          @on-change="(n) => handleQuantityChange(n)"
        />
      </div>
    </div>
    <div class="card__meta">
      <div class="card__price h5-title">
        <template v-if="additiveCounter.payable">{{
          formatPrice(productPrice.raw * additiveCounter.payable)
        }}</template>
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
const { additivesCart, cartStoped } = storeToRefs(cartStore)
const ui = useUiStore()

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => ({}),
  },
  // бесплатное количество
  additiveCount: {
    type: Number,
    required: true,
    default: 0,
  },
})

const additiveCartItem = computed(() => {
  return additivesCart.value.find((x) => x.id === props.product.id) || null
})

const { renderProduct, productPrice, productModifiersVerbose } = useProduct({
  cartItem: additiveCartItem.value,
  product: props.product,
  isAdditive: true,
})

// подсчет общего количества и платных
const additiveCounter = computed(() => {
  let total = props.additiveCount
  let payable = 0

  if (additiveCartItem.value) {
    total = total + additiveCartItem.value.q
    payable = additiveCartItem.value.q
  }

  return {
    total,
    payable,
  }
})

const isPreorder = computed(() => {
  return cartStoped.value.includes(renderProduct.value.id) || renderProduct.value.only_pre_order
})

const plusminusParams = computed(() => {
  let minWeight = 0
  const min = props.additiveCount
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

// В коризне храниться только дополнительное количество (поверх бесплатного)
// Селектор не позволяет проставить значения меньше бесплатного (отказаться от бесплатного)
// TODO модификаторы не учитываются
const handleQuantityChange = (n: number) => {
  // входящее количество платных позиций
  const difference = n - props.additiveCount
  const modifiers = additiveCartItem.value?.modifiers || []

  //  добавить в корзину
  if (additiveCartItem.value === null && difference > 0) {
    cartStore.addAdditiveToCart(renderProduct.value, difference, modifiers)
  } else if (difference <= 0) {
    // если входящее количество платных 0, удалять из корзины
    cartStore.removeAdditiveFromCart(renderProduct.value.id, additiveCartItem.value?.modifiers)
  } else {
    // изменить количество
    cartStore.changeAdditiveQuantity({
      id: renderProduct.value.id,
      quantity: difference,
      modifiers,
    })
  }
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
}
</style>
