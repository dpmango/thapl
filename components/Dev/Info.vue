<template>
  <div class="container">
    <div class="dev text-xs c-gray">
      <p>apiCookie cookie: {{ apiCookie }}</p>
      <p>userCookie cookie: {{ userCookie }}</p>
      <p>regionCookie cookie: {{ regionCookie }}</p>

      <p>api_token: {{ session.api_token }}</p>
      <p>user_token: {{ session.user_token }}</p>
      <p>user: {{ session.user }}</p>
      <p>app_settings: {{ session.app_settings }}</p>

      <p>$env: {{ $env }}</p>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from '~/store'
const apiCookie = useCookie('x-thapl-apitoken')
const userCookie = useCookie('x-thapl-authorization')
const regionCookie = useCookie('x-thapl-region-id')

const { $env } = useNuxtApp()

const session = useSessionStore()
</script>
