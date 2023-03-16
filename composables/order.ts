import { useToast } from 'vue-toastification/dist/index.mjs'
import { IPaymentDataDto, IOrderCart } from '~/interface/Order'
import { openExternalLink } from '#imports'
import { useCartStore, useProfileStore, useUiStore } from '~/store'

export const useOrder = ({ orderID, cart }: { orderID: number; cart: IOrderCart[] }) => {
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
        ids: [orderID],
      },
    }).catch((err) => useCatchError(err, 'Ошибка. Обратитесь к администратору'))

    await profileStore.getOrders()
  }

  // оплатить заказ
  const handlePay = async () => {
    const paymentData = (await useApi('order/get-payment-data', {
      method: 'POST',
      headers: useHeaders(),
      params: {
        id: orderID,
      },
    }).catch((err) =>
      useCatchError(err, 'Ошибка платежного шлюза. Обратитесь к администратору')
    )) as IPaymentDataDto

    if (paymentData.link) {
      openExternalLink(paymentData.link)
    } else if (paymentData.success) {
      toast.success('Заказ Оплачен')
    }
  }

  // оценить заказ - модальное
  const handleRate = () => {
    ui.setModal({ name: 'review', params: { id: orderID } })
  }

  // TODO показать курьера на карте
  const handleDelivery = () => {
    // console.log('TODO')
  }

  // повтор заказа - добавить к корзину
  // TODO - проверить проверку на существующие товары и стоплисты
  const handleRepeat = () => {
    cartStore.resetCart()

    cart.forEach((x) => {
      cartStore.addToCart(x.catalog_item, x.cartItem.count, [])
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