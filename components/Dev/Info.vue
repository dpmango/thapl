<template>
  <div class="container">
    <div class="dev text-xs c-gray">
      <p>apiToken cookie: {{ apiToken }}</p>
      <p>userToken cookie: {{ userToken }}</p>

      <p>api_token: {{ session.api_token }}</p>
      <p>user_token: {{ session.user_token }}</p>
      <p>user: {{ session.user }}</p>
      <p>app_settings: {{ session.app_settings }}</p>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from '~/store'
const apiToken = useCookie('x-thapl-apitoken')
const userToken = useCookie('x-thapl-authorization')

const session = useSessionStore()
</script>
