<template>
  <main class="page__content page">
    <InfoRestaurantList :list="data" />
  </main>
</template>

<script setup lang="ts">
import { IRestaurantDto } from '~/interface/Dto/Restaurant.dto'

const { $env, $log } = useNuxtApp()

const route = useRoute()

useHead({
  title: `Рестораны - ${$env.projectName}`,
})

const { data, error } = await useAsyncData(
  'organization/get-list',
  () =>
    useApi('organization/get-list', {
      method: 'GET',
      headers: useHeaders(),
    }) as Promise<IRestaurantDto[]>
)

$log.log('🧙‍♂️ ASYNC RESTAURANTS', { data: data.value })
</script>

<style lang="scss" scoped>
.page {
  margin: 40px 0 120px;
}
</style>
