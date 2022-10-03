export const removeUrlParameter = (value, key) => {
  const regParameter = new RegExp('[?|&]' + key + '=([^&]+)')
  if (regParameter.test(value)) {
    value = value.replace(regParameter, '')
  }

  return value
}

export const clearSocialLink = (v) => {
  if (!v) return ''

  let result = v
    .replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .replace('t.me/', '@')
    .replace('instagram.com/', '@')
    .replace('whatsapp://send?phone=', '')
    .replace('/', '')

  result = removeUrlParameter(result, 'text')

  return result
}
