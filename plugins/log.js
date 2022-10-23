/* eslint-disable no-console */
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // const isDev = false
  const isDev = process.env.NODE_ENV === 'development'

  nuxtApp.provide('log', {
    log: (...args) => {
      if (isDev) console.log(...args)
    },
    logServer: (...args) => {
      console.log(...args)
    },
    warn: (...args) => {
      console.warn(...args)
    },
    error: (...args) => {
      console.error(...args)
    },
  })
})
