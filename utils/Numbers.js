/* eslint-disable no-plusplus */
// 1000.00 -> 1 000.00
export const formatPrice = (num, digits) => {
  const trailingZeros = digits !== undefined ? digits : 0

  const spacesRegex = /\B(?=(\d{3})+(?!\d))/g
  if (num === null || num === undefined) {
    return '0.00'
  }

  if (typeof num === 'number') {
    return num.toFixed(trailingZeros).replace(spacesRegex, ' ')
  }

  if (typeof num === 'string') {
    return parseFloat(num).toFixed(trailingZeros).replace(spacesRegex, ' ')
  }

  return ''
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
