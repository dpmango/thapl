<template>
  <div class="takeaway">
    <ul v-if="!restaurantSelected" class="takeaway__list">
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

const { $log } = useNuxtApp()

const deliveryStore = useDeliveryStore()
const { restaurants, takeawayOrganization, currentAddress } = storeToRefs(deliveryStore)

const restaurantSelected = ref(null)

const selectRestaurant = async (restaurant) => {
  const organization = await deliveryStore.setTakeawayOrganization({ id: restaurant.id })

  if (organization) {
    restaurantSelected.value = { ...restaurant }

    $log.log(organization, restaurant)

    deliveryStore.setCurrentAddress({
      type: 'takeaway',
      name: restaurant.title,
      org_id: restaurant.id, // or restaurant.id
    })
  }
}

watch(
  () => currentAddress.value,
  (newVal) => {
    if (!newVal) {
      restaurantSelected.value = null
    }
  }
)
</script>

<style lang="scss">
.takeaway {
  &__list {
    margin-top: 12px;
  }
}
</style>
