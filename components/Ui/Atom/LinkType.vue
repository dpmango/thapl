<template>
  <NuxtLink :to="attributes.to" :target="attributes.target">
    {{ link.title }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ISiteMenu } from '~/interface/Site'

const props = defineProps({
  link: {
    type: Object as PropType<ISiteMenu>,
    default: () => ({}),
  },
})

const attributes = computed(() => {
  let to = '#'
  let target = ''

  switch (props.link.type) {
    // external links
    case -10:
      to = props.link.target_url || '#'
      target = '_blank'
      break
    case 20:
      to = `/${props.link.target_slug}`
      break
    case 10:
      to = '/promo'
      break
    case 30:
      to = '/restaurant'
      break
    case 40:
      to = '/news'
      break
    case 50:
      to = `/category/${props.link.target_slug}`
      break
    default:
      break
  }

  return {
    to,
    target,
  }
})
</script>
