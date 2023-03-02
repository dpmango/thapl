<template>
  <main class="page__content page">
    <div class="container _narrow">
      <UiCrumbs class="page__crumbs" :list="crumbs" />
    </div>

    <PromoPage v-if="data" :data="data" />
  </main>
</template>

<script setup lang="ts">
import { localStorageKeepArray } from '#imports'
import { IPromoPageDto } from '~/interface/Promo'

const { $env, $log } = useNuxtApp()

const route = useRoute()

const { data, error } = await useAsyncData(
  'promo/get-page-data',
  () =>
    useApi('promo/get-page-data', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        slug: route.params.slug,
      },
    }) as Promise<IPromoPageDto>
)

$log.log('🧙‍♂️ ASYNC PROMO PAGE', { data: data.value })

const crumbs = [
  { href: '/promo', label: 'Акции' },
  { href: `/promo/${data.value?.id}`, label: data.value?.title },
]

useHead({
  title: `${data.value?.title} - ${$env.projectName}`,
})

onMounted(() => {
  localStorageKeepArray('viewedPromo', route.params.slug)
})
</script>

<style lang="scss" scoped>
.page {
  margin: 40px 0 120px;
  &__crumbs {
    margin: 36px 0;
  }
}
</style>
