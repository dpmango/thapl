import { storeToRefs } from 'pinia'
import { useCartStore, useDeliveryStore } from '~/store'
import { timestampToMinutes, Plurize } from '#imports'

export const useCheckout = () => {
  const { $env, $log } = useNuxtApp()

  const deliveryStore = useDeliveryStore()
  const cartStore = useCartStore()
  const { currentOrderType, currentAddressType, zone, takeawayOrganization, minOrderPrice } =
    storeToRefs(deliveryStore)
  const { cartPrice, cart, cartStoped, promo, products } = storeToRefs(cartStore)

  // хелперы по методу доставки / самовывоз
  const zoneData = computed(() => {
    const isDelivery = currentAddressType?.value === 'delivery'
    const isTakeaway = currentAddressType?.value === 'takeaway'

    return {
      isDelivery,
      isTakeaway,
      hasZone: !!Object.keys(zone.value).length,
      isOpen: zone.value?.is_open,
      orderType: currentOrderType.value,
      organization: isDelivery ? zone.value?.organization : takeawayOrganization.value,
      timeFrom: timestampToMinutes(zone.value?.time_from),
      timeTo: timestampToMinutes(zone.value?.time_to),
    }
  })

  // калькуляции различных состояний цены (с доставкой, со скидками и т.д)
  const priceData = computed(() => {
    const deliverySum = freeDeliveryData.value.match ? 0 : zone.value.delivery_price || 0
    const withDelivery = cartPrice.value + deliverySum
    const promoSum = promo.value?.discount_sum || 0
    const pointsSum = 0

    // - сумма примененных бонусов
    // + упаковка

    return {
      pureProducts: cartPrice.value,
      delivery: deliverySum,
      withDelivery,
      promoDiscount: promoSum,
      pointsDiscount: pointsSum,
      totalDiscount: promoSum + pointsSum,
      totalToPay: withDelivery - promoSum - pointsSum,
    }
  })

  // логика минимальный заказ
  const minOrderData = computed(() => {
    if (zoneData.value.isDelivery) {
      const leftToMinOrder = (minOrderPrice.value || 0) - cartPrice.value

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

  // логика промо
  const promoData = computed(() => {
    const hasPromo = promo.value?.has_promo

    const verboseGifts = computed(() => {
      // todo в будующем возможнен выбор нескольких подарков
      const count = 1 || promo.value?.gifts?.length
      return `${count} ${Plurize(count, 'подарок', 'подарка', 'подарков')}`
    })

    return {
      hasPromo,
      isOnePlusOne: promo.value?.discount_type === 7,
      discountSum: promo.value?.discount_sum,
      giftCount: promo.value?.gifts?.length,
      gifts: promo.value?.gifts || [],
      verboseGifts: verboseGifts.value,
    }
  })

  // логика стоплисты
  const stopListData = computed(() => {
    const orgStopList = zoneData.value.organization?.stop_list || []
    const cartIds = cart.value.map((x) => x.id)
    const stopped = cartIds.filter((x) => orgStopList.includes(x))

    const hasCheckStops =
      cartStoped.value.length > 0 || products.value.some((x) => x.only_pre_order)
    const cartBlocked = hasCheckStops && +$env.stopListType === 1

    return {
      all: orgStopList,
      hasStops: stopped.length,
      stopped,
      hasCheckStops,
      cartBlocked,
    }
  })

  // логика слоты
  const slotsData = computed(() => {
    const organization = zoneData.value.organization || {}

    const slotKey = zoneData.value.isDelivery
      ? 'default_delivery_time_slots'
      : 'default_takeaway_time_slots'
    const restrictionsKey = zoneData.value.isDelivery
      ? 'delivery_dates_restrictions'
      : 'takeaway_dates_restrictions'

    const slots = organization[slotKey] || []
    const restrictions = organization[restrictionsKey] || []

    return {
      hasSlots: !!organization[slotKey],
      slots,
      restrictions,
    }
  })

  return {
    zoneData,
    priceData,
    minOrderData,
    freeDeliveryData,
    promoData,
    stopListData,
    slotsData,
  }
}