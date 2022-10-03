import { maska } from 'maska/dist/maska.esm'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('maska', maska)
})
