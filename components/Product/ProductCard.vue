<template>
  <div class="card" :data-id="product.id">
    <div class="card__image">
      <img :src="product.image" :alt="product.title" />
      <div class="card__badges">
        <UiBadge v-for="tag in product.tags" :key="tag" theme="green" size="small">
          {{ tag }}
        </UiBadge>
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h4-title">
        <UiAtomLongWords :text="product.title" />
      </div>
      <div class="card__description text-s c-gray">
        {{ product.description }}
      </div>
      <div class="card__actions">
        <div class="card__price text-l">{{ product.price }} ₽</div>
        <div class="card__add">
          <UiButton
            v-if="!productQuantityInCart(product.id)"
            theme="secondary"
            @click="handleSelect"
          >
            Выбрать
          </UiButton>
          <UiPlusMinus
            v-else
            size="medium"
            :value="productQuantityInCart(product.id)"
            @on-change="handleQuantityChange"
          />
        </div>
      </div>
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

const handleSelect = () => {
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
.card {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  &__image {
    position: relative;
    border-radius: var(--card-border-radius);
    font-size: 0;
    padding-bottom: var(--product-card-ar);
    background: var(--color-bg);
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // max-width: auto;
      object-fit: cover;
    }
  }
  &__badges {
    position: absolute;
    z-index: 2;
    top: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    .badge {
      margin-right: 4px;
    }
  }
  &__body {
    margin-top: 16px;
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
  }
  // &__title {
  //   word-break: break-all;
  // }
  &__description {
    margin-top: 12px;
  }
  &__actions {
    padding-top: 16px;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__add {
    font-size: 0;
  }
}
</style>
