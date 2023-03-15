<template>
  <div class="">
    <div class="scope__label text-m text-md-s">
      {{ renderProduct.title }}
      <span v-if="isGift" class="c-gray">Подарок </span>
      <span v-else-if="productQuantityInCart(renderProduct.id) !== 1" class="c-gray">
        × {{ productQuantityInCart(renderProduct.id) }}&nbsp;
      </span>
      <div v-for="(mod, idx) in productModifiers" :key="idx" class="scope__modifier text-xs c-gray">
        {{ mod.label }}
      </div>
    </div>
    <div class="scope__value h6-title text-md-s c-primary">
      <template v-if="isGift">
        <s>{{ formatPrice(renderProduct.price) }}</s>
      </template>
      <template v-else>{{ productPrice }}</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/store'
import { IProduct } from '~/interface/Product'
import { ICartInner } from '~/interface/Cart'
import { formatPrice, useProduct } from '#imports'

const cartStore = useCartStore()
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
  isGift: {
    type: Boolean,
    default: false,
  },
})

const { renderProduct, productPrice, productModifiers } = useProduct({
  cartItem: props.cartItem,
  product: props.product,
})
</script>

<style lang="scss" scoped>
.scope {
  &__label {
    padding-right: 20px;
  }
  &__value {
    flex: 0 0 auto;
  }
  &__modifier {
  }
}

@include r($lg) {
  .scope {
    &__label {
      padding-right: 20px;
    }

    &._opened {
      .scope {
        &__toggle {
          .nuxt-icon {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style>
