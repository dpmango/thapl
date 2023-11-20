import { defineStore, acceptHMRUpdate } from 'pinia'
import { IPageContactsDto } from '~/interface/Dto/Page.dto'
import { IRestaurantDto } from '~/interface/Dto/Restaurant.dto'

export const useContactStore = defineStore('contact', {
  state: () => {
    return {
      contacts: null as IPageContactsDto | null,
      restaurantList: null as IRestaurantDto[] | null,
    }
  },
  persist: {
    paths: ['user'],
  },
  getters: {},
  actions: {
    async getContacts() {
      const data = (await useApi('page/get-contacts-data', {
        method: 'GET',
        headers: useHeaders(),
      })) as IPageContactsDto

      this.contacts = data || null
    },
    async getContactRestaurants() {
      const data = (await useApi('organization/get-list', {
        method: 'GET',
        headers: useHeaders(),
      })) as IRestaurantDto[]

      this.restaurantList = data || null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContactStore, import.meta.hot))
}
