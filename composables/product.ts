import { ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore, useUiStore } from '~/store'
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
  const { productQuantityInCart, products, additives, additivesCart } = storeToRefs(cartStore)

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

  return {
    renderProduct,
    productPrice,
    productModifiersVerbose,
    productQuantityInCartWithModifiers,
  }
}
