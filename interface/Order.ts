/* eslint-disable no-use-before-define */
import { IProduct } from './Product'

export interface IOrder {
  id: number
  address: string
  can_be_canceled: boolean
  can_be_payed?: boolean
  can_show_courier_location: boolean
  user_can_send_review: boolean
  time_to_delivery: number | null
  status: number
  created_at: Date
  payment_sum: number
  delivery_sum: number | null
  discount_sum: number
  packing_sum: number
  order_sum: number
  gift: any[]
  cart: IOrderCart[]
}

export interface IOrderCart {
  catalog_item: IProduct
  amount: number
  modifiers: IOrderCartModifier[]
  cartItem: ICartItem
}

export interface ICartItem {
  id: number
  cart_id: number
  catalog_item_id: number
  count: number
  created_at: Date
  updated_at: Date
  tech_data: any | null
}

export interface IOrderCartModifier {
  modifier_item: {
    id: number
    title: string
    price: number
  }
  amount: number
  cartItemModifier: IOrderCartItemModifier
}

export interface IOrderCartItemModifier {
  cart_item_id: number
  modificator_id: number
  count: number
  created_at: Date
  updated_at: Date
}
