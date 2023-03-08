<template>
  <div class="review__head">
    <h3 class="h3-title">{{ title }}</h3>
    <p v-if="description" class="text-m c-gray">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  description: String,
})
</script>

<style lang="scss" scoped>
.review {
  &__head {
    text-align: center;
    p {
      margin-top: 20px;
    }
  }
}
</style>
