<template>
  <main class="page__content">
    <ProfileInfo />
  </main>
</template>

<script setup>
const { $env, $log } = useNuxtApp()

useHead({
  title: `Личный кабинет - ${$env.projectName}`,
})
</script>

<style lang="scss" scoped></style>
