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

nuxtApp.hook('page:finish', () => {
  scrollPageToTop()
})

useHead({
  bodyAttrs: {
    class: `theme-${$env.theme}`,
  },
})

const productStore = useProductStore()
const session = useSessionStore()

const init = await useInit()

const { data: catalog, error: categoriesError } = await useAsyncData('catalog', () =>
  productStore.getCatalog()
)

if ($env.useRegions) {
  const { data: regions, error: regionsError } = await useAsyncData('regions', () =>
    session.getRegions()
  )

  const regionCookie = useCookieState('x-thapl-region-id')
  session.setCurrentRegion(regionCookie.value)

  $log.log('regions', { regions })
}

$log.log('catalog', { catalog })
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
