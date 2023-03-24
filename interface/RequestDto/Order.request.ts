export interface IOrderRequestDto {
  name: string
  phone: string
  order_type: number
  address: string
  lat: number
  lng: number
  payment_method: number
  comment: string

  cart: {
    catalog_item_id: number
    count: number
    modifiers: {
      catolog_item_modifier_id: number
      count: number
    }[]
  }[]

  date?: string
  entrance?: string
  floor?: string
  apt?: string
  intercom?: string
  pack?: string
  persons_count?: string
  not_call?: boolean
  not_heat?: boolean
  change?: string
  email?: string
  promo_id?: number
  promo_code?: string
  points?: string
  gift_id?: number
}
