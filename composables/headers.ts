import { storeToRefs } from 'pinia'
import { useDeliveryStore, useSessionStore } from '~/store'

export const useHeaders = () => {
  const sessionStore = useSessionStore()
  const deliveryStore = useDeliveryStore()

  const { api_token, user_token } = sessionStore
  const { region, zone, takeawayOrganization } = storeToRefs(deliveryStore)

  const headers = {}
  if (api_token) {
    headers['x-thapl-apitoken'] = api_token
  }
  if (user_token) {
    headers['x-thapl-authorization'] = user_token
  }
  if (region.value) {
    headers['x-thapl-region-id'] = region.value
  }

  const orgDeliveryID = zone.value?.organization?.id
  const orgTakeawayID = takeawayOrganization.value?.id
  let targetOrganization

  if (deliveryStore.currentAddressType === 'delivery') {
    targetOrganization = orgDeliveryID
  } else if (deliveryStore.currentAddressType === 'takeaway') {
    targetOrganization = orgTakeawayID
  }

  console.log(deliveryStore.currentAddressType, { targetOrganization })

  if (targetOrganization) {
    headers['x-thapl-organization-id'] = targetOrganization
  }

  return headers
}
