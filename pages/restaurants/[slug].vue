<template>
  <main class="page__content page">
    <div class="container _narrow">
      <UiCrumbs class="page__crumbs" :list="crumbs" />
    </div>

    <InfoRestaurantPage v-if="data" :data="data" />
  </main>
</template>

<script setup lang="ts">
import { IRestaurantPageDto } from '~/interface'

const { $env, $log } = useNuxtApp()

const route = useRoute()

const { data, error } = await useAsyncData(
  'organization/get-organization-page-data',
  () =>
    useApi('organization/get-organization-page-data', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        id: route.params.slug,
      },
    }) as Promise<IRestaurantPageDto>
)

$log.log('🧙‍♂️ ASYNC RESTAURANT PAGE', { data: data.value })

const crumbs = [
  { href: '/restaurants', label: 'Рестораны' },
  { href: `/restaurants/${data.value?.id}`, label: data.value?.title },
]

useHead({
  title: `${data.value?.title} - ${$env.projectName}`,
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
