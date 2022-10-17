import { defineStore, acceptHMRUpdate } from 'pinia'
import { IZone, IUserAddress } from 'interface/Delivery'
import { localStorageKeepArray, localStorageGet } from '~/utils'

export const useDeliveryStore = defineStore('delivery', {
  state: () => {
    return {
      zone: {} as IZone,
      userAddress: [] as IUserAddress[],
    }
  },
  getters: {
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
      this.getAddresses()
    },
    serverInit() {},
    async checkZone({ latitude, longitude }) {
      const data = await useApi('organization/check-zone', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          // lat: latitude,
          lat: 55.66887,
          lng: 37.441142,
          // lng: longitude,
        },
      })

      this.zone = { ...data }

      return data
    },
    getAddresses() {
      const stored = localStorageGet('userAddress')
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
