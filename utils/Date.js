/* eslint-disable import/no-named-as-default-member */
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isToday from 'dayjs/plugin/isToday'
import locale_ru from 'dayjs/locale/ru'
import { Plurize } from '~/utils'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isToday)
dayjs.locale('ru')

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

export const generateDaysFrom = (from, number) => {
  return [...Array(number)].map((_, idx) => {
    const day = from.add(idx + 1, 'day')
    return {
      id: day.format('DD.MM.YYYY'),
      label: day.format('D MMMM YYYY'),
    }
  })
}

export const generateTimeSlots = (start, end, interval, now) => {
  const timeSlots = []

  while (start <= end) {
    const endLabel = start.add(interval, 'hour')

    timeSlots.push({
      disabled: now >= start,
      id: start.format('HH:mm'),
      label: `${start.format('HH:mm')} - ${endLabel.format('HH:mm')}`,
    })

    start = start.add(interval, 'hour')
  }
  return timeSlots
}
