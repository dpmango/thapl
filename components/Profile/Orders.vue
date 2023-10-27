<template>
  <div class="profile">
    <div class="container _narrow">
      <ProfileNav class="profile__nav" />

      <div v-if="orders.length" class="profile__orders">
        <OrderPreview
          v-for="order in orders"
          :key="order.id"
          class="profile__order"
          :order="order"
          :actions="true"
        />
      </div>

      <div v-else class="profile__empty">
        <UiAtomErrorMessage icon="cart-outline" title="Заказов пока нет">
          <template #content>
            Зайдите в меню, выберите блюда, которые хотите съесть
            <template v-if="minOrderPrice">
              &nbsp;, а мы оперативно доставим ваш заказ от {{ formatPrice(minOrderPrice) }}.
            </template>
          </template>
          <template #action>
            <UiButton to="/">Перейти в меню</UiButton>
          </template>
        </UiAtomErrorMessage>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDeliveryStore, useProfileStore } from '~/store'

const deliveryStore = useDeliveryStore()
const profileStore = useProfileStore()
const { minOrderPrice } = storeToRefs(deliveryStore)
const { orders } = storeToRefs(profileStore)
</script>

<style lang="scss" scoped>
.profile {
  margin: 60px 0 120px;
  &__orders {
    margin-top: 36px;
  }
  &__order {
    margin-bottom: 20px;
  }
  &__empty {
    margin-top: 36px;
  }
}

@include r($sm) {
  .profile {
    margin: 32px 0 72px;
    &__orders {
      margin-top: 28px;
    }
    &__order {
      margin-bottom: 24px;
      border-bottom: 1px solid var(--color-border);
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
