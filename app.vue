<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :throttle="300" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSessionStore, useProductStore, useDeliveryStore, useUiStore } from '~/store'
import { scrollPageToTop } from '~/utils'

const nuxtApp = useNuxtApp()
const { $env, $log } = nuxtApp
const ui = useUiStore()

const loaded = ref(false)
nuxtApp.hook('page:finish', () => {
  if (loaded.value) scrollPageToTop() // no scroll on initial load
  loaded.value = true
  ui.closeAllModals()
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
const deliveryStore = useDeliveryStore()
const sessionStore = useSessionStore()
const { region } = storeToRefs(deliveryStore)

const init = await useInit()

const { data: catalog, error: categoriesError } = await useAsyncData('catalog', () =>
  productStore.getCatalog()
)

$log.log('🧙‍♂️ ASYNC CATALOG', { catalog: catalog.value })

if ($env.useRegions) {
  const { data: regions, error: regionsError } = await useAsyncData('regions', () =>
    deliveryStore.getRegions()
  )

  const regionCookie = useCookieState('x-thapl-region-id')
  deliveryStore.region.value = regionCookie.value

  $log.log('🧙‍♂️ ASYNC REGIONS', { regions: regions.value })
}

if (init.app_settings.takeaway_enabled || !$env.takeawayOnly) {
  const { data: restaurants, error: restaurantsError } = await useAsyncData(
    'organizations-for-takeaway',
    () => deliveryStore.getRestaurants()
  )

  $log.log('🧙‍♂️ ASYNC ORGANIZATIONS', { restaurants: restaurants.value })
}

onMounted(() => {
  deliveryStore.clientInit()
})
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
