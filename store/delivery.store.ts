import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  IZone,
  IOrganization,
  IUserAddress,
  IOrganizationTakeaway,
  ICurrentAddress,
  IRegion,
} from 'interface/Delivery'
import { localStorageKeepArray, localStorageGet } from '#imports'

export const useDeliveryStore = defineStore('delivery', {
  state: () => {
    return {
      region: null as string | null,
      regions: [] as IRegion[],

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
      const region = state.regions.find((x) => x.id === +(state.region || 0))
      if (region) {
        return region.title as string
      }
      return null
    },
    minOrderPrice(state) {
      const isDelivery = this.currentAddressType === 'delivery'
      const isTakeaway = this.currentAddressType === 'takeaway'

      if (isDelivery) {
        return state.zone?.min_order || null
      } else if (isTakeaway) {
        return state.takeawayOrganization?.min_order || null
      }

      return null
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

            return `с ${fromFormated} по ${toFormated}`
          }

          return ''
        } catch {
          return ''
        }
      },
  },
  actions: {
    setCurrentAddress(payload) {
      if (payload) {
        this.currentAddress = { ...payload }
      } else {
        this.currentAddress = null
        this.zone = {} as IZone
        this.takeawayOrganization = {} as IOrganizationTakeaway
      }
    },
    async checkZone({
      latitude,
      longitude,
      passive,
    }: {
      latitude: number
      longitude: number
      passive?: boolean
    }) {
      const data = (await useApi('organization/check-zone', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          lat: latitude,
          lng: longitude,
        },
      })) as IZone

      if (!passive) {
        this.zone = { ...data }
      }

      return data
    },
    async getRegions() {
      const data = (await useApi('organization/get-regions', {
        method: 'GET',
        headers: useHeaders(),
      }).catch(useCatchError)) as IRegion[]

      this.regions = [...data]

      return data
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
        if (latitude && longitude) {
          await this.checkZone({ latitude, longitude })
        }
      } else if (this.currentAddress?.type === 'takeaway') {
        await this.setTakeawayOrganization({ id: this.currentAddress?.org_id })
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeliveryStore, import.meta.hot))
}
