<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :throttle="300" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useSessionStore, useProductStore } from '~/store'
import { scrollPageToTop } from '~/utils'

const nuxtApp = useNuxtApp()
const { $env, $log } = nuxtApp

const loaded = ref(false)
nuxtApp.hook('page:finish', () => {
  if (loaded.value) scrollPageToTop() // no scroll on initial load
  loaded.value = true
})

useHead({
  bodyAttrs: {
    class: `theme-${$env.theme}`,
  },
})

// onMounted(() => {
//   setAppVH()
//   window.addEventListener('resize', setAppVH)
// })

// const setAppVH = () => {
//   document.documentElement.style.setProperty('--app-vh', window.innerHeight * 0.01 + 'px')
// }

const productStore = useProductStore()
const session = useSessionStore()

const init = await useInit()

const { data: catalog, error: categoriesError } = await useAsyncData('catalog', () =>
  productStore.getCatalog()
)

$log.log('🧙‍♂️ ASYNC CATALOG', { catalog })

if ($env.useRegions) {
  const { data: regions, error: regionsError } = await useAsyncData('regions', () =>
    session.getRegions()
  )

  const regionCookie = useCookieState('x-thapl-region-id')
  session.setCurrentRegion(regionCookie.value)

  $log.log('🧙‍♂️ ASYNC REGIONS', { regions })
}
</script>

<style lang="scss">
:root {
  --app-vh: 100vh;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(10px);
}
</style>
