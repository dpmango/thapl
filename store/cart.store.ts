import { defineStore, acceptHMRUpdate } from 'pinia'
import { ICartInner } from '~/interface/Cart'
import { IProduct } from '~/interface/Product'

// cart держит массив id и quantity для работы с кукой и упрощает работу с данными
// products держит массив добавленных продуктов в исходном виде
// TODO - продумать вариант с гидрацией когда сложно получить flatCatalog (категории, концепции)

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      cart: [] as ICartInner[],
      products: [] as IProduct[],
      stoplist: [] as IProduct[],
    }
  },
  persist: {
    paths: ['cart'],
  },
  getters: {
    productQuantityInCart:
      (state) =>
      (id: number): number | null => {
        try {
          return state.cart.find((x) => x.id === id).q
        } catch {
          return null
        }
      },
    cartPrice: (state): number => {
      let sum = 0

      state.cart.forEach((c) => {
        const product = state.products.find((x) => x.id === c.id)
        if (product) {
          sum += product.price * c.q
        }
      })

      return sum
    },
  },
  actions: {
    // TODO баг когда q = 0 (вернуть товар) и нажимаем добавить в коризну из продуктов
    // changeQuantity в коризне vs addToCart в списке
    async addToCart(product, quantity = 1) {
      this.cart.push({ id: product.id, q: quantity || 1 })
      this.products.push(product)

      await this.sendCartAnalytics({
        action: 'add',
        body: {
          catolog_item_id: product.id,
          count: quantity || 1,
          modifiers: [],
        },
      })
    },
    async changeQuantity({ id, quantity }) {
      this.cart = this.cart.map((x) => (x.id === id ? { id: x.id, q: quantity } : x))

      await this.sendCartAnalytics({
        action: 'add',
        body: {
          catolog_item_id: id,
          count: quantity,
          modifiers: [],
        },
      })
    },
    async removeFromCart(id: number) {
      this.cart = this.cart.filter((x) => x.id !== id)
      this.products = this.products.filter((x) => x.id !== id)

      await this.sendCartAnalytics({
        action: 'remove',
        body: {
          catolog_item_id: id,
        },
      })
    },
    resetCart() {
      this.cart = []
      this.products = []
    },
    async sendCartAnalytics({ action, body }) {
      await useApi(`cart/${action}`, {
        method: 'POST',
        headers: useHeaders(),
        body,
      }).catch((err) => useCatchError(err, '', true))
    },

    hydrateProducts(product: IProduct) {
      // wrapper for onMount population
      this.products.push({ ...product })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
