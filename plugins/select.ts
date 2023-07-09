import vSelect from 'vue-select'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('VSelect', vSelect)
})
