<template>
  <div v-if="products" class="cart">
    <div class="cart__head">
      <div class="h2-title">Корзина</div>
      <!-- <p class="text-xs">freeDeliveryData: {{ freeDeliveryData }}</p>
      <p class="text-xs">minOrderData: {{ minOrderData }}</p> -->
      <div v-if="freeDeliveryData.show" class="cart__delivery">
        <div class="h6-title">
          <template v-if="freeDeliveryData.match">Бесплатная доставка</template>
          <template v-else>Доставка {{ formatPrice(priceData.delivery) }}</template>
        </div>
        <div class="cart__delivery-row">
          <UiProgress class="cart__delivery-progress" :width="freeDeliveryData.progress" />
          <div v-if="freeDeliveryData.nextPromo" class="cart__delivery-next">
            <span
              v-for="step in [15, 30, 45, 60, 75, 99]"
              :key="step"
              :class="[freeDeliveryData.nextPromo.progress >= step && '_active']"
            />
          </div>
        </div>

        <div class="text-s c-gray">
          <!-- <template v-if="freeDeliveryData.match"> Приятно, не правда ли? </template> -->
          <template v-if="!freeDeliveryData.match">
            До бесплатной не хватает {{ formatPrice(freeDeliveryData.remained) }}
          </template>
          <template v-else-if="promo?.next_promo_text">{{ promo.next_promo_text }}</template>
        </div>
      </div>
    </div>

    <div class="cart__scroller">
      <div class="cart__list">
        <ProductCardCart
          v-for="cartItem in cart"
          :key="`${cartItem.id}_${cartItem.modifiers?.map((x) => x.id).join(',')}`"
          :cart-item="cartItem"
        />
        <ProductCardCart
          v-for="additive in additivesNotInCart"
          :key="additive.catalog_item.id"
          :additive-count="additive.count"
          :product="additive.catalog_item"
        />
        <ProductCardCart
          v-for="(gift, idx) in promoData.gifts.filter((x) => x.id === promoGiftId)"
          :key="idx"
          :is-gift="true"
          :product="gift"
        />
      </div>

      <div v-if="zoneData.isDelivery" class="cart__meta">
        <div class="text-m">Доставка</div>
        <div class="cart__meta-value">
          <template v-if="priceData.delivery">{{ priceData.delivery }}</template>
          <template v-else>Бесплатно</template>
        </div>
      </div>
      <div v-else-if="zoneData.isTakeaway" class="cart__meta">
        <div class="text-m">Самовывоз</div>
        <div class="cart__meta-value">Бесплатно</div>
      </div>
      <div v-if="promoData.hasPromo" class="cart__meta">
        <div class="text-m">Скидка</div>
        <div class="cart__meta-value">
          <template v-if="promoData.discountSum">
            -{{ formatPrice(promoData.discountSum) }}
          </template>
          <template v-else-if="promoData.isOnePlusOne">1+1</template>
          <template v-else-if="promoData.giftCount">{{ promoData.verboseGifts }}</template>
        </div>
      </div>

      <CartAddons v-if="suggestions?.length" class="cart__addons" :list="suggestions" />
    </div>

    <div class="cart__cta" @click="handlePopupMessage">
      <p v-if="!minOrderData.match" class="cart__cta-note text-m c-gray">
        До минимального заказа {{ formatPrice(minOrderData.remained) }}
      </p>
      <UiButton
        :block="true"
        :disabled="!minOrderData.match || stopListData.cartBlocked"
        @click="handleCtaClick"
      >
        Оформить заказ &bull; {{ formatPrice(priceData.withDelivery) }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification/dist/index.mjs'
import { storeToRefs } from 'pinia'
import debounce from 'lodash/debounce'
import { useCartStore, useSessionStore, useUiStore } from '~/store'
import { formatPrice } from '#imports'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const { $env, $log } = useNuxtApp()

const ui = useUiStore()
const cartStore = useCartStore()
const sessionStore = useSessionStore()
const { cart, products, additives, suggestions, promo, promoGiftId, productQuantityInCart } =
  storeToRefs(cartStore)
const { modal: activeModal } = storeToRefs(ui)
const { isAuthenticated } = storeToRefs(sessionStore)

const { priceData, zoneData, minOrderData, freeDeliveryData, promoData, stopListData } =
  useCheckout()

const additivesNotInCart = computed(() => {
  return additives.value.filter((x) => productQuantityInCart.value(x.catalog_item.id) === null)
})

const handlePopupMessage = () => {
  if (stopListData.value.cartBlocked) {
    toast.error('В корзине есть недоступные к заказу позиции')
  }
}

const handleCtaClick = () => {
  if ($env.orderAskAuth && !isAuthenticated.value) {
    ui.setModal({ name: 'auth' })
    return
  }

  if (route.path.includes('/order')) {
    ui.closeAllModals()
  } else {
    router.push('/order')
  }
}

const fetchCartData = debounce(
  () => {
    cartStore.checkStopList()
    cartStore.getaAdditives()
    cartStore.getSuggestions()
    cartStore.getPromo({})
  },
  500,
  { leading: true }
)

watch(
  () => activeModal.value,
  (newVal) => {
    if (newVal.includes('cart')) {
      fetchCartData()
    }
  }
)

watch(
  () => cart.value,
  (_) => {
    if (activeModal.value.includes('cart')) {
      fetchCartData()
    }
  }
)

watch(
  () => promo.value,
  (newVal) => {
    if (!newVal?.gifts) return
    if (!activeModal.value.includes('cart')) return

    if (newVal.gifts.length > 1 && !promoGiftId.value) {
      ui.setModal({ name: 'gift', keepPrevious: true })
    }
  }
)
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
  &__delivery-row {
    display: flex;
    align-items: center;
  }
  &__delivery-next {
    flex: 0 1 auto;
    display: flex;
    margin-left: 16px;
    span {
      width: 6px;
      height: 8px;
      margin-right: 2px;
      background: var(--progress-background-color);
      &._active {
        background: var(--color-green);
      }
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
  &__delivery-progress {
    flex: 1 1 auto;
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
  &__addons {
    margin: 8px 0 20px;
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
    &__addons {
      margin: 0 0 16px;
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
