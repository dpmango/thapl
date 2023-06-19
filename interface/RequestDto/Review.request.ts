/* eslint-disable no-use-before-define */
export interface ISendReviewDto {
  order_id: number
  common_comment: string
  answers: ISendReviewAnswer[]
}

export interface ISendReviewAnswer {
  question_id: number
  user_comment?: string
  is_like: boolean
  answers: number[]
  cart_item_id?: number
  photo_id?: number
}
