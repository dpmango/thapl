<template>
  <main class="page__content">
    <ProfileEdit />
  </main>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

const props = defineProps({
  error: Object,
})

useHead({
  title: `Редактировать профиль - ${$env.projectName}`,
})
</script>

<style lang="scss" scoped></style>
