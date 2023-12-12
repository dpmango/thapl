<template>
  <div class="info row">
    <div class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Можете забрать</p>
      <h5 class="info__value h5-title h6-title-md">
        <template v-if="organization.is_open">Сегодня</template>
        <template v-else><strong>Завтра</strong></template>
      </h5>
    </div>
    <div v-if="organization.takeaway_time" class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Время приготовления</p>
      <h5 class="info__value h5-title h6-title-md">
        {{ formatMinutes(organization.takeaway_time.toString()) }}
      </h5>
    </div>
    <div v-if="workingTime('takeawayOrganization')" class="info__col col col-md-4 col-sm-6">
      <p class="text-s">Часы работы</p>
      <h5 class="info__value h5-title">
        {{ workingTime('takeawayOrganization') }}
      </h5>
    </div>
    <div v-if="organization.min_order" class="info__col col col-md-4 col-sm-6">
      <p class="text-s c-gray">Заказ от</p>
      <h5 class="info__value h5-title h6-title-md">{{ formatPrice(organization.min_order) }}</h5>
    </div>
  </div>

  <div class="location__cta" @click="handleToOrderClick">
    <UiButton v-if="organization.is_open">Перейти к заказу</UiButton>
    <UiButton v-else-if="isPreorderAvailable">Сделать предзаказ</UiButton>
    <UiButton v-else>Посмотреть меню</UiButton>

    <UiButton theme="secondary" @click.stop="handleReturn">Выбрать другой адрес</UiButton>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { IOrganizationTakeaway } from 'interface/Delivery'
import { useDeliveryStore, useSessionStore, useUiStore } from '~/store'
import { formatMinutes } from '#imports'

const props = defineProps({
  organization: {
    type: Object as PropType<IOrganizationTakeaway>,
    default: () => ({}),
  },
})

const deliveryStore = useDeliveryStore()
const sessionStore = useSessionStore()
const { isPreorderAvailable } = storeToRefs(sessionStore)
const { workingTime } = storeToRefs(deliveryStore)

const ui = useUiStore()

const handleToOrderClick = () => {
  ui.closeModal()
}

const handleReturn = () => {
  deliveryStore.setCurrentAddress(null)
}
</script>

<style lang="scss" scoped>
.info {
  &__col {
    margin-top: 16px;
  }
  &__value {
    margin-top: 8px;
  }
}

@include r($md) {
  .info {
    &__col {
      margin-top: 20px;
    }
  }
}

@include r($sm) {
  .info {
    &__value {
      margin-top: 4px;
    }
  }
}
</style>
