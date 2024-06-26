/* eslint-disable no-useless-escape */

export const clearString = (v: any, removeSpaces?: boolean) => {
  let value = ''
  if (typeof v === 'string') {
    value = v.trim()
  } else if (typeof v === 'number') {
    value = `${v}`
  }

  if (removeSpaces) {
    value = value.replaceAll(' ', '').replaceAll('-', '')
  }

  return value
}

export const isValidNumber = (v: any) => {
  return Number.isFinite(+v)
}

export const clearPhone = (str: string) => {
  let num = str.replace(/\+7 \(/, '')
  num = num.replace(/\) /, '')
  num = num.replace(/-/, '')
  num = num.replace(/-/, '')

  return num
}

export const validPhone = (value: string | null) => {
  value = value || ''
  let valid = true
  const arr = [] as string[]
  const num = clearPhone(value)

  if (num.length !== 10) {
    valid = false
    arr.push('Номер телефона должен состоять из 10 цифр.')
  }

  if (![3, 4, 5, 6, 8, 9].includes(+num[0] * 1)) {
    valid = false
    arr.push('Проверьте код оператора или региона.')
  }

  return {
    valid,
    phone_error_text: arr.join(' '),
  }
}

export const validEmail = (v: string | null) => {
  const value = clearString(v)

  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return reg.test(value)
}

export const validAdress = (v: string | null) => {
  const value = clearString(v)

  return value.split(' ').length >= 2 && /\d+/.test(value)
}

export function validDate(value: string | null, dateNow?: string | Date) {
  value = value || ''
  const djsObj = djs(value, 'DD/MM/YYYY', true)

  if (!djsObj.isValid()) return false
  if (djsObj.year() < 1920) return false
  if (djsObj.isAfter(djs(dateNow))) return false

  return true
}

export const dateMask = {
  mask: 'D#/M#/Y###',
  tokens: {
    D: { pattern: /[0-3]/ },
    M: { pattern: /[0-1]/ },
    Y: { pattern: /[1-2]/ },
  },
}
