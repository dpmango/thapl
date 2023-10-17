import { IProduct, IModifierItem } from '~/interface/Product'
import { formatPrice } from '#imports'

export const useProductHelpers = ({ product }: { product: IProduct }) => {
  const productPriceLabel = computed(() => {
    if (!product) return formatPrice(0)

    let postfix = ''
    let price = product.price
    if (product.sale_by_weight) {
      const minWeight = product.min_weight || 100

      price = product.price * (minWeight / 1000)
      postfix = ` / ${minWeight} г`
    }

    return formatPrice(price) + postfix
  })

  return {
    productPriceLabel,
  }
}
