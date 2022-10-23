<template>
  <main class="page__content page">
    <div class="container _narrow">
      <UiCrumbs class="page__crumbs" :list="crumbs" />

      <ContentUniversal />

      <div class="page__copy">
        <UiCopy text="HAPPY-2022" action-text="Скопировать промокод">
          <div class="h2-title c-primary">HAPPY-2022</div>
        </UiCopy>
      </div>

      <ContentUniversal />
    </div>
  </main>
</template>

<script setup>
import { localStorageKeepArray } from '~/utils'

const { $env, $log } = useNuxtApp()

const crumbs = [{ href: '/', label: 'Заголовок' }]

const route = useRoute()

useHead({
  title: `Акция - ${$env.projectName}`,
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
  &__copy {
    margin: 36px 0;
  }
}
</style>
