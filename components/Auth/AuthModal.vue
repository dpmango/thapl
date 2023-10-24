<template>
  <UiModal name="auth">
    <div class="auth">
      <AuthPhone v-if="view === 'phone'" @change-view="(v) => (view = v)" />
      <AuthCode v-if="view === 'code'" @change-view="(v) => (view = v)" />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store'
const view = ref('phone')

const session = useSessionStore()
const { isAuthenticated } = storeToRefs(session)

watch(
  () => isAuthenticated.value,
  (newVal) => {
    if (!newVal) view.value = 'phone'
  }
)
</script>

<style lang="scss" scoped>
// .auth {
// }
</style>
