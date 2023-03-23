export interface IUser {
  id: number
  balance: number
  username: string
  code: string
  user_code: string
  name: string | null
  email: string | null
  birthday: string | null
  is_promo_agreement: boolean
  promo_confirmed: boolean
  sms_sub: boolean
  update_promo: boolean
}
