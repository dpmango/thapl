import { ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore, useUiStore } from '~/store'
import { IProduct, IModifierItem } from '~/interface/Product'
import { ICartInner } from '~/interface/Cart'
import { formatPrice } from '#imports'

export const useProduct = ({
  cartItem,
  product,
}: {
  cartItem: ICartInner | null
  product: IProduct
}) => {
  const cartStore = useCartStore()
  const { productQuantityInCart, products } = storeToRefs(cartStore)

  // если передан cartItem, отображается гидирированный продукт
  const renderProduct = computed(() => {
    if (cartItem) {
      return products.value.find((x) => x.id === cartItem.id) || {}
    }
    return product
  }) as ComputedRef<IProduct>

  // цена с учетом модификаторов в корзине
  const productPrice = computed(() => {
    let price = renderProduct.value.price

    if (renderProduct.value.sale_by_weight) {
      const minWeight = renderProduct.value.min_weight || 100
      price = price * (minWeight / 1000)
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
    return productQuantityInCart.value(renderProduct.value.id, cartItem?.modifiers)
  })

  // список модификаторов по совпадю id корзины
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

  return {
    renderProduct,
    productPrice,
    productModifiersVerbose,
    productQuantityInCartWithModifiers,
  }
}
