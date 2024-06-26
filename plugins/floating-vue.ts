import FloatingVue from 'floating-vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(FloatingVue)
})
