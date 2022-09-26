<template>
  <main class="page__content">Ошибка</main>
  <div>{{ error }}</div>

  <NuxtErrorBoundary></NuxtErrorBoundary>
</template>

<script setup>
const props = defineProps({
  error: Object,
})

useHead({
  title: 'Ошибка',
})
</script>
