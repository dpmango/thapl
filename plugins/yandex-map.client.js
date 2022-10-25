import plugin from 'vue-yandex-maps'
import { defineNuxtPlugin } from '#app'

// Beta docs
// https://vue-yandex-maps.github.io/new-docs/

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const settings = {
    apiKey: config.public.yandexMapsKey,
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1',
  }

  if (config.public.yandexMapsKey) {
    nuxtApp.vueApp.use(plugin, settings)
    nuxtApp.provide('ymConfig', settings)
  }
})
