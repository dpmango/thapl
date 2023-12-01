import VueGtag from 'vue-gtag-next'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  if (config.public.googleId) {
    nuxtApp.vueApp.use(VueGtag, {
      property: {
        id: config.public.googleId,
      },
    })
  }
})
