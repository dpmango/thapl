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
    current_group: ILoayltyUserGroup
    next_group: ILoayltyUserGroup
    sum_to_hold_group: number | null
    sum_to_next_group: number | null
    date_to_next_group: string | null
    date_to_hold_group: string | null
  } | null
  transactions: ILoyaltyUserTransaction[] | null
  loyalty_groups: ILoyaltyGroup[]
  seo_data: ISeoData | null
  user_balance_data?: {
    balance: number | null
    burn_out_balance: number | null
    burn_out_balance_date: number | null
  }
}

export interface ILoyaltyGroup {
  id: number
  type: number
  order_to_earn: number
  points_accrual: number
  points_write_off: number
  title: string
}

export interface ILoayltyUserGroup
  extends Omit<ILoyaltyGroup, 'points_accrual' | 'points_write_off'> {
  base_points_accrual: number
  base_points_write_off: number
}

export interface ILoyaltyUserTransaction {
  date: string
  value: number
  descriprion: string
}
