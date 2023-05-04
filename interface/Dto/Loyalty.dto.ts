import { IContentDataDto } from '~/interface/Dto/Page.dto'

export interface ILoyaltyPageDto {
  title: string

  conditions_text: string
  loyalty_groups: any[]
  points_accrual: number
  points_write_off: number
  ref_program_enabled: boolean
  ref_program_message: string | null
  ref_program_text: string | null
  referral_conditions: string | null
  rules_conditions: IContentDataDto | null
  seo_data: string | null
  transactions: string | null
  user_code: string | null
  user_group: string | null
}
