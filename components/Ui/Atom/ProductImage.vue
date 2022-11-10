<template>
  <img :src="src || noPhotoUrl" :alt="alt" />
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: null,
  },
})

const { $env } = useNuxtApp()

const noPhotoUrl = computed(() => {
  return $env.apiBase + '/no_photo.jpg'
})
</script>
