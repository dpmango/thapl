/* eslint-disable no-use-before-define */

// универсальная контентная (page/get-data)
export interface IPageUniversalDto {
  seo_title: string | null
  seo_description: string | null
  title: string | null
  content_data: IContentDataDto | null
}

// страница контактов
export interface IPageContactsDto {
  phone: string | null
  email: boolean
  facebook: string | null
  instagram: string | null
  telegram: string | null
  vk: string | null
  wu: string | null
  restaurants_count: number
}

// визуальный редактор (content_data.blocks)
export interface IContentDataDto {
  time: number
  blocks: IContentBlockDto[]
  version: string
}

export interface IContentBlockDto {
  id: string
  data: IContentBlockDataDto
  type: string
}

export interface IContentBlockDataDto {
  text: string
  level?: number
  items?: string[]
  caption?: string
  style?: string | any
  html?: string | any
  code?: string | any
  file?: any
}
