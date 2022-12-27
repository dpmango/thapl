/* eslint-disable no-use-before-define */
export interface IZone {
  found: boolean
  is_open: boolean
  working_all_day: boolean
  organization: IOrganization
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

// list of organizations (i.e. for takeaway list)
export interface IOrganizationTakeaway {
  id: number
  title: string
  lat: number
  lng: number
  phone: string
  address: string
  working_hours: string
}

export interface IOrganization {
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
  max_preorder_days: number
  min_preorder_days: number
  min_takeaway_gap: number
  default_delivery_time_slots: any[]
  default_takeaway_time_slots: any[]
  delivery_dates_restrictions: any[]
  takeaway_dates_restrictions: any[]
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

// localStorage stored data
export interface IUserAddress {
  latitude: number
  longitude: number
  name: string
  description: string
  fullText: string
}
