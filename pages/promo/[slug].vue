<template>
  <main class="page__content page">
    <div class="container _narrow">
      <UiCrumbs class="page__crumbs" :list="crumbs" />
    </div>

    <div class="container">
      <div v-if="data?.image" class="page__image">
        <img :src="data?.image" :alt="data?.title" />
      </div>
    </div>

    <div class="container _narrow">
      <template v-if="data?.action">
        <div
          v-if="data?.action === 'copy_promo_code'"
          class="page__copy"
          :style="data.action_button_color ? { backgroundColor: data.action_button_color } : {}"
        >
          <UiCopy
            :text="data.action_data?.code"
            :action-text="data.action_title || 'скопировать промокод'"
          >
            <div class="h2-title c-primary">{{ data.action_data?.code }}</div>
          </UiCopy>
        </div>
      </template>

      <div class="page__content">
        <p v-if="data?.description" class="text-l">{{ data.description }}</p>
        <ContentUniversal v-if="data?.content_data" :blocks="data.content_data" />
      </div>
    </div>
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
  &__image {
    position: relative;
    z-index: 1;
    margin: 36px 0;
    border-radius: var(--card-border-radius);
    overflow: hidden;
    font-size: 0;
    img {
      max-width: 100%;
    }
  }
  &__copy {
    margin: 36px 0;
  }
}
</style>
