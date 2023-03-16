<template>
  <div class="progress">
    <div
      class="progress__value"
      :class="[isCompleate && '_compleate']"
      :style="{ width: `${width}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ width: number }>()

const isCompleate = computed(() => {
  return props.width >= 100
})
</script>

<style lang="scss">
.progress {
  position: relative;
  background: var(--progress-background-color);
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
  &__value {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: var(--color-primary);
    border-radius: 4px;
    &._compleate {
      background: var(--color-green);
    }
  }
}

@include r($sm) {
  .progress {
    height: 4px;
  }
}
</style>
