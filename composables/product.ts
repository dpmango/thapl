import { ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore, useDeliveryStore, useUiStore } from '~/store'
import { IProduct, IModifierItem } from '~/interface/Product'
import { ICartInner } from '~/interface/Cart'
import { formatPrice } from '#imports'

export const useProduct = ({
  cartItem,
  product,
  isAdditive = false,
}: {
  cartItem: ICartInner | null
  product: IProduct
  isAdditive?: boolean
}) => {
  const cartStore = useCartStore()
  const deliveryStore = useDeliveryStore()
  const { cartStoped, productQuantityInCart, products, additives, additivesCart } =
    storeToRefs(cartStore)
  const { currentAddressType, zone, takeawayOrganization } = storeToRefs(deliveryStore)

  const { $env } = useNuxtApp()

  // если передан cartItem, отображается гидирированный продукт
  const renderProduct = computed(() => {
    if (cartItem && !isAdditive) {
      return products.value.find((x) => x.id === cartItem.id) || {}
    } else if (isAdditive && !Object.keys(product).length) {
      return additives.value.find((x) => x.catalog_item.id === cartItem?.id)?.catalog_item || {}
    }
    return product
  }) as ComputedRef<IProduct>

  // цена с учетом модификаторов в корзине
  const productPrice = computed(() => {
    let price = renderProduct.value.price

    // товары в корзине считаются по грамам, цена указана за 1кг
    if (renderProduct.value.sale_by_weight) {
      price = price / 1000
    }

    if (cartItem?.modifiers?.length) {
      cartItem?.modifiers?.forEach((x) => {
        price += x.price
      })
    }

    return {
      raw: price,
      formated: formatPrice(price),
    }
  })

  // количество товара в корзине
  const productQuantityInCartWithModifiers = computed(() => {
    if (isAdditive) {
      return additivesCart.value.find((x) => x.id === renderProduct.value.id)?.q
    }
    return productQuantityInCart.value(renderProduct.value.id, cartItem?.modifiers)
  })

  // список модификаторов по совпадению id корзины
  const productModifiersVerbose = computed(() => {
    if (cartItem?.modifiers?.length) {
      const modifiers = renderProduct.value.modifier_groups
      if (modifiers) {
        const flatModifiers = modifiers.reduce((acc, x) => {
          acc = [...acc, ...x.items]

          return acc
        }, [] as IModifierItem[])

        return cartItem?.modifiers.map((mod) => {
          const productModifier = flatModifiers.find((x) => x.id === mod.id)

          return {
            label: productModifier?.title || 'неизвестно',
            value: formatPrice(productModifier?.price, 0, false),
          }
        })
      }

      return [{ label: 'Модификаторов', value: cartItem?.modifiers?.length }]
    }

    return []
  })

  const isPreorder = computed(() => {
    return cartStoped.value.includes(renderProduct.value.id) || renderProduct.value.only_pre_order
  })

  // stock_list
  const stockCount = computed(() => {
    if (!isPreorder.value) return null
    if (+$env.stopListType === 1) return null

    const isDelivery = currentAddressType?.value === 'delivery'
    const targetOrganization = isDelivery ? zone.value?.organization : takeawayOrganization.value
    const stock_list = targetOrganization?.stock_list
    if (!stock_list) return null

    const inStock = stock_list.find((x) => x.id === renderProduct.value.id)
    if (!inStock) return null

    return inStock.balance
  })

  const matchStockCount = computed(() => {
    if (!stockCount.value) return false

    return (productQuantityInCartWithModifiers.value || 0) <= stockCount.value
  })

  return {
    renderProduct,
    productPrice,
    productModifiersVerbose,
    productQuantityInCartWithModifiers,
    isPreorder,
    stockCount,
    matchStockCount,
  }
}
