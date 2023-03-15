<template>
  <div class="profile">
    <div class="container _narrow">
      <ProfileNav class="profile__nav" />

      <div v-if="addresses.length" class="profile__addresses">
        <ProfileAddress
          v-for="address in addresses"
          :key="address.id"
          class="profile__address"
          :address="address"
          @dispatch-update="emit('dispatchUpdate')"
        />
      </div>

      <div v-else class="profile__empty">
        <UiAtomErrorMessage icon="cart-outline" title="Адресов пока нет">
          <template #content>
            Зайдите в меню, выберите блюда, которые хотите съесть
            <template v-if="minOrderPrice">
              :nbsp;, а мы оперативно доставим ваш заказ от {{ formatPrice(minOrderPrice) }}.
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

<script setup>
import { storeToRefs } from 'pinia'
import { useDeliveryStore } from '~/store'

const deliveryStore = useDeliveryStore()
const { minOrderPrice } = storeToRefs(deliveryStore)

const props = defineProps({
  addresses: {
    type: Array,
    default: () => null,
  },
})

const emit = defineEmits('dispatchUpdate')
</script>

<style lang="scss" scoped>
.profile {
  margin: 60px 0 120px;
  &__addresses {
    margin-top: 36px;
  }
  &__address {
    margin-bottom: 20px;
  }
  &__empty {
    margin-top: 36px;
  }
}

@include r($sm) {
  .profile {
    margin: 32px 0 72px;
    &__addresses {
      margin-top: 28px;
    }

    &__orders {
      margin-top: 0;
    }
  }
}
</style>
