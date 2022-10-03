import { defineNuxtPlugin, useCookie } from '#app'
import { createNuxtPersistedState } from 'pinia-plugin-persistedstate/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(
    createNuxtPersistedState(useCookie, {
      cookieOptions: {
        maxAge: 60 * 60 * 24 * 30 * 6,
        sameSite: 'strict',
      },
    })
  )
})
