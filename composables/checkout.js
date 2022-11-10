import { storeToRefs } from 'pinia'
import { useCartStore, useDeliveryStore } from '~/store'

export const useCheckout = () => {
  const deliveryStore = useDeliveryStore()
  const cartStore = useCartStore()
  const { currentAddressType, zone, minOrderPrice } = storeToRefs(deliveryStore)
  const { cartPrice } = storeToRefs(cartStore)

  // хелперы по методу доставки / самовывоз
  const zoneData = computed(() => {
    const isDelivery = currentAddressType?.value === 'delivery'
    const isTakeaway = currentAddressType?.value === 'takeaway'

    let orderType = null
    if (isTakeaway) orderType = 10
    if (isDelivery) orderType = 20

    return {
      isDelivery,
      isTakeaway,
      hasZone: !!Object.keys(zone.value).length,
      isOpen: zone.value?.is_open,
      orderType,
    }
  })

  // калькуляции различных состояний цены (с доставкой, со скидками и т.д)
  const priceData = computed(() => {
    const deliverySum = freeDeliveryData.value.match ? 0 : zone.value.delivery_price
    const withDelivery = cartPrice.value + deliverySum

    return {
      pureProducts: cartPrice.value,
      delivery: deliverySum,
      withDelivery,
      totalToPay: withDelivery + 0 + 0,
    }
  })

  // логика минимальный заказ
  const minOrderData = computed(() => {
    if (zoneData.value.isDelivery) {
      const leftToMinOrder = minOrderPrice.value - cartPrice.value

      return {
        remained: leftToMinOrder,
        match: leftToMinOrder <= 0,
      }
    }

    return {
      remained: 0,
      match: true,
    }
  })

  // логика бесплатная доставка
  const freeDeliveryData = computed(() => {
    if (zoneData.value.isDelivery && zoneData.value.hasZone) {
      const leftToFreeDelivery = zone.value.free_delivery_min_price - cartPrice.value
      const freeDeliveryProgress = Math.round(
        (cartPrice.value / zone.value.free_delivery_min_price) * 100
      )

      return {
        remained: leftToFreeDelivery,
        progress: freeDeliveryProgress,
        show: zone.value.free_delivery_min_price > 0,
        match: leftToFreeDelivery <= 0,
      }
    }

    return {
      remained: 0,
      progress: 0,
      show: false,
      match: true,
    }
  })

  return {
    zoneData,
    priceData,
    minOrderData,
    freeDeliveryData,
  }
}
