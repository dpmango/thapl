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
// import { useToast } from 'vue-toastification/dist/index.mjs'
import {
  useSessionStore,
  useProductStore,
  useDeliveryStore,
  useUiStore,
  useCartStore,
} from '~/store'
import { scrollPageToTop, createSeoTags, APP_VERSION } from '#imports'

const nuxtApp = useNuxtApp()
const { $env, $log } = nuxtApp
const ui = useUiStore()

// const toast = useToast()

$log.log(`APP Version: ${APP_VERSION}`)

// toast.info('Тост с уведомлением', {
//   timeout: 60 * 1000,
// })

// toast.success('Тост с успехом', {
//   timeout: 60 * 1000,
// })

// toast.error('Тост с ошибкой', {
//   timeout: 60 * 1000,
// })

const loaded = ref(false)
nuxtApp.hook('page:finish', () => {
  if (loaded.value) {
    scrollPageToTop()
    ui.closeAllModals()
    ui.setMobileMenu(false)
  }

  loaded.value = true
})

onMounted(() => {
  setAppVH()
  window.addEventListener('resize', setAppVH)
})

const setAppVH = () => {
  const vw = document.documentElement.clientWidth * 0.01
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vw', `${vw}px`)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

const productStore = useProductStore()
const deliveryStore = useDeliveryStore()
const cartStore = useCartStore()
const sessionStore = useSessionStore()
const { region } = storeToRefs(deliveryStore)

const initData = await useInit()

// TODO - установка куки в клиент от init (баг useCookieState)
// не работает когда useCookieState работает в SSR контексте
const apiCookieClient = useCookie('x-thapl-apitoken')
apiCookieClient.value = initData.api_token

useHead({
  title: $env.projectName,
  bodyAttrs: {
    class: `theme-${$env.theme}`,
  },
  ...createSeoTags({
    title: initData.site_settings?.page?.seo_title,
    description: initData.site_settings?.page?.seo_description,
    content_data: initData.site_settings?.page?.content_data,
  }),
})

const { data: catalog, error: categoriesError } = await useAsyncData('catalog', () =>
  productStore.getCatalog()
)

$log.log('🧙‍♂️ ASYNC CATALOG', { catalog: catalog.value })

if ($env.useRegions) {
  const { data: regions, error: regionsError } = await useAsyncData('regions', () =>
    deliveryStore.getRegions()
  )

  const regionCookie = useCookieState('x-thapl-region-id')
  // const regionCookieClient = useCookie('x-thapl-region-id')
  region.value = regionCookie.value
  // regionCookieClient.value = regionCookie.value

  $log.log('🧙‍♂️ ASYNC REGIONS', { regions: regions.value })
}

if (initData.app_settings.takeaway_enabled || !$env.takeawayOnly) {
  const { data: restaurants, error: restaurantsError } = await useAsyncData(
    'organizations-for-takeaway',
    () => deliveryStore.getRestaurants()
  )

  $log.log('🧙‍♂️ ASYNC ORGANIZATIONS', { restaurants: restaurants.value })
}

onMounted(() => {
  deliveryStore.clientInit()
  cartStore.fetchCartProducts()
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
