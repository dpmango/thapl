<template>
  <div class="slider">
    <UiLibSwiper :params="swiperParams" :auto-height="true">
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
  slidesPerView: 1,
  spaceBetween: 68,
  centeredSlides: true,
  navigation: {
    clickable: true,
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
    margin-left: -68px;
    margin-right: -68px;
    padding-left: 68px;
    padding-right: 68px;
  }
  :deep(.swiper-button-prev) {
    left: 0px;
  }
  :deep(.swiper-button-next) {
    right: 0px;
  }
}

@include r($lg) {
  .slider {
    :deep(.swiper) {
      margin-left: 0px;
      margin-right: 0px;
      padding-left: 0px;
      padding-right: 0px;
    }
    :deep(.swiper-button-prev) {
      display: none;
    }
    :deep(.swiper-button-next) {
      display: none;
    }
  }
}
</style>
