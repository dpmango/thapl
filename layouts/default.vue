<template>
  <div class="page">
    <LayoutHeader />
    <slot></slot>
    <LayoutFooter />
    <LayoutSharedModals />
    <DevGrid />
  </div>
</template>

<script setup>
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
