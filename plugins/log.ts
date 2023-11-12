import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const isDev = process.env.NODE_ENV === 'development'
  // const isDev = false
  const isConsoleMode = () => {
    try {
      return ['console', 'debug', 'dev'].some((x) => window.location.search.includes(x))
    } catch (e) {
      return false
    }
  }
  const isDevServer = false

  nuxtApp.provide('log', {
    log: (...args) => {
      if (isDev || isConsoleMode()) console.log(...args)
    },
    logServer: (...args) => {
      if (isDevServer) console.log(...args)
    },
    warn: (...args) => {
      console.warn(...args)
    },
    error: (...args) => {
      console.error(...args)
    },
  })
})
