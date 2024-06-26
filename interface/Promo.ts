/* eslint-disable no-use-before-define */
import { IProduct } from '~/interface/Product'
import { IContentDataDto } from '~/interface/Dto/Page.dto'

export interface IPromoListDto {
  id: number
  title: string
  slug: string
  description_short: string
  image: string
  code: string | null
  created_at: string
  finish_on: string | null
  start_on: string | null
  view_type: number
}

export interface IPromoPageDto {
  id: number
  title: string
  description: string | null
  image: string | null
  content_data: IContentDataDto | null
  action:
    | 'open_link'
    | 'open_category'
    | 'open_item'
    | 'open_balance'
    | 'open_conception'
    | 'copy_promo_code'
    | null
  action_button_color: string | null
  action_data: IPromoActionData | null
  action_title: string | null
  code: string | null

  gifts: IProduct[]
  stories_data: IStoriesDto[] | null
}

export interface IPromoActionData {
  url?: string
  item_id: number
  slug?: string
  code?: string
}

export interface IStoriesDto {
  background_image: string | null
  text: string | null
  text_color: string | null
  text_background_color: string | null
  text_horizontal_alignment: string | null
  text_vertical_alignment: string | null
  header: string | null
  header_text_color: string | null
  header_background_color: string | null
  header_horizontal_alignment: string | null
  header_vertical_alignment: string | null
  button_text: string | null
  button_background_color: string | null
  button_text_color: string | null
  button_horizontal_alignment: string | null
  button_vertical_alignment: string | null
  action:
    | 'open_link'
    | 'open_category'
    | 'open_item'
    | 'open_balance'
    | 'open_conception'
    | 'copy_promo_code'
    | null
  action_data: IPromoActionData
}
