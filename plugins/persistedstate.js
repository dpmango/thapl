import { defineNuxtPlugin, useCookie } from '#app'
import { createNuxtPersistedState } from 'pinia-plugin-persistedstate/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie))
})
//  {
//       cookieOptions: {
//         expires: 3600,
//         maxAge: 3600,
//         sameSite: 'strict',
//       },
//     }
