import { defineNuxtPlugin } from '#app'

const useRuntime = true

export default defineNuxtPlugin((nuxtApp) => {
  let env

  if (useRuntime) {
    const config = useRuntimeConfig()
    env = config.public
  } else {
    env = window.config
  }

  nuxtApp.provide('env', env)
})
