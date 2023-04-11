<template>
  <div class="scope" :class="[opened && '_opened']">
    <div class="scope__toggle" @click="() => (opened = !opened)">
      <span class="h6-title">Состав заказа</span>
      <NuxtIcon name="caret" />
    </div>
    <Transition name="slide">
      <div v-if="opened" class="scope__content">
        <div class="scope__section">
          <div class="scope__products">
            <ProductCardCheckout
              v-for="cartItem in cart"
              :key="`${cartItem.id}_${cartItem.modifiers?.map((x) => x.id).join(',')}`"
              :cart-item="cartItem"
              class="scope__row"
            />

            <ProductCardCheckout
              v-for="promoProduct in promo?.gifts"
              :key="promoProduct.id"
              :product="promo"
              :is-gift="true"
              class="scope__row"
            />
          </div>
        </div>
        <div class="scope__section">
          <div class="scope__row">
            <div class="scope__label text-m text-md-s c-gray">{{ verboseCartCount }}</div>
            <div class="scope__value h6-title text-md-s">
              {{ formatPrice(priceData.pureProducts) }}
            </div>
          </div>
          <div v-if="zoneData.isDelivery" class="scope__row">
            <div class="scope__label text-m text-md-s c-gray">Доставка</div>
            <div class="scope__value h6-title text-md-s">
              <template v-if="freeDeliveryData.match">Бесплатно</template>
              <template v-else>{{ formatPrice(priceData.delivery) }}</template>
            </div>
          </div>
          <div v-if="promoData.hasPromo" class="scope__row">
            <div class="scope__label text-m text-md-s c-gray">Скидка</div>
            <div class="scope__value h6-title text-md-s">
              <template v-if="promoData.discountSum">
                -{{ formatPrice(promoData.discountSum) }}
              </template>
              <template v-else-if="promoData.isOnePlusOne">1+1</template>
              <span v-else-if="promoData.giftCount">{{ promoData.verboseGifts }}</span>
            </div>
          </div>
          <div class="scope__row">
            <div class="scope__label h6-title text-md-s">Сумма заказа</div>
            <div class="scope__value h6-title text-md-s">
              {{ formatPrice(priceData.totalToPay) }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/store'
import { formatPrice, Plurize } from '#imports'

const cartStore = useCartStore()
const { cart, products, promo } = storeToRefs(cartStore)
const { priceData, zoneData, promoData, freeDeliveryData } = useCheckout()

const verboseCartCount = computed(() => {
  const count = cart.value.length + promo.value?.gifts.length || 0
  return `${count} ${Plurize(count, 'блюдо', 'блюда', 'блюд')}`
})

const opened = ref(false)

const setOpened = () => {
  opened.value = window.innerWidth > 992
}

const debouncedResize = _.debounce(setOpened, 100)

onMounted(() => {
  setOpened()
  window.addEventListener('resize', debouncedResize, false)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize, false)
})
</script>

<style lang="scss" scoped>
.scope {
  background: var(--component-background);
  box-shadow: var(--box-shadow-large);
  border-radius: var(--card-border-radius);
  padding: 28px;
  max-width: 420px;
  &__toggle {
    display: none;
  }
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
  &__value {
    flex: 0 0 auto;
  }
}

@include r($lg) {
  .scope {
    margin-top: 28px;
    padding: 16px;
    &__toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--color-primary);
      cursor: pointer;
      .nuxt-icon {
        font-size: 10px;
        transition: transform 0.25s $ease;
      }
    }
    &__content {
      margin-top: 16px;
    }
    &__section:not(:last-child) {
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    &__row {
      margin-bottom: 12px;
    }
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
