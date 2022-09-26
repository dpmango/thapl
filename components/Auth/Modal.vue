<template>
  <UiModal name="auth">
    <div class="auth">
      <AuthPhone v-if="view === 'phone'" @change-view="(v) => (view = v)" />
      <AuthCode v-if="view === 'code'" @change-view="(v) => (view = v)" />
    </div>
  </UiModal>
</template>

<script setup>
const view = ref('phone')
</script>

<style lang="scss" scoped>
.auth {
  &__title {
    text-align: center;
  }
  &__form {
    margin-top: 28px;
  }
  &__cta {
    margin-top: 28px;
  }
  &__note {
    margin-top: 16px;
    font-size: 14px;
    line-height: 22px;
    color: var(--color-gray);
    text-align: center;
    a {
      color: var(--color-primary);
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-font);
      }
    }
  }
}
</style>
