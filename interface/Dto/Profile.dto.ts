export interface IProfileAddressesDto {
  id: number
  apt: string | null
  entrance: string | null
  floor: string | null
  door_code: string | null
  user_comment: string | null
}

export interface IProfileAddressDeleteDto {
  success: boolean
}
