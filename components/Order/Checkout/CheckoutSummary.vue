<template>
  <div class="scope">
    <div class="scope__section">
      <div class="scope__products">
        <div v-for="product in products" class="scope__row">
          <div class="scope__label text-m">
            {{ product.title }}
            <span v-if="productQuantityInCart(product.id) !== 1" class="c-gray">
              × {{ productQuantityInCart(product.id) }}
            </span>
          </div>
          <div class="scope__value h6-title c-primary">{{ formatPrice(product.price) }} ₽</div>
        </div>
      </div>
    </div>
    <div class="scope__section">
      <div class="scope__row">
        <div class="scope__label text-m c-gray">{{ cart.length }} блюд</div>
        <div class="scope__value h6-title">{{ formatPrice(priceData.pureProducts) }} ₽</div>
      </div>
      <div class="scope__row">
        <div class="scope__label text-m c-gray">Доставка</div>
        <div class="scope__value h6-title">
          <template v-if="freeDeliveryData.match">Бесплатно</template>
          <template v-else>{{ formatPrice(priceData.delivery) }} ₽</template>
        </div>
      </div>
      <div class="scope__row">
        <div class="scope__label h6-title">Сумма заказа</div>
        <div class="scope__value h6-title">
          {{ formatPrice(priceData.totalToPay) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore, useDeliveryStore } from '~/store'
import { formatPrice } from '~/utils'

const cartStore = useCartStore()
const deliveryStore = useDeliveryStore()
const { cart, products, productQuantityInCart } = storeToRefs(cartStore)
const { priceData, freeDeliveryData } = useCheckout()
</script>

<style lang="scss" scoped>
.scope {
  background: var(--component-background);
  box-shadow: var(--box-shadow-large);
  border-radius: var(--card-border-radius);
  padding: 28px;
  &__section:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 28px;
    margin-bottom: 28px;
  }
  &__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__label {
    padding-right: 20px;
  }
}
</style>
