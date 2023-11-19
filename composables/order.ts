import { useToast } from 'vue-toastification/dist/index.mjs'
import { IOrder, IOrderCart } from '~/interface/Order'
import { IOrderPaymentDataDto } from '~/interface/Dto/Order.dto'
import { openExternalLink } from '#imports'
import { useCartStore, useProfileStore, useUiStore } from '~/store'

export const useOrder = ({
  order,
  isLastOrder = false,
}: {
  order: IOrder
  isLastOrder?: boolean
}) => {
  const profileStore = useProfileStore()
  const cartStore = useCartStore()
  const ui = useUiStore()
  const router = useRouter()
  const toast = useToast()

  // отменить заказ
  const handleCancel = async () => {
    await useApi('profile/cancel-order', {
      method: 'POST',
      headers: useHeaders(),
      body: {
        ids: [order.id],
      },
    }).catch((err) => useCatchError(err, 'Ошибка. Обратитесь к администратору'))

    if (!isLastOrder) profileStore.getOrders()
  }

  // оплатить заказ
  const handlePay = async () => {
    const paymentData = (await useApi('order/get-payment-data', {
      method: 'POST',
      headers: useHeaders(),
      params: {
        id: order.id,
      },
    }).catch((err) =>
      useCatchError(err, 'Ошибка платежного шлюза. Обратитесь к администратору')
    )) as IOrderPaymentDataDto

    if (paymentData.link) {
      openExternalLink(paymentData.link)
    } else if (paymentData.success) {
      toast.success('Заказ Оплачен')
    }

    if (!isLastOrder) profileStore.getOrders()
  }

  // оценить заказ - модальное
  const handleRate = () => {
    if (order.user_can_send_review) {
      ui.setModal({ name: 'review', params: { id: order.id } })
    }
  }

  // TODO показать курьера на карте
  const handleDelivery = () => {}

  // повтор заказа - добавить к корзину
  // TODO - проверить проверку на существующие товары и стоплисты
  const handleRepeat = () => {
    cartStore.resetCart()

    order.cart.forEach((x) => {
      cartStore.addToCart(
        x.catalog_item,
        x.cartItem.count,
        x.modifiers.map((mod) => ({
          id: mod.modifier_item.id,
          price: mod.modifier_item.price,
          q: mod.amount,
        })) || []
      )
    })

    router.push('/order')
  }

  return {
    handleDelivery,
    handleCancel,
    handlePay,
    handleRate,
    handleRepeat,
  }
}
