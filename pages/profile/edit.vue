<template>
  <main class="page__content">
    <ProfileEdit />
  </main>
</template>

<script setup lang="ts">
const { $env, $log } = useNuxtApp()

definePageMeta({
  middleware: [useAuthGuard],
})

useHead({
  title: `Редактировать профиль - ${$env.projectName}`,
})
</script>
