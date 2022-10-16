<template>
  <div class="page">
    <LayoutHeader />
    <main class="page__content">
      <LayoutError404 v-if="error.statusCode === '404'" />
      <LayoutError500 v-else />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
})

const { $log } = useNuxtApp()

$log.warn(props.error)

useHead({
  title: `Ошибка ${props.error.statusCode}`,
})
</script>
