<template>
  <div
    class="loader"
    :class="[position && `_${position}`, size && `_${size}`, loading && '_loading']"
  >
    <div class="loader__img">
      <NuxtIcon name="loading" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  position: {
    type: String,
    default: 'inline',
    validator: (v) => ['inline', 'block', 'overlay'].includes(v),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['medium', 'small'].includes(v),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.loader {
  &__img {
    animation: 1s linear 0s normal none infinite running loader;
    -webkit-animation: 1s linear 0s normal none infinite running loader;
  }

  &._block {
    display: flex;
    justify-content: center;
    margin: 16px 0;
  }
  &._overlay {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--loader-overlay-background);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s $ease;

    &._loading {
      opacity: 1;
      pointer-events: all;
    }
  }

  &._medium {
    .loader__img {
      font-size: 48px;
    }
  }
  &._small {
    .loader__img {
      width: 24px;
    }
  }
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
