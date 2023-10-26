<template>
  <div class="add-to-cart">
    <UiButton v-if="!productQuantityWithModifier" :theme="btnTheme" @click="handleSelect">
      <slot />
    </UiButton>
    <UiPlusMinus
      v-else
      size="medium"
      :value="productQuantityWithModifier"
      :min-weight="plusminusParams.minWeight"
      :min-value="plusminusParams.min"
      :max-value="plusminusParams.max"
      :step="plusminusParams.step"
      @on-change="handleQuantityChange"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { IProduct } from '~/interface/Product'
import { ICartModifier } from '~/interface/Cart'
import { useCartStore, useDeliveryStore, useUiStore } from '~/store'

const ui = useUiStore()
const deliveryStore = useDeliveryStore()
const cartStore = useCartStore()

const { productQuantityInCart, productsCountInCart } = storeToRefs(cartStore)
const { currentAddress } = storeToRefs(deliveryStore)

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => ({}),
  },
  modifiers: {
    type: Array as PropType<ICartModifier[]>,
    default: () => [],
  },
  btnTheme: {
    type: String,
    default: '',
  },
  shouldEmit: {
    type: Boolean,
    default: true,
  },
})

const plusminusParams = computed(() => {
  let minWeight = 0
  const min = props.product.min_items || 0
  let max = 99
  let step = 1

  if (props.product.sale_by_weight) {
    minWeight = props.product.min_weight || 100
    max = props.product.max_weight || 100 * 1000
    step = props.product.weight_step || 100
  }

  return {
    minWeight,
    min,
    max,
    step,
  }
})

const productQuantityWithModifier = computed(() => {
  const count = productsCountInCart.value(props.product.id)
  if (count > 1 && !props.modifiers.length) {
    // несколько товаров с модификаторами, отображать как новый товар
    // пока не получены новые модификаторы (тогда считается как отдельный товар)
    return 0
  }

  return productQuantityInCart.value(props.product.id, props.modifiers)
})

const emit = defineEmits(['onBeforeAdd'])

const handleSelect = () => {
  if (!currentAddress.value) {
    ui.setModal({ name: 'address' })
    return
  } else if (props.shouldEmit) {
    emit('onBeforeAdd')
    return
  }

  // весовые продукты добавляются граммами
  let quantity = 1
  if (props.product.sale_by_weight) {
    quantity = props.product.min_weight || 100
    // if (props.product.max_weight && props.product.max_weight >= quantity) {
    //   quantity = props.product.max_weight
    // }
  }
  if (props.product.min_items) {
    quantity = quantity * props.product.min_items
  }

  cartStore.addToCart(props.product, quantity, props.modifiers)
}

const handleQuantityChange = (n: number) => {
  if (n === 0) {
    cartStore.removeFromCart(props.product.id, props.modifiers)
  } else {
    cartStore.changeQuantity({ id: props.product.id, quantity: n, modifiers: props.modifiers })
  }
}
</script>

<style lang="scss" scoped>
.add-to-cart {
  font-size: 0;
}
</style>
