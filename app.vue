<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useSessionStore } from '~/store'

const nuxtApp = useNuxtApp()

useHead({
  bodyAttrs: {
    class: `theme-${nuxtApp.$env.theme}`,
  },
})

const api = useApi
const session = useSessionStore()
const init = await useInit()
</script>
