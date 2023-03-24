<template>
  <li v-if="app_settings.app_store_link">
    <a :href="app_settings.app_store_link">
      <img src="~/assets/img/app-store.svg" alt="app store" />
    </a>
  </li>
  <li v-if="app_settings.play_store_link">
    <a :href="app_settings.play_store_link">
      <img src="~/assets/img/google-play.svg" alt="google play" />
    </a>
  </li>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store'

const sessionStore = useSessionStore()
const { app_settings } = storeToRefs(sessionStore)
</script>
