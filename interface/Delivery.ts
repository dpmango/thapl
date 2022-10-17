/* eslint-disable no-use-before-define */
export interface IZone {
  found: boolean
  is_open: boolean
  working_all_day: boolean
  organization: Organization
  disable_cash_payment: boolean
  disable_courier_card_payment: boolean
  disable_online_payment: boolean
  min_order: number
  free_delivery_min_price: number
  delivery_price: number
  max_time: string
  base_max_time: string
  time_from: null
  time_to: null
  working_time_text: null
}

export interface Organization {
  id: number
  is_high_load_state: boolean
  working_all_day: boolean
  payment_data: PaymentData
  stop_categories: any[]
  modifiers_stop_list: any[]
  stop_list: number[]
  cart_to_courier_settings: number
  stoped_temporary: boolean
  organization_is_open: boolean
  is_open: boolean
}

export interface PaymentData {
  user: string
  password: string
  key: string
  hold_enabled: boolean
  need_email: boolean
  card_payment_type_provider: number
  payment_id: number
  ios_merchant_id: string
}

export interface IUserAddress {
  latitude: number
  longitude: number
  name: string
  description: string
  fullText: string
}
