<template>
  <div class="page">
    <LayoutHeader />
    <LayoutError500 />
    <LayoutFooter />
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
})

const { $log } = useNuxtApp()

$log.warn(props.error)

useHead({
  title: `Ошибка ${props.error.statusCode}`,
})
</script>
