/* eslint-disable no-use-before-define */
import { IContentDataDto } from '~/interface/Dto/Page.dto'
import { ISeoData } from '~/interface/Site'

export interface ILoyaltyPageDto {
  title: string
  conditions_text: string
  rules_conditions: IContentDataDto | null
  points_accrual: number
  points_write_off: number
  ref_program_enabled: boolean
  ref_program_message: string | null
  ref_program_text: string | null
  referral_conditions: IContentDataDto | null
  user_code: string | null
  user_group: {
    current_group: ILoyaltyUserGroup
    next_group: ILoyaltyUserGroup
    sum_to_hold_group: number
    sum_to_next_group: number
    date_to_next_group: string
    date_to_hold_group: string
  } | null
  transactions: ILoyaltyUserTransaction[] | null
  loyalty_groups: ILoyaltyUserGroup[]
  seo_data: ISeoData | null
}

export interface ILoyaltyUserGroup {
  id: number
  type: number
  order_to_earn: number
  points_accrual: number
  points_write_off: number
  title: string
}

export interface ILoyaltyUserTransaction {
  date: string
  value: number
  descriprion: string
}
