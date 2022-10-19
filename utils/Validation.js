/* eslint-disable no-useless-escape */
export const clearString = (v, removeSpaces) => {
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

export const isValidNumber = (v) => {
  return Number.isFinite(+v)
}

export const clearPhone = (str) => {
  let num = str.replace(/\+7 \(/, '')
  num = num.replace(/\) /, '')
  num = num.replace(/-/, '')
  num = num.replace(/-/, '')

  return num
}

export const validPhone = (value) => {
  value = value || ''
  let valid = true
  const arr = []
  const num = clearPhone(value)

  if (num.length !== 10) {
    valid = false
    arr.push('Номер телефона должен состоять из 10 цифр.')
  }

  if (![3, 4, 5, 6, 8, 9].includes(num[0] * 1)) {
    valid = false
    arr.push('Проверьте код оператора или региона.')
  }

  return {
    valid,
    phone_error_text: arr.join(' '),
  }
}

export const validEmail = (v) => {
  const value = clearString(v)

  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return reg.test(value)
}

export const validAdress = (v) => {
  const value = clearString(v)

  return value.split(' ').length >= 2 && /\d+/.test(value)
}
