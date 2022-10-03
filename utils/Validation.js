export function clearPhone(str) {
  let num = str.replace(/\+7 \(/, '')
  num = num.replace(/\) /, '')
  num = num.replace(/-/, '')
  num = num.replace(/-/, '')

  return num
}

export function validPhone(value) {
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

export function validEmail(value) {
  value = value || ''
  let valid = true
  const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/

  if (!value || value.length < 1 || reg.test(value) === false) {
    valid = false
  }

  return valid
}
