export interface IOrderCreateDto {
  order_id: number
  error_reason: null
  suceess: boolean
  error_text: null
  error_field: null
  stoped_items: any[]
  stoped_modifiers: any[]
  analytics_events: any[]
}

export interface IOrderPaymentDataDto {
  success: boolean
  type: null
  link: string | null
  receipt: null
  payment_sum: null
}

export interface ICartGetPackingDto {
  compact_pack: number
  free_pack: number
  separate_pack: number
}
