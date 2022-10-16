<template>
  <div class="container">
    <div class="dev text-xs c-gray">
      <p>apiCookie cookie: {{ apiCookie }}</p>
      <p>userCookie cookie: {{ userCookie }}</p>
      <p>regionCookie cookie: {{ regionCookie }}</p>

      <p>api_token: {{ session.api_token }}</p>
      <p>user_token: {{ session.user_token }}</p>
      <p>user: {{ session.user }}</p>
      <!-- <p>app_settings: {{ session.app_settings }}</p> -->

      <p>$env: {{ $env }}</p>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from '~/store'
const apiCookie = useCookieState('x-thapl-apitoken')
const userCookie = useCookieState('x-thapl-authorization')
const regionCookie = useCookieState('x-thapl-region-id')

const { $env } = useNuxtApp()
const session = useSessionStore()
</script>
