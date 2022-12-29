import { IProduct } from './Product'

export interface ILoyalty {
  enabled: boolean
  combine_promo_and_bonus: boolean
  base_points_accrual_write_off: number
  base_points_accrual: null
  has_qr: boolean
  points_for_review: number
  points_for_review_text: string
  conditions_text: string
  ref_program_enabled: null
  ref_program_message: string
  ref_program_title: string
  ref_program_text: string
  REF_POINTS_NUM: number
  REF_POINTS_NUM_FOR_INVITE: null
  REF_MIN_ORDER: null
}

export interface IPromoDto {
  available_points: number
  discount_sum: number | null
  discount_type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null
  error_text: string | null
  error_type: number
  gifts: IProduct[]
  has_promo: boolean
  // next_promo_sum: null
  // next_promo_text: null
  // not_affects_on_minimal_order: boolean
  // one_plus_one: any[]
  promo_coupon_id: null
  promo_id: number | null
}
