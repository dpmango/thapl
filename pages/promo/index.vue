<template>
  <main class="page__content page">
    <div class="container _narrow">
      <h1 class="h2-title">Акции</h1>

      <PromoList v-if="data" :list="data" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { IPromoListDto } from '~/interface/Promo'
const { $env, $log } = useNuxtApp()

const route = useRoute()

useHead({
  title: `Промо - ${$env.projectName}`,
})

const { data, error } = await useAsyncData(
  'promo/get-page-data',
  () =>
    useApi('promo/get-for-main-page', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        list_type: 3,
      },
    }) as Promise<IPromoListDto[]>
)

$log.log('🧙‍♂️ ASYNC PROMO', { data: data.value })
</script>

<style lang="scss" scoped>
.page {
  margin: 40px 0 120px;
  &__crumbs {
    margin: 36px 0;
  }
  &__copy {
    margin: 36px 0;
  }
}
</style>
