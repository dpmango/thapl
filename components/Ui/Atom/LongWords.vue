<template>
  {{ processedText }}
</template>

<script setup lang="ts">
const props = defineProps({
  text: String,
})

const processedText = computed(() => {
  if (!props.text) return ''
  return props.text.split(/[,]+/).join(', ')
})
</script>
