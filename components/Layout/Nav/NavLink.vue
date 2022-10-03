<template>
  <NuxtLink
    class="nav__link"
    :class="[active && '_active']"
    :to="navLinkProps"
    @click="handleNavClick"
  >
    {{ link.title }}
  </NuxtLink>
</template>

<script setup>
import { scrollToElement } from '~/utils'

const { $env } = useNuxtApp()

const props = defineProps({
  link: Object,
  active: {
    type: Boolean,
    required: false,
  },
})

const emit = defineEmits(['onClick'])

const navLinkProps = computed(() => {
  if ($env.catalogType === 'singlepage') {
    return `#${props.link.slug}`
  } else {
    return `/category/${props.link.slug}`
  }
})

const handleNavClick = () => {
  if ($env.catalogType === 'singlepage') {
    // e.preventDefault()
    scrollToElement(props.link.slug)
  }

  emit('onClick')
}
</script>
