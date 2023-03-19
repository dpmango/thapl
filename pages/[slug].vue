<template>
  <main class="page__content page">
    <div class="container _narrow">
      <ContentUniversal :blocks="content" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { createSeoTags } from '#imports'

const { $env, $log } = useNuxtApp()

const crumbs = [{ href: '/', label: 'Заголовок' }]

const route = useRoute()

const { data, error } = await useAsyncData('page/get-data', () =>
  useApi('page/get-data', {
    method: 'GET',
    headers: useHeaders(),
    params: {
      slug: route.params.slug,
    },
  })
)

$log.log('🧙‍♂️ ASYNC PAGE', { data: data.value })

if (error && error.value) {
  setResponseStatus(404)
}

useHead({
  title: `Страница - ${$env.projectName}`,
  ...createSeoTags({
    title: data?.value?.seo_title,
    description: data?.value?.seo_description,
    content_data: data?.value?.content_data,
  }),
})

const content = computed(() => {
  try {
    return data.value.content_data.blocks
  } catch {
    return null
  }
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
