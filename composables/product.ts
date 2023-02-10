import { ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore, useUiStore } from '~/store'
import { IProduct } from '~/interface/Product'
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

    if (cartItem?.modifiers?.length) {
      cartItem?.modifiers?.forEach((x) => {
        price += x.price
      })
    }

    return formatPrice(price)
  })

  // список модификаторов по совпадю id корзины
  const productModifiers = computed(() => {
    if (cartItem?.modifiers?.length) {
      const modifiers = renderProduct.value.modifier_groups
      // TODO делать поиск по id, брать названия и id группы

      return [{ label: 'Модификаторов', value: cartItem?.modifiers?.length }]
    }

    return []
  })

  return {
    renderProduct,
    productPrice,
    productModifiers,
  }
}
