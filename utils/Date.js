import { Plurize } from '~/utils'

export const pad = (v, size = 2) => {
  let s = String(v)
  while (s.length < size) {
    s = '0' + s
  }
  return s
}

export const formatMinutes = (v) => {
  const min = +v

  const hours = Math.floor(min / 60)
  const hh = hours ? `${hours} ${Plurize(hours, 'час', 'часа', 'часов')} ` : ''
  const mm = `${min - hours * 60} минут`

  return `${hh}${mm}`
}

export const secondsToStamp = (sec) => {
  const minutes = pad(Math.floor(sec / 60))
  const seconds = pad(sec % 60)

  return `${minutes}:${seconds}`
}
