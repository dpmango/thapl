<template>
  <div class="page">
    <LayoutHeader />
    <main class="page__content">
      <LayoutError404 v-if="+error.statusCode === 404" />
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
  title: `Ошибка ${props.error.statusCode}`,
  bodyAttrs: {
    class: `theme-${$env.theme}`,
  },
})
</script>
