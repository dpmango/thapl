/* eslint-disable quotes */

export const formatUGC = (txt) => {
  return txt.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '')
}

export function prepareSmartSearchRegexp(str) {
  const strings = str.match(/"[^"]+"|[^ ]+/g) || ['']

  const regexPattern =
    '^(?=.*?(^|\\s)' +
    strings
      .map((e) => {
        if (e.charAt(0) === '"') {
          const f = e.match(/^"(.*)"$/)
          e = f ? f[1] : e
        }
        return escapeRegExp(e.replace('"', '').replace('(', '').replace(')', ''))
      })
      .join(')(?=.*?(^|\\s)') +
    ').*$'
  return regexPattern
}

export function clearMorphologyInSearchTerm(searchTerm) {
  const trimmedSearchTerm = searchTerm
    .replaceAll('\n', ' ')
    .replaceAll('\r', ' ')
    .replaceAll('\t', ' ')
    .replaceAll("'", ' ')
    .replaceAll('"', ' ')
    .replaceAll('`', ' ')
    .trim()
  let blocks = trimmedSearchTerm.split(' ')
  ;['ые', 'ый', 'ая', 'ами', 'ой', 'ем', 'ие', 'ий', 'ой', 'иеся', 'ийся', 'аяся'].forEach((ch) => {
    blocks = blocks.map((b) => {
      return b.length >= 6 ? trimRightChars(b, ch) : b
    })
  })
  const joined = blocks.join(' ')
  return joined
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function trimRightChars(str, chars) {
  return str.replace(new RegExp(`${chars}$`, 'g'), '')
}
