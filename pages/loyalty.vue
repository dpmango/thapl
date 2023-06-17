<template>
  <main class="page__content page">
    <PromoLoyaltyPage
      v-if="data"
      :data="{
        ...data,
      }"
    />
  </main>
</template>

<script setup lang="ts">
import { ILoyaltyPageDto } from '~/interface'
const { $env, $log } = useNuxtApp()

const route = useRoute()

useApi('loyalty/get-conditions', {
  method: 'GET',
  headers: useHeaders(),
  params: {
    list_type: 3,
  },
}) as Promise<ILoyaltyPageDto>

const { data, error } = await useAsyncData(
  'loyalty/get-conditions',
  () =>
    useApi('loyalty/get-conditions', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        list_type: 3,
      },
    }) as Promise<ILoyaltyPageDto>
)

$log.log('🧙‍♂️ ASYNC LOYALTY', { data: data.value })

useHead({
  title: `${data.value?.title} - ${$env.projectName}`,
})
</script>

<style lang="scss" scoped>
.page {
  margin: 80px 0 120px;
  &__crumbs {
    margin: 36px 0;
  }
  &__copy {
    margin: 36px 0;
  }
}
</style>
