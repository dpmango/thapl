import { IProduct } from '~/interface'

export interface IPopularItemsDto {
  id: number
  title: string
  show_after_category_id: number | null
  catalog_items: IProduct[]
}

// stoplists
export interface ICheckStopListDto {
  items: IProduct[]
  modifiers_stop_list: any[]
  stopped_items: number[]
}
