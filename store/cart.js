import { defineStore, acceptHMRUpdate } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      products: [],
      stoplist: [],
    }
  },
  actions: {
    addToCart(payload) {
      this.products = [this.products, ...payload]
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
