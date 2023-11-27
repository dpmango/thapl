<template>
  <main class="page__content">
    <ProfileInfo />
  </main>
</template>

<script setup lang="ts">
const { $env, $log } = useNuxtApp()

definePageMeta({
  middleware: [useAuthGuard],
})

useHead({
  title: `Личный кабинет - ${$env.projectName}`,
})
</script>
