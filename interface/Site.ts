import { ILoyalty } from './Loyalty'
import { IUser } from './User'

export interface IPage {
  seo_title: null
  seo_description: null
  title: null
  content_data: null
}

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
  additional_logo: null
  region_id: number
  default_work_time: string
  page: IPage
}

export interface IAppSettings {
  ask_address_on_first_enter: boolean
  app_store_id: string
  whatsapp: string
  tg: string
  instagram: string
  facebook: null
  default_persons_count: string
  takeaway_enabled: boolean
  order_to_time: boolean
  disable_order: boolean
  default_phone: string
  privacy_link: null
  site_footer_menu: ISiteMenu[]
  site_mobile_menu: ISiteMenu[]
  loyalty: ILoyalty
  site_settings: ISiteSettings
}

export interface IInit {
  api_token: string | null
  user_token?: string | null
  user: IUser | null
  app_settings: IAppSettings
}
