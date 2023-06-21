import { ILoyalty } from './Loyalty'
import { IUser } from './User'
import { IPageUniversalDto } from '~/interface/Dto/Page.dto'

export interface ISiteMenu {
  id: number
  title: string
  type: number
  target_url?: string
  target_id?: string
  target_slug?: string
}

export interface ISiteSettings {
  main_logo: string
  // additional_logo: string | null
  region_id: number
  default_work_time: string
  page: IPageUniversalDto
}

export interface IAppSettings {
  ask_address_on_first_enter: boolean
  app_store_id: string
  app_store_link: string
  play_store_link: string
  whatsapp: string | null
  tg: string | null
  instagram: string | null
  facebook: string | null
  show_persons: boolean
  default_persons_count: string
  takeaway_enabled: boolean
  order_to_time: boolean
  order_to_time_enabled: boolean
  disable_order: boolean
  default_phone: string
  privacy_link: string | null
  site_footer_menu: ISiteMenu[]
  site_mobile_menu: ISiteMenu[]
  order_disable_cache: boolean
  order_cart_to_courier: boolean
  loyalty: ILoyalty
  site_settings: ISiteSettings
}

export interface IInit {
  api_token: string | null
  user_token?: string | null
  user: IUser | null
  app_settings: IAppSettings
}
