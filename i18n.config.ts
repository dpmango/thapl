import ru from '~/assets/locales/ru/common.json'
import en from '~/assets/locales/en/common.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ru',
  messages: {
    ru,
    en,
  },
}))
