import { defineStore, acceptHMRUpdate } from 'pinia'
import { ICartInner, ICartModifier } from '~/interface/Cart'
import { IProduct, IAdditive, IModifierItem } from '~/interface/Product'
import { IPromoDto, IPromoRequestDto, ICheckStopListDto } from '~/interface'
import { useDeliveryStore } from '~/store'
import { isArraysEqual, getArrayDifference } from '#imports'

// cart держит массив id и quantity для работы с кукой и упрощает работу с данными
// products держит массив добавленных продуктов в исходном виде

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      cart: [] as ICartInner[],
      cartStoped: [] as number[],
      products: [] as IProduct[],
      additives: [] as IAdditive[],
      additivesCart: [] as ICartInner[],
      suggestions: [] as IProduct[],
      promo: null as IPromoDto | null,
      promoGiftId: null as number | null,
      savedPromocode: null as string | null,
    }
  },
  persist: {
    paths: ['cart', 'promoGiftId', 'additivesCart', 'savedPromocode'],
  },
  getters: {
    // общее количество уникальных товаров с учетом добавок
    totalCartLength: (state) => {
      const cartItems = state.cart.length
      const additivesItems = state.additivesCart.length

      return cartItems + additivesItems
    },
    // количство товаров в основной корзине по id
    productsCountInCart: (state) => (id: number) => {
      const matchingProducts = state.cart.filter((x) => x.id === id)

      return matchingProducts.length
    },
    productsCountInCartTotal: (state) => (id: number) => {
      const matchingProducts = state.cart.filter((x) => x.id === id)

      return matchingProducts.reduce((acc, x) => {
        acc += x.q
        return acc
      }, 0)
    },
    // считает с учетом выбранных модификаторов товара
    productQuantityInCart:
      (state) =>
      (id: number, modifiers?: ICartModifier[]): number | null => {
        const matchingProducts = state.cart.filter((x) => x.id === id)
        if (matchingProducts.length) {
          // проверка на полное совпадение модификторов
          if (modifiers) {
            const modifierIds = modifiers.map((x) => x.id)
            let productWithModifiersInCart: number | null = null

            matchingProducts.forEach((p) => {
              const productModifiers = p.modifiers?.map((x) => x.id) || []
              if (isArraysEqual(productModifiers, modifierIds)) {
                productWithModifiersInCart = p.q
              }
            })

            return productWithModifiersInCart
          }

          // в противном случае .filter должен вернуть только 1 товар по совпадению id
          return matchingProducts[0].q
        }
        return null
      },
    cartPrice: (state): number => {
      const priceCalcFunc = (product: IProduct, c: ICartInner) => {
        let price = product.price || 0
        if (product.sale_by_weight) {
          price = price / 1000
        }

        const modifiersTotal =
          c.modifiers?.reduce((modAcc, mod) => {
            modAcc += mod.price * mod.q
            return modAcc
          }, 0) || 0

        return (price + modifiersTotal) * c.q
      }

      const catalogPrice = state.cart.reduce((acc, c) => {
        const product = state.products.find((x) => x.id === c.id)
        if (product) {
          const price = priceCalcFunc(product, c)
          acc += price
        }

        return acc
      }, 0)

      const additivesPrice = state.additivesCart.reduce((acc, c) => {
        const product =
          state.additives.find((x) => x.catalog_item.id === c.id)?.catalog_item || null
        if (product) {
          const price = priceCalcFunc(product, c)
          acc += price
        }

        return acc
      }, 0)

      return catalogPrice + additivesPrice
    },
    cartToApi: (state) => {
      const cartMapper = (x: ICartInner) => ({
        catalog_item_id: x.id,
        count: x.q,
        modifiers:
          x.modifiers?.map((mod) => ({
            catolog_item_modifier_id: mod.id,
            count: 1,
          })) || [],
      })

      const cartItems = state.cart.map(cartMapper)
      const additivesItems = state.additivesCart.map(cartMapper)

      return [...cartItems, ...additivesItems]
    },
  },
  actions: {
    async addToCart(product: IProduct, quantity = 1, modifiers: ICartModifier[]) {
      const cartObj: ICartInner = { id: product.id, q: quantity || 1 }
      if (modifiers) {
        cartObj.modifiers = modifiers.map((x: ICartModifier) => ({
          id: x.id,
          price: x.price,
          q: 1,
        }))
      }

      this.cart.push(cartObj)
      // чистка дубликатов оригинальных обьектов товара
      this.products = [...new Map([...this.products, product].map((x) => [x.id, x])).values()]

      await this.sendCartAnalytics({
        action: 'add',
        body: {
          catolog_item_id: product.id,
          count: quantity || 1,
          modifiers: modifiers
            ? modifiers.map((x) => ({
                catolog_item_modifier_id: x.id,
                count: 1,
              }))
            : [],
        },
      })
    },
    async changeQuantity({
      id,
      quantity,
      modifiers,
    }: {
      id: number
      quantity: number
      modifiers: ICartModifier[]
    }) {
      this.cart = this.cart.map((x) => {
        let acceptQuantity = false

        if (x.id === id) {
          // если переданы модификаторы, меняется только по
          if (modifiers && x.modifiers) {
            const productModifiers = x.modifiers.map((x) => x.id)
            const incomingModifiers = modifiers.map((x) => x.id)

            if (isArraysEqual(productModifiers, incomingModifiers)) {
              acceptQuantity = true
            }
          } else {
            acceptQuantity = true
          }
        }

        return acceptQuantity ? { ...x, q: quantity } : x
      })

      await this.sendCartAnalytics({
        action: 'add',
        body: {
          catolog_item_id: id,
          count: quantity,
          modifiers,
        },
      })
    },
    async removeFromCart(id: number, modifiers?: ICartModifier[]) {
      this.cart = this.cart.filter((x) => {
        // если переданы модификаторы, удаляются только совпадающие товары
        if (modifiers && x.id === id && x.modifiers) {
          const productModifiers = x.modifiers.map((x) => x.id)
          const incomingModifiers = modifiers.map((x) => x.id)

          return !isArraysEqual(productModifiers, incomingModifiers)
        }

        return x.id !== id
      })
      this.products = this.products.filter((x) => {
        // товары храняться в едином экземпляре
        // удялется только если нет других товаров с модификаторам
        if (modifiers && x.id === id && x.modifier_groups) {
          const productModifiersFlat = x.modifier_groups.reduce((acc, mod) => {
            if (mod.items?.length) {
              mod.items.forEach((x) => {
                acc = [...acc, x]
              })
            }
            return acc
          }, [] as IModifierItem[])

          const productModifiersIds = productModifiersFlat.map((x) => x.id)
          const incomingModifiers = modifiers.map((x) => x.id)

          return !isArraysEqual(productModifiersIds, incomingModifiers)
        }
        return x.id !== id
      })

      this.cartStoped = this.cartStoped.filter((x) => x !== id)

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
      this.additives = []
      this.additivesCart = []
      this.suggestions = []
      this.promo = null
    },
    // дополнительные продукты
    async getaAdditives() {
      const deliveryStore = useDeliveryStore()

      const res = (await useApi('cart/get-additives', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          order_type: deliveryStore.currentOrderType,
          cart: this.cartToApi,
        },
      })) as IAdditive[]

      this.additives = res
    },
    addAdditiveToCart(product: IProduct, quantity = 1, modifiers: ICartModifier[]) {
      const cartObj: ICartInner = { id: product.id, q: quantity || 1 }
      if (modifiers) {
        cartObj.modifiers = modifiers.map((x: ICartModifier) => ({
          id: x.id,
          price: x.price,
          q: 1,
        }))
      }

      this.additivesCart.push(cartObj)
    },
    changeAdditiveQuantity({
      id,
      quantity,
      modifiers,
    }: {
      id: number
      quantity: number
      modifiers: ICartModifier[]
    }) {
      this.additivesCart = this.additivesCart.map((x) => {
        const acceptQuantity = x.id === id

        return acceptQuantity ? { ...x, q: quantity } : x
      })
    },
    removeAdditiveFromCart(id: number, modifiers?: ICartModifier[]) {
      this.additivesCart = this.additivesCart.filter((x) => {
        return x.id !== id
      })
    },
    // предложения
    async getSuggestions() {
      if (!this.cart.length) return null

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

      return res
    },
    async getPromo({ code, time_to_delivery }: IPromoRequestDto) {
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
      })) as IPromoDto

      // определение какой подарок ставить в сторе
      if (this.promoGiftId) {
        const productExists = res.gifts?.some((x) => x.id === this.promoGiftId)
        this.promoGiftId = productExists ? this.promoGiftId : null
      } else if (res.gifts?.length) {
        this.promoGiftId = res.gifts[0].id
      } else {
        this.promoGiftId = null
      }

      if (code && !res.error_type) {
        this.savedPromocode = code
      } else {
        this.savedPromocode = null
      }

      this.promo = {
        ...res,
      }

      return res
    },
    async sendCartAnalytics({ action, body }: { action: 'add' | 'remove'; body: any }) {
      if (window && window.dataLayer) {
        window.dataLayer.push({
          ecommerce: {
            currencyCode: 'RUB',
            [action]: {
              products: [
                {
                  id: body.catalog_item_id,
                  quantity: body.count,
                },
              ],
            },
          },
        })
      }

      await useApi(`cart/${action}`, {
        method: 'POST',
        headers: useHeaders(),
        body,
      }).catch((err) => useCatchError(err, '', true))
    },

    // начальное получение каталога (работает в onMounted хуке)
    async fetchCartProducts() {
      if (this.cart.length === 0) return

      const res = (await useApi('catalog/get-catalog-items-by-ids', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          ids: this.cart.map((x) => x.id),
        },
      })) as IProduct[]

      if (res) {
        res.forEach((product) => {
          this.hydrateProducts(product)
        })

        // проверка стоплистов
        const notFoundCartIds = getArrayDifference(
          this.cart.map((x) => x.id),
          res.map((x) => x.id)
        )

        notFoundCartIds.forEach((id) => {
          this.removeFromCart(id)
        })
      }
    },

    // проверка на стоплисты
    async checkStopList() {
      if (this.cart.length === 0) return
      const { $env } = useNuxtApp()
      const stopType = +$env.stopListType

      const res = (await useApi('catalog/check-catalog-items-by-ids', {
        method: 'POST',
        headers: useHeaders(),
        body: {
          ids: this.cart.map((x) => x.id),
        },
      }).catch((err) => useCatchError(err, '', true))) as ICheckStopListDto | null

      let stoppedProductIds = [] as number[]

      if (res?.stopped_items && res.stopped_items.length) {
        // проверка стоплистов
        const stoppedItems = this.cart.filter((x) => res.stopped_items.includes(x.id))

        stoppedProductIds = stoppedItems.map((x) => x.id)

        if (stopType === 1) {
          stoppedItems.forEach((x) => {
            // this.removeFromCart(x.id)
          })
        } else if (stopType === 2) {
          // возможен предзаказ того чего нет
          stoppedItems.forEach((x) => {
            const product = this.products.find((y) => x.id === y.id)
            if (product && !product?.preorder_delay) {
              // this.removeFromCart(x.id)
            }
          })
        } else if (stopType === 3) {
          // полный предзаказ
        }
      }

      // стопы по модификаторам
      if (res?.modifiers_stop_list && res.modifiers_stop_list.length) {
        const stoppedItems = this.cart.filter((x) =>
          x.modifiers?.some((y) => res.modifiers_stop_list.includes(y.id))
        )

        stoppedProductIds = [...stoppedProductIds, ...stoppedItems.map((x) => x.id)]
      }

      this.cartStoped = [...new Set(stoppedProductIds)]

      return res
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
