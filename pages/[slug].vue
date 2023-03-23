<template>
  <main class="page__content page">
    <div class="container _narrow">
      <ContentUniversal :blocks="data?.content_data?.blocks" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { createSeoTags } from '#imports'
import { IPageUniversalDto } from '~/interface'

const { $env, $log } = useNuxtApp()

const crumbs = [{ href: '/', label: 'Заголовок' }]

const route = useRoute()

const { data, error } = await useAsyncData(
  'page/get-data',
  () =>
    useApi('page/get-data', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        slug: route.params.slug,
      },
    }) as Promise<IPageUniversalDto>
)

$log.log('🧙‍♂️ ASYNC PAGE', { data: data.value })

if (error && error.value) {
  setResponseStatus(404)
}

useHead({
  ...createSeoTags({
    title: `${data.value?.title} - ${$env.projectName}`,
    description: data.value?.seo_description,
  }),
})
</script>

<style lang="scss" scoped>
.page {
  margin: 60px 0 120px;
  overflow: hidden;
  &__crumbs {
    margin: 36px 0;
  }
  &__copy {
    margin: 36px 0;
  }
}

@include r($md) {
  .page {
    margin: 44px 0 72px;
  }
}
</style>
