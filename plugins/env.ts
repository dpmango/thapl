import { defineNuxtPlugin } from '#app'

const useRuntime = true

export default defineNuxtPlugin((nuxtApp) => {
  let env: { [key: string]: unknown }

  if (useRuntime) {
    const config = useRuntimeConfig()
    env = { ...config.public }
  } else {
    // @ts-ignore
    env = window.config
  }

  // установка дефольных значений
  // кейс с пустыми ключами в .env (не используются из nuxt.config файла)
  Object.keys(env).forEach((key) => {
    if (env[key] !== '') return

    switch (key) {
      case 'projectName':
        env.projectName = 'Thapl'
        break
      case 'theme':
        env.theme = 'orange'
        break
      case 'catalogType':
        env.catalogType = 'singlepage'
        break
      case 'showCategoryName':
        env.showCategoryName = true
        break
      case 'categoryNameShadow':
        env.categoryNameShadow = true
        break
      case 'promoListType':
        env.orderPaymentOptions = 1
        break
      case 'stopListType':
        env.stopListType = 1
        break
      case 'useRegions':
        env.useRegions = false
        break
      case 'useSearch':
        env.useSearch = false
        break
      case 'useTestimonials':
        env.useTestimonials = false
        break
      case 'useContacts':
        env.useContacts = true
        break
      case 'useWorkTimes':
        env.useWorkTimes = false
        break
      case 'useHeaderMenu':
        env.useHeaderMenu = false
        break
      case 'takeawayOnly':
        env.takeawayOnly = false
        break
      case 'footerNavTitle':
        env.footerNavTitle = 'Компания'
        break
      case 'loyaltyTitle':
        env.loyaltyTitle = 'Бонусы'
        break
      case 'orderAskAuth':
        env.orderAskAuth = true
        break
      case 'orderUsePacking':
        env.orderUsePacking = true
        break
      case 'orderPackingCompact':
        env.orderPackingCompact = 'Компактная'
        break
      case 'orderPackingSeparate':
        env.orderPackingSeparate = 'Отдельная'
        break
      case 'orderUseNotCall':
        env.orderUseNotCall = false
        break
      case 'orderNotCall':
        env.orderNotCall = 'Не звонить'
        break
      case 'orderUseNotHeat':
        env.orderUseNotHeat = false
        break
      case 'orderPaymentOptions':
        env.orderPaymentOptions = '1030,3,1'
        break
      case 'isDisplayProductDesc':
        env.isDisplayProductDesc = false
        break

      default:
        break
    }
  })

  nuxtApp.provide('env', env)
})
