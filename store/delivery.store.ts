import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  IZone,
  IOrganization,
  IUserAddress,
  IOrganizationTakeaway,
  ICurrentAddress,
} from 'interface/Delivery'
import { localStorageKeepArray, localStorageGet } from '#imports'

export const useDeliveryStore = defineStore('delivery', {
  state: () => {
    return {
      region: null,
      regions: [],

      restaurants: [] as IOrganizationTakeaway[],
      userAddress: [] as IUserAddress[],

      zone: {} as IZone,
      takeawayOrganization: {} as IOrganizationTakeaway,

      currentAddress: null as ICurrentAddress | null,
    }
  },
  persist: {
    paths: ['currentAddress'],
  },
  getters: {
    currentOrderType(state) {
      const isDelivery = this.currentAddressType === 'delivery'
      const isTakeaway = this.currentAddressType === 'takeaway'

      let orderType: number | null = null
      if (isTakeaway) orderType = 10
      if (isDelivery) orderType = 20
      // if (isRestaurant) orderType = 30

      return orderType
    },
    currentAddressType(state): string | null {
      try {
        return state.currentAddress.type
      } catch {
        return null
      }
    },
    currentRegionName(state) {
      const region = state.regions.find((x) => x.id === state.region)
      if (region) {
        return region.title
      }
      return null
    },
    minOrderPrice(state) {
      try {
        return state.zone.min_order
      } catch {
        return null
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
      this.hydrateZone()
    },
    serverInit() {},
    setCurrentAddress(payload) {
      if (payload) {
        this.currentAddress = { ...payload }
      } else {
        this.currentAddress = null
      }
    },
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
      }).catch(useCatchError)) as IOrganizationTakeaway

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

    async hydrateZone() {
      if (this.currentAddress?.type === 'delivery') {
        const { latitude, longitude } = this.currentAddress
        await this.checkZone({ latitude, longitude })
      } else if (this.currentAddress?.type === 'takeaway') {
        await this.setTakeawayOrganization({ id: this.currentAddress?.org_id })
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeliveryStore, import.meta.hot))
}
