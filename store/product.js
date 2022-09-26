import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => {
    return {
      categories: [],
    }
  },
  actions: {
    setCategories(payload) {
      this.categories = [...payload]
    },
  },
})
