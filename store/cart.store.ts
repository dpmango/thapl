import { defineStore, acceptHMRUpdate } from 'pinia'
import { ICartInner, ICartModifier } from '~/interface/Cart'
import { IProduct, IGift } from '~/interface/Product'
import { useDeliveryStore } from '~/store'

// cart держит массив id и quantity для работы с кукой и упрощает работу с данными
// products держит массив добавленных продуктов в исходном виде
// TODO - продумать вариант с гидрацией когда сложно получить flatCatalog (категории, концепции)

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      cart: [] as ICartInner[],
      products: [] as IProduct[],
      stoplist: [] as IProduct[],
      gifts: [] as IGift[],
      suggestions: [] as IProduct[],
    }
  },
  persist: {
    paths: ['cart'],
  },
  getters: {
    productQuantityInCart:
      (state) =>
      (id: number): number | null => {
        const product = state.cart.find((x) => x.id === id)
        if (product) {
          return product.q
        }
        return null
      },
    cartPrice: (state): number => {
      return state.cart.reduce((acc, c) => {
        const product = state.products.find((x) => x.id === c.id)
        if (product) {
          acc += product.price * c.q
        }

        return acc
      }, 0)
    },
    cartToApi: (state) => {
      return state.cart.map((x) => ({
        catalog_item_id: x.id,
        count: x.q,
        modifiers: [],
      }))
    },
  },
  actions: {
    // TODO баг когда q = 0 (вернуть товар) и нажимаем добавить в коризну из продуктов
    // changeQuantity в коризне vs addToCart в списке
    async addToCart(product: IProduct, quantity = 1, modifiers: ICartModifier[]) {
      const cartObj: ICartInner = { id: product.id, q: quantity || 1 }
      if (modifiers?.length) {
        cartObj.modifiers = modifiers.map((x: ICartModifier) => ({
          id: x.id,
          q: 1,
        }))
      }

      this.cart.push(cartObj)
      this.products.push(product)

      await this.getGifts()
      await this.getSuggestions()
      await this.sendCartAnalytics({
        action: 'add',
        body: {
          catolog_item_id: product.id,
          count: quantity || 1,
          modifiers: modifiers?.length
            ? modifiers.map((x) => ({
                catolog_item_modifier_id: x.id,
                count: 1,
              }))
            : [],
        },
      })
    },
    async changeQuantity({ id, quantity }: { id: number; quantity: number }) {
      this.cart = this.cart.map((x) => (x.id === id ? { id: x.id, q: quantity } : x))

      await this.getGifts()
      await this.getSuggestions()
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

      await this.getGifts()
      await this.getSuggestions()
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
      this.gifts = []
    },
    async getGifts() {
      const deliveryStore = useDeliveryStore()

      const res = (await useApi('cart/get-additives', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          order_type: deliveryStore.currentOrderType,
          cart: this.cartToApi,
        },
      })) as IGift[]

      this.gifts = res
    },
    async getSuggestions() {
      const deliveryStore = useDeliveryStore()

      const res = (await useApi('cart/get-suggest', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          order_type: deliveryStore.currentOrderType,
          cart: this.cartToApi,
        },
      })) as IProduct[]

      this.suggestions = res
    },
    async getPromo({ code, time_to_delivery }: { code?: string; time_to_delivery?: string }) {
      const deliveryStore = useDeliveryStore()

      const res = (await useApi('cart/check-promo', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          order_type: deliveryStore.currentOrderType,
          cart: this.cartToApi,
          time_to_delivery,
          promo_code: code,
        },
      })) as IProduct[]

      this.suggestions = res

      return res
    },
    async sendCartAnalytics({ action, body }: { action: 'add' | 'remove'; body: any }) {
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
