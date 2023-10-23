import { Ref } from 'vue'
import { IProduct, IModifierItem } from '~/interface/Product'
import { formatPrice } from '#imports'
import { ICartModifier } from 'interface'

interface IModifierItemGrouped extends ICartModifier {
  groupID: number
}

export const useProductHelpers = ({
  product,
  modifierGroups,
}: {
  product: Ref<IProduct | null>
  modifierGroups?: Ref<IModifierItemGrouped[]>
}) => {
  const productPriceLabel = computed(() => {
    if (!product.value) return formatPrice(0)

    let postfix = ''
    let price = product.value.price
    if (product.value.sale_by_weight) {
      const minWeight = product.value.min_weight || 100

      price = product.value.price * (minWeight / 1000)
      postfix = ` / ${minWeight} г`
    }

    if (modifierGroups?.value.length) {
      modifierGroups.value.forEach((x) => {
        price += x.price
      })
    }

    return formatPrice(price) + postfix
  })

  return {
    productPriceLabel,
  }
}
