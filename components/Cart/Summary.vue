<template>
  <div v-if="products" class="cart">
    <div class="cart__head">
      <div class="h2-title">Корзина</div>
      <!-- <p class="text-xs">freeDeliveryData: {{ freeDeliveryData }}</p>
      <p class="text-xs">minOrderData: {{ minOrderData }}</p> -->
      <div v-if="freeDeliveryData.show" class="cart__delivery">
        <div class="h6-title">
          <template v-if="freeDeliveryData.match">Бесплатная доставка</template>
          <template v-else>Доставка {{ formatPrice(priceData.delivery) }} ₽</template>
        </div>
        <UiProgress class="cart__delivery-progress" :width="freeDeliveryData.progress" />
        <div class="text-s c-gray">
          <template v-if="freeDeliveryData.match"> Приятно, не правда ли? </template>
          <template v-else>
            До бесплатной не хватает {{ formatPrice(freeDeliveryData.remained) }} ₽
          </template>
        </div>
      </div>
    </div>

    <div class="cart__scroller">
      <div class="cart__list">
        <ProductCardCart v-for="product in products" :key="product.id" :product="product" />
      </div>

      <div v-if="zoneData.isDelivery" class="cart__meta">
        <div class="text-m">Доставка</div>
        <div class="cart__meta-value">
          <template v-if="priceData.delivery">{{ priceData.delivery }} ₽</template>
          <template v-else>Бесплатно</template>
        </div>
      </div>
      <div v-else-if="zoneData.isTakeaway" class="cart__meta">
        <div class="text-m">Самовывоз</div>
        <div class="cart__meta-value">Бесплатно</div>
      </div>
    </div>

    <div class="cart__cta">
      <p v-if="!minOrderData.match" class="cart__cta-note text-m c-gray">
        До минимального заказа {{ formatPrice(minOrderData.remained) }} ₽
      </p>
      <UiButton to="/order" :block="true" :disabled="!minOrderData.match">
        Оформить заказ &bull; {{ priceData.withDelivery }} ₽
      </UiButton>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/store'
import { formatPrice } from '#imports'

const cartStore = useCartStore()
const { products } = storeToRefs(cartStore)
const { priceData, zoneData, minOrderData, freeDeliveryData } = useCheckout()
</script>

<style lang="scss" scoped>
.cart {
  &__head {
    flex: 0 0 auto;
    padding: 48px 32px 16px;
  }
  &__scroller {
    flex: 1;
    min-height: 1px;
    overflow-y: auto;
    padding: 0px 32px;
    -webkit-overflow-scrolling: touch;
  }
  &__list {
    margin-top: 12px;
    .card {
      border-bottom: 1px solid var(--color-border);
    }
  }
  &__delivery {
    margin-top: 28px;
    background: var(--color-bg);
    border-radius: 12px;
    padding: 20px 24px;
  }
  &__delivery-progress {
    margin: 12px 0;
  }
  &__meta {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__meta-value {
    font-weight: 500;
  }
  &__cta {
    flex: 0 0 auto;
    margin-top: auto;
    background: var(--component-background);
    padding: 24px 32px;
    box-shadow: var(--box-shadow-extra-large);
  }
  &__cta-note {
    text-align: center;
    margin-bottom: 12px;
  }
}

@include r($sm) {
  .cart {
    &__head {
      padding: 24px 24px 16px;
    }
    &__scroller {
      padding: 0px 24px;
    }
    &__list {
      margin-top: 12px;
    }
    &__delivery {
      padding: 16px 16px;
    }
    &__delivery-progress {
      margin: 8px 0;
    }
    &__cta {
      padding: 16px 24px;
    }
    &__cta-note {
      margin-bottom: 8px;
    }
  }
}
</style>
