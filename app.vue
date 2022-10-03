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

  const regionCookie = useCookie('x-thapl-region-id')
  session.setCurrentRegion(regionCookie.value)

  $log.log('regions', { regions })
}

$log.log('catalog', { catalog })
</script>
