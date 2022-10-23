<template>
  <main class="page__content">
    <LayoutError404 />
  </main>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

const props = defineProps({
  error: Object,
})

useHead({
  title: `Ошибка 404 - ${$env.projectName}`,
})
</script>
