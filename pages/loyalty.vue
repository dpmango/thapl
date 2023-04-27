<template>
  <main class="page__content page">
    <div class="container _narrow"></div>
  </main>
</template>

<script setup lang="ts">
import { IPromoListDto } from '~/interface/Promo'
const { $env, $log } = useNuxtApp()

const route = useRoute()

useHead({
  title: `Бонусы - ${$env.projectName}`,
})

const { data, error } = await useAsyncData(
  'page/get-conditions',
  () =>
    useApi('page/get-conditions', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        list_type: 3,
      },
    }) as Promise<IPromoListDto[]>
)

$log.log('🧙‍♂️ ASYNC LOYALTY', { data: data.value })
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
