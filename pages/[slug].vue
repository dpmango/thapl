<template>
  <main class="page__content page">
    <div class="container _narrow">
      <ContentUniversal />
    </div>
  </main>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

const crumbs = [{ href: '/', label: 'Заголовок' }]

const route = useRoute()

useHead({
  title: `Страница - ${$env.projectName}`,
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
