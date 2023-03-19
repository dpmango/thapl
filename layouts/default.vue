<template>
  <div class="page">
    <LayoutHeader />
    <slot></slot>
    <LayoutFooter />
    <LayoutMobileMenu />
    <LayoutSharedModals />
    <UiDevGrid />
  </div>
</template>

<script setup lang="ts">
// const api = useApi
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .footer {
    margin-top: auto;
  }
}
</style>
