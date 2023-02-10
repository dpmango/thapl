<template>
  <div class="add-to-cart">
    <UiButton v-if="!productQuantityWithModifier" :theme="btnTheme" @click="handleSelect">
      <slot />
    </UiButton>
    <UiPlusMinus
      v-else
      size="medium"
      :value="productQuantityWithModifier"
      @on-change="handleQuantityChange"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { IProduct } from '~/interface/Product'
import { ICardModifierInner } from '~/interface/Cart'
import { useCartStore, useDeliveryStore, useUiStore } from '~/store'

const ui = useUiStore()
const deliveryStore = useDeliveryStore()
const cartStore = useCartStore()

const { productQuantityInCart, productsCountInCart } = storeToRefs(cartStore)
const { currentAddress } = storeToRefs(deliveryStore)

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => {},
  },
  modifiers: {
    type: Array as PropType<ICardModifierInner[]>,
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
  cartStore.addToCart(props.product, 1, props.modifiers)
}

const handleQuantityChange = (n: number) => {
  if (n === 0) {
    cartStore.removeFromCart(props.product.id, props.modifiers)
  } else {
    cartStore.changeQuantity({ id: props.product.id, quantity: n })
  }
}
</script>

<style lang="scss" scoped>
.add-to-cart {
  font-size: 0;
}
</style>
