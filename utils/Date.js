import { Plurize } from '~/utils'

export const formatMinutes = (v) => {
  const min = +v

  const hours = Math.floor(min / 60)
  const hh = hours ? `${hours} ${Plurize(hours, 'час', 'часа', 'часов')} ` : ''
  const mm = `${min - hours * 60} минут`

  return `${hh}${mm}`
}
