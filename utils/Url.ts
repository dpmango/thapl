export const removeUrlParameter = (value: string, key: string) => {
  const regParameter = new RegExp('[?|&]' + key + '=([^&]+)')
  if (regParameter.test(value)) {
    value = value.replace(regParameter, '')
  }

  return value
}

export const clearSocialLink = (v: string | null) => {
  if (!v) return ''

  let result = v
    .replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .replace('t.me/', '@')
    .replace('instagram.com/', '@')
    .replace('facebook.com/', '@')
    .replace('vk.com/', '@')
    .replace('whatsapp://send?phone=', '')
    .replaceAll('/', '')

  result = removeUrlParameter(result, 'text')

  return result
}

export const openExternalLink = (url: string) => {
  if (window.opener == null) {
    window.location.href = url
  } else {
    window.open(url)
  }
}

export const buildLink = (v: string | null) => {
  if (!v) return ''

  if (v.includes('http:') || v.includes('https:')) {
    return v
  }

  const [link, hasLinkLike] = v.split('//')

  if (!hasLinkLike) {
    return `https://${link}`
  }

  return ''
}
