<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :throttle="300" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  useSessionStore,
  useProductStore,
  useDeliveryStore,
  useUiStore,
  useCartStore,
  useContactStore,
} from '~/store'
import { createSeoTags, APP_VERSION } from '#imports'

const nuxtApp = useNuxtApp()
const { $env, $log } = nuxtApp
const ui = useUiStore()

console.log(`APP Version: ${APP_VERSION}`)

const loaded = ref(false)
nuxtApp.hook('page:finish', () => {
  if (loaded.value) {
    // scrollPageToTop()
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
const contactStore = useContactStore()
const { region } = storeToRefs(deliveryStore)

const initData = await useInit()

// установка куки в клиент от init (баг useCookieState)
// не работает когда useCookieState работает в SSR контексте
const apiCookieClient = useCookie('x-thapl-apitoken', { maxAge: 60 * 60 * 24 * 30 * 6 })
apiCookieClient.value = initData?.api_token || null

useHead({
  htmlAttrs: {
    class: `theme-${$env.theme}`,
  },
  ...createSeoTags({
    title: initData?.site_settings?.page?.seo_title || $env.projectName,
    description: initData?.site_settings?.page?.seo_description,
  }),
})

await useAsyncData('startup', async () => {
  const promisesToBeFetched = [
    {
      id: 'catalog',
      resolver: productStore.getCatalog(),
    },
    {
      id: 'zone',
      resolver: deliveryStore.hydrateZone(),
    },
    {
      id: 'contacts',
      resolver: contactStore.getContacts(),
    },
    {
      id: 'restaurantsForContacts',
      resolver: contactStore.getContactRestaurants(),
    },
  ] as { id: string; resolver: Promise<any> }[]

  if ($env.useRegions) {
    promisesToBeFetched.push({
      id: 'regions',
      resolver: deliveryStore.getRegions(),
    })
  }

  if (initData?.app_settings.takeaway_enabled) {
    promisesToBeFetched.push({
      id: 'restaurants',
      resolver: deliveryStore.getRestaurants(),
    })
  }

  const allSettled = (await Promise.allSettled(
    promisesToBeFetched.map((x) => x.resolver)
  )) as PromiseSettledResult<any>[]

  const regionCookie = useCookieState('x-thapl-region-id')
  allSettled.forEach((result, idx) => {
    const { id } = promisesToBeFetched[idx]

    // console.log(name, { result })
    // if (result.status === 'rejected') errHandler()
    if (result.status === 'fulfilled' && result.value) {
      const { data, error } = result.value

      switch (id) {
        case 'catalog':
          $log.log('🧙‍♂️ ASYNC CATALOG', { catalog: result.value })
          break
        case 'regions':
          // const regionCookieClient = useCookie('x-thapl-region-id')
          region.value = regionCookie.value || null
          // regionCookieClient.value = regionCookie.value

          $log.log('🧙‍♂️ ASYNC REGIONS', { regions: result.value })

          break
        case 'restaurants':
          $log.log('🧙‍♂️ ASYNC ORGANIZATIONS', { restaurants: result.value })

          break
        default:
          break
      }
    }
  })

  return true
})

onMounted(() => {
  deliveryStore.getStoredAddresses()
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
