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

<script setup lang="ts">
import { scrollToElement } from '#imports'

const { $env } = useNuxtApp()

const props = defineProps({
  link: Object,
  active: {
    type: Boolean,
    required: false,
  },
  navScrollOffset: {
    type: [Boolean, Number, String],
    default: true,
  },
})

const emit = defineEmits(['onClick'])

const navLinkProps = computed(() => {
  if ($env.catalogType === 'singlepage') {
    return `/#${props.link.slug}`
  } else {
    return `/category/${props.link.slug}`
  }
})

const handleNavClick = (e) => {
  if ($env.catalogType === 'singlepage') {
    // e.preventDefault()
    scrollToElement(props.link.slug, props.navScrollOffset)
  }

  emit('onClick')
}
</script>
