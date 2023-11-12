<template>
  <div class="page">
    <LayoutHeader />
    <main class="page__content">
      <LayoutError404 v-if="+error?.statusCode === 404" />
      <LayoutError500 v-else />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object,
})

const { $log, $env } = useNuxtApp()

$log.warn(props.error)

useHead({
  title: `Ошибка ${props.error?.statusCode}`,
  htmlAttrs: {
    class: `theme-${$env.theme}`,
  },
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  &__content {
    margin: auto 0;
  }
  .footer {
    margin-top: auto;
  }
}
</style>
