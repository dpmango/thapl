<template>
  <div class="add-to-cart">
    <UiButton v-if="!productQuantityInCart(product.id)" :theme="btnTheme" @click="handleSelect">
      <slot />
    </UiButton>
    <UiPlusMinus
      v-else
      size="medium"
      :value="productQuantityInCart(product.id)"
      @on-change="handleQuantityChange"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { IProduct } from '~/interface/Product'
import { useCartStore, useDeliveryStore, useUiStore } from '~/store'

const ui = useUiStore()
const deliveryStore = useDeliveryStore()
const cartStore = useCartStore()

const { productQuantityInCart } = storeToRefs(cartStore)
const { currentAddress } = storeToRefs(deliveryStore)

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
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

const emit = defineEmits(['onBeforeAdd'])

const handleSelect = () => {
  if (!currentAddress.value) {
    ui.setModal({ name: 'address' })
    return
  } else if (props.shouldEmit && props.product.open_item_page_to_add) {
    emit('onBeforeAdd')
    return
  }

  cartStore.addToCart(props.product)
}

const handleQuantityChange = (n: number) => {
  if (n === 0) {
    cartStore.removeFromCart(props.product.id)
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
