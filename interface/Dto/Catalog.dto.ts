import { IProduct } from '~/interface/Product'

export interface IPopularItemsDto {
  id: number
  title: string
  show_after_category_id: number | null
  catalog_items: IProduct[]
}
