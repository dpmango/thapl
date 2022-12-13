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
  only_pre_order: boolean
  preorder_delay: number
  min_weight: null
  max_weight: null
  weight_step: null
  old_price: null | string
  price: number
  description: string
  can_be_payed_by_bonus_fully: boolean
  packing_weights: string
  is_healthy: boolean
  is_high_temperature: boolean
  is_low_energy: boolean
  tags: any[]
  open_item_page_to_add: boolean
  modifier_groups: null
  image: null | string
}

export interface IGift {
  catalog_item: IProduct
  count: number
}

export interface ICategory {
  id: number
  title: string
  image: null
  slug: string
}

export interface ICategoryFull extends ICategory {
  catalog_items: IProduct[]
  seo_data: null
  sub_categories: ICategoryFull[]
}
