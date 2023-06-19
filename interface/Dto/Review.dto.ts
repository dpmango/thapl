/* eslint-disable no-use-before-define */
import { IOrder } from '~/interface/Order'

export interface IReviewQuestionnaire {
  order: IOrder
  default_question: IQuestion
  items_questionary: IQuestion[]
  additional_questions: IQuestion[]
}

export interface IQuestion {
  id: number
  question: string
  has_comment: boolean
  max_answers: boolean | number | null
  answers: IAnswer[]
  cart_id: string | null
}

export interface IAnswer {
  id: number
  title: string
}
