<template>
  <div class="stories" :class="[visible && '_active']">
    <div v-click-outside="() => emit('on-close')" class="stories__wrapper">
      <div class="stories__header">
        <div class="js-pagination">
          <span
            v-for="(s, idx) in stories"
            ref="paginationRefSpans"
            :key="idx"
            :data-index="idx"
          ></span>
        </div>

        <div class="stories__close" @click="() => emit('on-close')">
          <span class="js-close-webview">
            <nuxt-icon name="close" />
          </span>
        </div>
      </div>

      <div class="stories__nav">
        <div class="js-swipe-prev" @click="slidePrev"></div>
        <div class="js-swipe-next" @click="slideNext"></div>
      </div>

      <UiLibSwiper v-if="visible" class="stories__slider" :params="swiperParams" @swiper="onSwiper">
        <SwiperSlide v-for="(story, idx) in stories" :key="idx">
          <PromoStoriesCard :story="story" />
        </SwiperSlide>
      </UiLibSwiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { IStoriesDto } from '~/interface/Promo'

const props = defineProps<{
  stories: IStoriesDto[]
  visible: Boolean
}>()

const emit = defineEmits(['on-close'])

const swiperParams = {
  slidesPerView: 1,
  spaceBetween: 0,
  threshold: 3,
  preventClicks: true,
  touchEventsTarget: 'container',
  freeMode: {
    enabled: true,
    sticky: false,
  },
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: true,
    sensitivity: 0.7,
  },
  autoplay: {
    delay: 6000,
  },
}

const swiperInstance = ref<typeof Swiper | null>(null)
const paginationRefSpans = ref<HTMLElement[] | []>([])

const onSwiper = (swiper) => {
  swiperInstance.value = swiper
  updatePaginationByIndex(0)
}

watch(
  () => swiperInstance.value,
  (newInst) => {
    if (newInst) {
      newInst.on('slideChange', (instance) => {
        updatePaginationByIndex(instance.realIndex)
      })
    }
  }
)

const slideNext = () => {
  swiperInstance.value?.slideNext()
}
const slidePrev = () => {
  swiperInstance.value?.slidePrev()
}

const updatePaginationByIndex = (activeIndex) => {
  paginationRefSpans.value.forEach((span, idx) => {
    span.classList.remove('_active')
    span.classList.remove('_prev')
  })

  paginationRefSpans.value.forEach((span, idx) => {
    const spanIndex = span.getAttribute('data-index') || ''
    const action = +spanIndex === activeIndex ? 'add' : 'remove'
    const actionHistory = +spanIndex < activeIndex ? 'add' : 'remove'

    span.classList[action]('_active')
    span.classList[actionHistory]('_prev')
  })
}

watch(
  () => props.stories,
  () => {
    updatePaginationByIndex(0)
  }
)
</script>

<style lang="scss" scoped>
.stories {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--stories-bg);
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 100%;
  min-height: 1px;
  user-select: none;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s $ease;
  &._active {
    opacity: 1;
    pointer-events: all;
  }
  &__wrapper {
    position: relative;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 456px;
    margin-left: auto;
    margin-right: auto;
    margin: auto auto;
  }
  &__slider {
    position: relative;
    height: 100%;
    min-width: 1px;
    min-height: 1px;
    width: 100%;
    border-radius: 12px;
    :deep(.swiper-slide) {
      width: 100% !important;
      // height: 100% !important;
    }
  }
  &__header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
    padding: 12px 16px;
    user-select: none;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.12) 0%,
      rgba(0, 0, 0, 0.08) 42.5%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .swiper-wrapper {
    position: relative;
  }
  .js-pagination {
    position: relative;
    z-index: 3;
    display: flex;
    border-radius: 6px;
    height: 4px;
    overflow: hidden;
    pointer-events: none;
    span {
      position: relative;
      flex: 1 1 auto;
      margin-right: 4px;
      border-radius: 6px;
      background: rgba(white, 0.4);
      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        height: 100%;
        left: 0;
        top: 0;
        width: 0%;
        background: white;
        border-radius: 6px;
        will-change: width;
      }
      &._active::after {
        // width: 100%;
        // transition: width 6s linear;
        animation: fillWidth 6s linear;
        animation-fill-mode: forwards;
      }
      &._prev::after {
        width: 100%;
      }
    }
  }

  &__close {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    font-size: 0;
    .nuxt-icon {
      font-size: 16px;
      padding: 5px;
      cursor: pointer;
      transition: opacity 0.25s ease-in-out;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  &__nav {
    .js-swipe-prev,
    .js-swipe-next {
      position: absolute;
      z-index: 3;
      top: 0;
      bottom: 0;
      width: 25%;
      cursor: pointer;
    }

    .js-swipe-prev {
      left: 0;
    }
    .js-swipe-next {
      right: 0;
    }
  }
}

@keyframes fillWidth {
  from {
    width: 0%;
  }
  to {
    width: calc(100% - 2px);
  }
}

@include r($md) {
  .stories {
    &__wrapper {
      max-width: 100%;
      margin: 0;
    }
    &__slider {
      border-radius: 0;
    }
  }
}
</style>
