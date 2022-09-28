<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useSessionStore, useProductStore } from '~/store'

const { $env } = useNuxtApp()

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

  console.log('regions', { regions })
}

console.log('catalog', { catalog })
</script>
