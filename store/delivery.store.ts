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
      return state.currentAddress?.type || null
    },
    currentRegionName(state) {
      const region = state.regions.find((x) => x.id === state.region)
      if (region) {
        return region.title as string
      }
      return null
    },
    minOrderPrice(state) {
      return state.zone?.min_order || null
    },
    workingTime:
      (state) =>
      (key = 'zone') => {
        try {
          const from = state[key].time_from
          const to = state[key].time_to

          if (state[key].working_all_day) {
            return 'Круглосуточно'
          } else if (from && to) {
            let fromFormated = from.split(':')
            let toFormated = to.split(':')
            if (fromFormated.length >= 3) {
              fromFormated = fromFormated.slice(0, 2).join(':')
            }
            if (toFormated.length >= 3) {
              toFormated = toFormated.slice(0, 2).join(':')
            }

            return `${fromFormated} : ${toFormated}`
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
          lat: latitude,
          lng: longitude,
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
