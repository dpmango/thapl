<template>
  <div class="order">
    <div class="order__head text-s">
      <span class="c-gray">{{ dateToTimestamp(order.created_at) }}</span>
      <span :class="[verboseStatus.className]">{{ verboseStatus.text }}</span>
      <span class="c-gray">{{ order.address }}</span>
    </div>

    <div class="order__table text-m">
      <div v-for="product in orders.first" :key="product.catalog_item.id" class="order__row">
        <span class="order__label">
          {{ product.catalog_item.title }}
          <span v-if="product.amount > 1" class="c-gray">× {{ product.amount }}</span>
        </span>
        <i class="order__sep"></i>
        <span class="order__value c-primary">{{
          formatPrice(product.catalog_item.price * product.amount)
        }}</span>
      </div>

      <div v-if="orders.rest" class="order__row">
        <span class="order__label">
          <span class="c-gray">{{ orders.rest.title }}</span>
        </span>
        <i class="order__sep"></i>
        <span class="order__value c-gray">{{ formatPrice(orders.rest.price) }}</span>
      </div>

      <div v-for="(stat, idx) in orders.stats" :key="idx" class="order__row">
        <span class="order__label">
          <span class="c-gray">{{ stat.title }}</span>
        </span>
        <i class="order__sep"></i>
        <span class="order__value c-gray">{{ stat.value }}</span>
      </div>

      <div class="order__row fw-500">
        <span class="order__label">Итого</span>
        <i class="order__sep"></i>
        <span class="order__value">{{ formatPrice(order.order_sum) }}</span>
      </div>
    </div>

    <div v-if="actions" class="order__actions">
      <UiButton v-if="order.can_be_payed" @click="handlePay"> Оплатить заказ </UiButton>
      <UiButton v-if="order.can_show_courier_location" theme="secondary" @click="handleDelivery">
        Подробно о доставке
      </UiButton>
      <UiButton v-if="order.can_be_canceled" @click="handleCancel"> Отменить заказ </UiButton>
      <UiButton
        v-if="$env.useTestimonials && order.user_can_send_review"
        theme="secondary"
        @click="handleRate"
      >
        Оценить заказ
      </UiButton>
      <UiButton v-if="[30, 5].includes(order.status)" theme="secondary" @click="handleRepeat">
        Повторить заказ
      </UiButton>
    </div>

    <OrderReviewModal
      v-if="actions && $env.useTestimonials && order.user_can_send_review"
      :id="order.id"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IOrder } from '~/interface/Order'
import { formatPrice, dateToTimestamp, Plurize } from '#imports'

const { $env, $log } = useNuxtApp()

const props = defineProps({
  order: {
    type: Object as PropType<IOrder>,
    default: () => {},
  },
  actions: {
    type: Boolean,
    default: false,
  },
})

const { handleDelivery, handleCancel, handlePay, handleRate, handleRepeat } = useOrder({
  orderID: props.order.id,
  cart: props.order.cart,
})

const verboseStatus = computed(() => {
  let className = 'c-primary'
  let text = ''

  switch (props.order.status) {
    case 0:
      className = 'c-primary'
      text = 'Новый'
      break
    case 7:
      className = 'c-primary'
      text = 'Подтвержден'
      break
    case 10:
      className = 'c-primary'
      text = 'В процессе'
      break
    case 15:
      className = 'c-primary'
      text = 'Приготовлен'
      break
    case 20:
      className = 'c-primary'
      text = 'Доставляется'
      break
    case 30:
      className = 'c-primary'
      text = 'Доставлен'
      break
    case 5:
      className = 'c-red'
      text = 'Отменен'
      break
    default:
      className = 'c-red'
      text = props.order.status ? props.order.status.toString() : ''

      break
  }

  return {
    className,
    text,
  }
})

const orders = computed(() => {
  let rest = null as { title: string; price: number } | null
  const stats = [] as { title: string; value: string }[]
  const cartLength = props.order.cart.length

  if (cartLength >= 3) {
    const products = props.order.cart.slice(2, cartLength)

    rest = {
      title: `Еще ${products.length} ${Plurize(products.length, 'блюдо', 'блюда', 'блюд')}`,
      price: products.reduce((acc, x) => {
        acc = acc + x.catalog_item.price * x.cartItem.count
        return acc
      }, 0),
    }
  }

  if (props.order.delivery_sum) {
    stats.push({
      title: 'Доставка',
      value: formatPrice(props.order.delivery_sum) + ' ₽',
    })
  }

  if (props.order.packing_sum) {
    stats.push({
      title: 'Упаковка',
      value: formatPrice(props.order.packing_sum) + ' ₽',
    })
  }

  if (props.order.discount_sum) {
    stats.push({
      title: 'Скидка',
      value: formatPrice(props.order.discount_sum) + ' ₽',
    })
  }

  if (props.order.gift?.length) {
    stats.push({
      title: props.order.gift
        .reduce((acc, x) => {
          acc.push(x.title)
          return acc
        })
        .join(', '),
      value: '0 ₽',
    })
  }

  return {
    first: props.order.cart.slice(0, 2),
    rest,
    stats,
  }
})
</script>

<stlye lang="scss" scoped>
.order {
  background: var(--component-background);
  box-shadow: var(--box-shadow-large);
  border-radius: var(--card-border-radius);
  padding: 36px 32px 32px 36px;
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    span {
      display: inline-flex;
      align-items: center;
      &::after {
        display: inline-block;
        content: ' ';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--breadcrumbs-separator-color);
        margin-left: 16px;
        margin-right: 16px;
      }
      &:last-child::after {
        display: none;
      }
    }
  }
  &__table {
    margin-top: 20px;
  }
  &__row {
    display: flex;
    align-items: baseline;
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__label {
    @include text-overflow();
  }
  &__value {
    flex: 0 0 auto;
  }
  &__sep {
    display: inline-block;
    flex: 1 1 auto;
    min-width: 40px;
    margin-left: 12px;
    margin-right: 12px;
    border-bottom: 1px dashed var(--breadcrumbs-separator-color);
  }
  &__actions {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    button {
      margin-top: 20px;
      margin-right: 20px;
    }
  }
}

@include r($sm) {
  .order {
    padding: 0 0 24px;
    box-shadow: none;
    border-radius: 0;
    border-bottom: 1px solid var(--color-border);
    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
    &__actions {
      margin-top: 20px;
      button {
        width: 100%;
        margin-top: 8px;
        margin-right: 0px;
      }
    }
  }
}
</stlye>
