<template>
  <swiper
    class="c-swiper"
    :slides-per-view="params.slidesPerView"
    :space-between="params.spaceBetween"
    :navigation="params.navigation"
    :pagination="params.pagination"
    :scrollbar="params.scrollbar"
    :free-mode="params.freeMode"
    :mousewheel="params.mousewheel"
    :autoplay="params.autoplay"
    :threshold="params.threshold"
    :touch-events-target="params.touchEventsTarget"
    :modules="modules"
    v-bind="$attrs"
  >
    <slot />
  </swiper>
</template>

<script setup>
import { Swiper } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, FreeMode, Mousewheel, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/free-mode'
import 'swiper/css/mousewheel'
import 'swiper/css/autoplay'

const props = defineProps({
  params: {
    type: Object,
    default: () => ({}),
  },
})

const modules = [Navigation, Pagination, Scrollbar, FreeMode, Mousewheel, Autoplay]

const params = ref({
  slidesPerView: 'auto',
  // speed: 500,
  navigation: false,
  pagination: false,
  scrollbar: false,
  mousewheel: false,
  freeMode: false,
  threshold: 3,
  touchEventsTarget: 'container',
  ...props.params,
})
</script>

<style lang="scss" scoped>
.c-swiper {
  :deep(.swiper-wrapper) {
    .swiper-slide {
      display: flex;
      flex-direction: column;
      height: auto;
    }
  }

  :deep(.swiper-scrollbar) {
    position: static;
    margin-top: 24px;
    background: var(--swiper-bullet-color);
    cursor: grab;
    border-radius: 0;
  }
  :deep(.swiper-scrollbar-drag) {
    background: var(--color-primary);
    border-radius: 0;
  }
  :deep(.swiper-pagination) {
    position: static;
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
  :deep(.swiper-pagination-bullet) {
    background: var(--swiper-bullet-color);
    opacity: 1;
    display: inline-flex;
    margin: 0 6px;
    width: 24px;
    height: 4px;
    cursor: pointer;
    border-radius: 10px;
    display: block;
    transition: background 0.25s $ease;
  }
  :deep(.swiper-pagination-bullet:hover) {
    background: var(--color-primary);
  }
  :deep(.swiper-pagination-bullet-active) {
    background: var(--color-primary);
  }

  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    background: var(--swiper-nav-color);
    border-radius: 50%;
    opacity: 1;
    width: 43px;
    height: 43px;
    color: var(--color-gray);
    transition: background 0.25s $ease, opacity 0.25s $ease;
    &:hover {
      background: var(--color-primary);
    }
    &::after {
      font-size: 20px;
    }
  }
  :deep(.swiper-button-prev) {
    left: 40px;
  }
  :deep(.swiper-button-next) {
    right: 40px;
  }
  :deep(.swiper-button-disabled) {
    opacity: 0.5;
    pointer-events: none;
  }

  @include r($md) {
    :deep(.swiper-pagination) {
      margin-top: 12px;
    }
  }
}
</style>
