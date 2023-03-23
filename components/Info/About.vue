<template>
  <div v-if="content" class="about">
    <div class="container">
      <ContentUniversal :blocks="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store'

const sessionStore = useSessionStore()

const { app_settings } = storeToRefs(sessionStore)

const content = computed(() => {
  try {
    // @ts-ignore
    return app_settings.value.site_settings.page.content_data.blocks
  } catch {
    return null
  }
})
</script>

<style lang="scss" scoped>
.about {
  margin: 90px 0 120px;
}
</style>
