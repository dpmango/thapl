import { IUpload } from '../Ui'

/* eslint-disable no-use-before-define */
export interface ISendReviewDto {
  order_id: number
  common_comment: string
  answers: ISendReviewAnswerUpload[]
}

export interface ISendReviewAnswer {
  question_id: number
  user_comment?: string
  is_like: boolean
  answers: number[]
  cart_item_id?: number
  photo_id?: number | string
}

export interface ISendReviewAnswerUpload extends ISendReviewAnswer {
  uploads: IUpload[] | null
}
