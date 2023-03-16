/* eslint-disable no-use-before-define */

export interface IRegion {
  title: string
  id: number
  domain: string
}
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

export interface IOrganizationBase {
  id: number
  timezone: string
  organization_is_open: boolean
  is_open: boolean

  is_high_load_state: boolean
  working_all_day: boolean
  payment_data: PaymentData | null

  cart_to_courier_settings: number
  stoped_temporary: boolean
}

export interface IOrganizationShared {
  stop_categories: any[]
  modifiers_stop_list: any[]
  stop_list: any[]

  time_slot_lag: number
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

// list of organizations (i.e. for takeaway list)
// TODO проверить что приходит в запросе по id орагнизиации и общему списку
export interface IOrganizationTakeaway extends IOrganizationBase, IOrganizationShared {
  title: string
  lat: number
  lng: number
  phone: string
  address: string
  working_hours: string
}

export interface IOrganization extends IOrganizationBase, IOrganizationShared {}

// localStorage stored data
export interface IUserAddress {
  latitude: number
  longitude: number
  name: string
  description: string
  fullText: string
}

export interface ICurrentAddress {
  type: 'takeaway' | 'delivery'
  name: string
  org_id: number
  latitude?: number
  longitude?: number
}

export interface IRestaurant {
  id: number
  title: string
  working_hours: string
  lng: number
  lat: number
  address: string
  phone: string
  tags: IRestaurantTag[]
}

export interface IRestaurantTag {
  id: number
  sort: number
  tag: string
  bg_color: string
  text_color: string
  slug: string
}