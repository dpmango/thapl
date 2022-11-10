<template>
  <div class="slider">
    <UiLibSwiper :params="swiperParams">
      <SwiperSlide v-for="(slide, idx) in slides" :key="idx">
        <div class="slider__slide">
          <img :src="slide.img" alt="" />
        </div>
      </SwiperSlide>
    </UiLibSwiper>
  </div>
</template>

<script setup>
import { SwiperSlide } from 'swiper/vue'

const props = defineProps({
  slides: {
    type: Array,
    default: () => [],
  },
})

const swiperParams = {
  slidesPerView: 'auto',
  spaceBetween: 20,
  scrollbar: {
    draggable: true,
  },
  freeMode: {
    enabled: true,
    sticky: false,
  },
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: true,
    sensitivity: 0.7,
  },
}
</script>

<style lang="scss" scoped>
.slider {
  &__slide {
    position: relative;
    z-index: 1;
    font-size: 0;
    border-radius: var(--card-border-radius);
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  :deep(.swiper) {
    overflow: visible;
  }
}
</style>
