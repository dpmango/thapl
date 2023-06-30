/* eslint-disable no-use-before-define */
import { IContentDataDto } from '~/interface/Dto/Page.dto'

export interface IRestaurantDto {
  id: number
  title: string | null
  working_hours: string
  lng: number
  lat: number
  address: string
  phone: string
  tags: IRestaurantTag[]
}

export interface IRestaurantTag {
  id: number
  sort: number
  tag: string
  bg_color: string
  text_color: string
  slug: string
}

export interface IRestaurantPageDto extends IRestaurantDto {
  image: string | null
  content_data: IContentDataDto | null
}
