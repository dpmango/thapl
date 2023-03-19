<template>
  <div
    class="video"
    :class="[videoPlaying && 'is-playing']"
    :data-ar="aspectRatio.data"
    :style="aspectRatio.style"
  >
    <div class="video__placeholder">
      <img :src="placeholder" alt="placeholder" />
    </div>
    <div v-if="!disabled" class="video__content">
      <video ref="videoRef" muted="muted" controls="false" playsinline="playsinline">
        <source type="video/mp4" :src="src" />
      </video>
    </div>
    <div v-if="!disabled" class="video__controls">
      <div class="video__play" @click="playVideo">
        <nuxtIcon name="play" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  ar: {
    type: [Number, String],
    default: '16:9',
  },
  disabled: Boolean,
  src: String,
  placeholder: String,
  source: {
    type: String,
    default: 'inline',
  },
})

const videoPlaying = ref(false)
const videoRef = ref(null)

const aspectRatio = computed(() => {
  if (typeof props.ar === 'string' && props.ar.split(':').length) {
    return {
      data: props.ar,
      style: false,
    }
  } else {
    return {
      data: false,
      style: { paddingBottom: `${+props.ar * 100}%` },
    }
  }
})

watch(
  () => videoPlaying.value,
  (newVal, oldVal) => {
    if (newVal === true) {
      videoRef.value.play()
    }
  }
)

const playVideo = () => {
  videoPlaying.value = true
}
</script>

<style lang="scss" scoped>
.video {
  position: relative;
  z-index: 1;
  border-radius: var(--card-border-radius);
  overflow: hidden;
  &[data-ar='16:9'] {
    padding-bottom: 56.25%;
  }
  &[data-ar='1:1'] {
    padding-bottom: 100%;
  }
  &[data-ar='4:3'] {
    padding-bottom: 75%;
  }
  &[data-ar='21:9'] {
    padding-bottom: 42.85%;
  }
  &__placeholder,
  &__content,
  &__controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__placeholder,
  &__content {
    font-size: 0;
    display: flex;
    flex-direction: column;
    transition: opacity 0.25s $ease;
    img,
    iframe,
    video {
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__placeholder {
    z-index: 2;
    background: var(--color-bg);
  }
  &__content {
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s $ease;
    iframe,
    video {
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__controls {
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(black, 0.2);
  }
  &__play {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    color: var(--color-font);
    font-size: 16px;
    cursor: pointer;
    will-change: transform;
    backface-visibility: hidden;
    transition: transform 0.25s $ease, background 0.25s $ease;
    .nuxt-icon {
      transition: 0.25s $ease;
      will-change: transform;
      transform: translateX(2px);
      backface-visibility: hidden;
    }
    &:hover {
      transform: scale(0.8);
      background: var(--color-primary);
      .nuxt-icon {
        transform: scale(1.2) translateX(2px);
      }
    }
  }
  &.is-playing {
    .video__placeholder {
      opacity: 0;
      pointer-events: none;
    }
    .video__content {
      opacity: 1;
      pointer-events: all;
    }
    .video__controls {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
