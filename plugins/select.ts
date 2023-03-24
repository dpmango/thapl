import { defineNuxtPlugin } from '#app'
import vSelect from 'vue-select'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('VSelect', vSelect)
})
