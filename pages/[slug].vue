<template>
  <main class="page__content page">
    <div class="container _narrow">
      <UiCrumbs class="page__crumbs" :list="crumbs" />

      <ContentUniversal />
    </div>
  </main>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

const crumbs = [{ href: '/', label: 'Заголовок' }]

const route = useRoute()

useHead({
  title: `Страница- ${$env.projectName}`,
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
