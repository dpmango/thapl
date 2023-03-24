import { defineStore, acceptHMRUpdate } from 'pinia'
import { IOrder } from '~/interface/Order'

export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      orders: null as IOrder[] | null,
    }
  },
  getters: {},
  actions: {
    async getOrders() {
      const data = (await useApi('profile/get-orders', {
        headers: useHeaders(),
      })) as IOrder[]

      if (data) {
        this.orders = data
      }

      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot))
}
