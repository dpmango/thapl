/* eslint-disable no-use-before-define */
export interface IProduct {
  id: number
  title: string
  slug: string
  is_best: boolean
  is_hot: boolean
  is_vegan: boolean
  is_new: boolean | null
  is_sale: boolean
  without_bonus: boolean
  sale_by_weight: boolean
  fiber_full_amount: string
  fat_full_amount: string
  carbohydrate_full_amount: string
  energy_full_amount: string
  fiber_amount: string
  fat_amount: string
  carbohydrate_amount: string
  energy_amount: string
  only_pre_order: boolean
  preorder_delay: number
  min_weight: string | null
  max_weight: string | null
  weight_step: string | null
  old_price: string | null
  price: number
  description: string
  can_be_payed_by_bonus_fully: boolean
  packing_weights: string
  is_healthy: boolean
  is_high_temperature: boolean
  is_low_energy: boolean
  tags: any[]
  open_item_page_to_add: boolean
  modifier_groups: IModifierGroup[] | null
  image: string | null
}

export interface IProductFullDto extends IProduct {
  children: IProduct[] | null
  variants: IProductVariant[] | null
  options: IProductOption[] | null
  tech_data: null
}

export interface IProductOption {
  id: string
  catalog_item_id: string
}

export interface IProductVariant {
  title: string
  variants: {
    id: number
    title: string
  }[]
}

export interface IModifierGroup {
  title: string
  max_items: number
  min_items: number
  items: IModifierItem[]
}

export interface IModifierItem {
  id: number
  title: string
  price: number
}

export interface IAdditive {
  catalog_item: IProduct
  count: number
}

export interface ICategory {
  id: number
  title: string
  image: string | null
  slug: string
  image_view_type: number
}

export interface ICategoryFull extends ICategory {
  catalog_items: IProduct[]
  seo_data: any
  sub_categories: ICategoryFull[]
}
