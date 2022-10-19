<template>
  <div class="error">
    <div class="error__media">
      <nuxt-icon v-if="icon" :name="icon" />
      <img v-else-if="image" :src="imgSrc" alt="" />
    </div>

    <h4 class="error__title h4-title">{{ title }}</h4>

    <p class="error__content text-m">
      <slot name="content" />
    </p>

    <div class="error__cta">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  image: {
    type: String,
    default: 'error-default',
  },
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
  },
})

const imgSrc = ref(null)

const getImage = async () => {
  const module = await import(/* @vite-ignore */ `./../../../assets/img/${props.image}.svg`)
  return module.default.replace('@fs/', '')
}

watchEffect(async () => {
  if (!props.icon) {
    imgSrc.value = await getImage()
  }
})
</script>

<style lang="scss" scoped>
.error {
  text-align: center;
  max-width: 385px;
  margin-left: auto;
  margin-right: auto;
  &__media {
    font-size: 0;
    display: flex;
    justify-content: center;
    .nuxt-icon {
      font-size: 60px;
    }
  }
  &__title {
    margin-top: 20px;
  }
  &__content {
    margin-top: 16px;
  }
  &__cta {
    margin-top: 28px;
  }
}
</style>
