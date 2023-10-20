import { Ref } from 'vue'
import { IProduct, IModifierItem } from '~/interface/Product'
import { formatPrice } from '#imports'

export const useProductHelpers = ({ product }: { product: Ref<IProduct | null> }) => {
  const productPriceLabel = computed(() => {
    if (!product.value) return formatPrice(0)

    let postfix = ''
    let price = product.value.price
    if (product.value.sale_by_weight) {
      const minWeight = product.value.min_weight || 100

      price = product.value.price * (minWeight / 1000)
      postfix = ` / ${minWeight} г`
    }

    return formatPrice(price) + postfix
  })

  return {
    productPriceLabel,
  }
}
