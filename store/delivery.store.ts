import { defineStore, acceptHMRUpdate } from 'pinia'
import { IZone, IOrganization, IUserAddress, IOrganizationTakeaway } from 'interface/Delivery'
import { localStorageKeepArray, localStorageGet } from '~/utils'

export const useDeliveryStore = defineStore('delivery', {
  state: () => {
    return {
      region: null,
      regions: [],

      restaurants: [] as IOrganizationTakeaway[],
      userAddress: [] as IUserAddress[],

      zone: {} as IZone,
      takeawayOrganization: {} as IOrganization,
    }
  },
  getters: {
    currentRegionName(state) {
      try {
        return state.regions.find((x) => x.id === state.region).title
      } catch {
        return null
      }
    },
    minOrderPrice(state) {
      try {
        return state.zone.min_order
      } catch {
        return 0
      }
    },
    workingTime(state) {
      try {
        const from = state.zone.time_from
        const to = state.zone.time_to

        if (state.zone.working_all_day) {
          return 'Круглосуточно'
        } else if (from && to) {
          return `${from} : ${to}`
        }

        return ''
      } catch {
        return ''
      }
    },
  },
  actions: {
    clientInit() {
      this.getStoredAddresses()
    },
    serverInit() {},
    async checkZone({ latitude, longitude }) {
      const data = (await useApi('organization/check-zone', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          // lat: latitude,
          lat: 55.66887,
          lng: 37.441142,
          // lng: longitude,
        },
      })) as IZone

      this.zone = { ...data }

      return data
    },
    async getRegions(region) {
      const data = await useApi('organization/get-regions', {
        method: 'GET',
        headers: useHeaders(),
      }).catch(useCatchError)

      this.regions = [...data]

      return []
    },
    async getRestaurants() {
      const data = (await useApi('organization/get-organizations-for-takeaway', {
        method: 'POST',
        headers: useHeaders(),
      }).catch(useCatchError)) as IOrganizationTakeaway[]

      this.restaurants = [...data]

      return data
    },
    async setTakeawayOrganization({ id }) {
      const data = (await useApi('organization/get-organization-data', {
        method: 'GET',
        headers: useHeaders(),
        params: {
          id,
        },
      }).catch(useCatchError)) as IOrganization[]

      this.takeawayOrganization = { ...data }

      return data
    },

    getStoredAddresses() {
      const stored = localStorageGet('userAddress') || []
      this.userAddress = [...stored]
    },
    saveAddress(payload: IUserAddress) {
      const updated = localStorageKeepArray('userAddress', payload, 'name')
      this.userAddress = [...updated]
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeliveryStore, import.meta.hot))
}
