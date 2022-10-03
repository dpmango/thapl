<template>
  <span>{{ processedText }}</span>
</template>

<script setup>
const props = defineProps({
  text: String,
})

const processedText = computed(() => {
  return props.text.split(/[,]+/).join(', ')
})
</script>
