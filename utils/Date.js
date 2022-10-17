export const formatMinutes = (v) => {
  const min = +v

  const hours = Math.floor(min / 60)
  const hh = hours ? `${hours} часов ` : ''
  const mm = `${min - hours * 60} минут`

  return `${hh}${mm}`
}
