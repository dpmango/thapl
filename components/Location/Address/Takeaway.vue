<template>
  <div class="takeaway">
    <ul v-if="Object.keys(restaurantSelected).length === 0" class="takeaway__list">
      <LocationAddressList
        v-for="(restaurant, idx) in restaurants"
        :key="idx"
        :title="restaurant.title"
        :description="[restaurant.phone, restaurant.working_hours]"
        @click="selectRestaurant(restaurant)"
      />
    </ul>

    <template v-else>
      <LocationAddressDetails
        :organization="takeawayOrganization"
        :coordinates="[restaurantSelected.lat, restaurantSelected.lng]"
        :marker="restaurantSelected.title"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { IOrganizationTakeaway } from '~/interface/Delivery'
import { useDeliveryStore } from '~/store'

const deliveryStore = useDeliveryStore()
const { restaurants, takeawayOrganization } = storeToRefs(deliveryStore)

const restaurantSelected = ref({} as IOrganizationTakeaway)

const selectRestaurant = async (restaurant) => {
  const organization = await deliveryStore.setTakeawayOrganization({ id: restaurant.id })

  if (organization) {
    restaurantSelected.value = { ...restaurant }
  }
}
</script>

<style lang="scss">
.takeaway {
  &__list {
    margin-top: 12px;
  }
}
</style>
