/* eslint-disable no-use-before-define */
import { IOrder } from '~/interface/Order'
import { IProduct } from '~/interface/Product'

export interface IReviewQuestionnaire {
  additional_questions: IQuestion[]
  default_question: IQuestion
  order: IOrder
  items_questionary: IQuestion[]
}

export interface IQuestion {
  id: number
  question: string
  has_comment: boolean
  max_answers: boolean | number | null
  answers: IAnswer[]
  cart_id: string | null
  catalog_item?: IProduct
}

export interface IAnswer {
  id: number
  title: string
}
