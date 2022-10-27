import { storeToRefs } from 'pinia'
import { useCartStore, useDeliveryStore } from '~/store'

export const useCheckout = () => {
  const deliveryStore = useDeliveryStore()
  const cartStore = useCartStore()
  const { currentAddressType, zone, minOrderPrice } = storeToRefs(deliveryStore)
  const { cartPrice } = storeToRefs(cartStore)

  // хелперы по методу доставки / самовывоз
  const zoneData = computed(() => {
    return {
      isDelivery: currentAddressType?.value === 'delivery',
      isTakeaway: currentAddressType?.value === 'takeaway',
      hasZone: Object.keys(zone).length,
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
