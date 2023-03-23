export interface IOrderCreateDto {
  order_id: number
  error_reason: number | null
  suceess: boolean
  error_text: string | null
  error_field: string | null
  stoped_items: any[]
  stoped_modifiers: any[]
  analytics_events: any[]
}

export interface IOrderPaymentDataDto {
  success: boolean
  type: any | null
  link: string | null
  receipt: string | null
  payment_sum: number | null
}

export interface ICartGetPackingDto {
  compact_pack: number
  free_pack: number
  separate_pack: number
}
