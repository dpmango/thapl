<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useSessionStore, useProductStore } from '~/store'

const nuxtApp = useNuxtApp()

useHead({
  bodyAttrs: {
    class: `theme-${nuxtApp.$env.theme}`,
  },
})

const productStore = useProductStore()
const init = await useInit()

const { data: catalog, error: categoriesError } = await useAsyncData('catalog', () =>
  productStore.getCatalog()
)

console.log('catalog', { catalog })
</script>
