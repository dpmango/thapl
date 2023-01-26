/* eslint-disable no-use-before-define */
export interface ICartInner {
  id: number
  q: number
  modifiers?: ICartModifier[]
}

export interface ICardModifierInner {
  id: number
  price: number
  groupID: number
  title: string
}

export interface ICartModifier {
  id: number
  price: number
  q: number
}
