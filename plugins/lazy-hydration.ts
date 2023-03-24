import { LazyHydrationWrapper } from 'vue3-lazy-hydration'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('LazyHydrate', LazyHydrationWrapper)
})
