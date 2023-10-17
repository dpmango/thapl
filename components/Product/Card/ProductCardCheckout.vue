<template>
  <div class="">
    <div class="scope__label text-m text-md-s">
      {{ renderProduct.title }}
      <span v-if="isGift" class="c-gray">Подарок </span>
      <span v-else-if="productQuantityInCartWithModifiers !== 1" class="c-gray">
        × {{ productQuantityInCartWithModifiers }}&nbsp;
      </span>
      <div
        v-for="(mod, idx) in productModifiersVerbose"
        :key="idx"
        class="scope__modifier text-xs c-gray"
      >
        {{ mod.label }}<template v-if="mod.value">: {{ mod.value }}</template>
      </div>
    </div>
    <div class="scope__value h6-title text-md-s">
      <template v-if="isGift">
        <s>{{ productPriceLabel }}</s>
      </template>

      <template v-else>{{ formatPrice(productPrice.raw * cartItem.q) }}</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IProduct } from '~/interface/Product'
import { ICartInner } from '~/interface/Cart'
import { formatPrice, useProduct } from '#imports'

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

const { productPriceLabel } = useProductHelpers({ product: renderProduct.value })
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
