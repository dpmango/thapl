// 1000.00 -> 1 000.00
export const formatPrice = (num, digits, showFree = true) => {
  const trailingZeros = digits !== undefined ? digits : 0

  const spacesRegex = /\B(?=(\d{3})+(?!\d))/g
  let value = ''
  if (num === null || num === undefined) {
    return '0.00'
  }

  if (typeof num === 'number') {
    value = num.toFixed(trailingZeros).replace(spacesRegex, ' ')
  } else if (typeof num === 'string') {
    value = parseFloat(num).toFixed(trailingZeros).replace(spacesRegex, ' ')
  }

  if (+value === 0) {
    if (showFree) {
      return 'Бесплатно'
    } else {
      return '0 ₽'
    }
  }

  return `${value} ₽`
}

export const Plurize = (number, one, two, five) => {
  let n = Math.abs(number)
  n %= 100
  if (n >= 5 && n <= 20) {
    return five
  }
  n %= 10
  if (n === 1) {
    return one
  }
  if (n >= 2 && n <= 4) {
    return two
  }
  return five
}
