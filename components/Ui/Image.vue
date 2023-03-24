<template>
  <nuxt-img :src="src || noPhotoUrl" loading="lazy" v-bind="$attrs" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ src: string | null; placeholder?: string }>(), {
  placeholder: 'no_photo.jpg',
})

const { $env } = useNuxtApp()

const noPhotoUrl = computed(() => {
  if (props.placeholder) return `${$env.apiBase}/${props.placeholder}`

  return ''
})
</script>
