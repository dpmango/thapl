<template>
  <UiModal name="auth">
    <div class="auth">
      <AuthPhone v-if="view === 'phone'" @change-view="(v) => (view = v)" />
      <AuthCode v-if="view === 'code'" @change-view="(v) => (view = v)" />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
const view = ref('phone')
</script>

<style lang="scss" scoped>
// .auth {
// }
</style>
