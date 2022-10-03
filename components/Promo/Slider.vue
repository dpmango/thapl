<template>
  <div v-if="slides && slides.length" id="promo" class="promo">
    <div class="container">
      <LibSwiper class="promo__slider" :params="swiperParams">
        <SwiperSlide v-for="(slide, idx) in slides" :key="idx">
          <div class="promo__slide">
            <img class="promo__slide-bg" :src="slide.image" :alt="slide.title" />
          </div>
        </SwiperSlide>
      </LibSwiper>
    </div>
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
  spaceBetween: 32,
  centeredSlides: true,
  autoplay: { delay: 10000, pauseOnMouseEnter: true },
  pagination: {
    clickable: true,
  },
}
</script>

<style lang="scss" scoped>
.promo {
  margin: 32px 0px 60px;
  overflow: hidden;
  &__slider {
    overflow: visible;
    .swiper-wrapper {
      overflow: visible;
    }
  }
  &__slide {
    position: relative;
    height: var(--promo-height);
    border-radius: var(--card-border-radius);
    background: var(--color-bg);
    overflow: hidden;
  }
  &__slide-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: left center;
  }
}

@include r($md) {
  .promo {
    margin: 16px 0px 36px;
    &__slide {
      height: var(--promo-height-md);
    }
  }
}

@include r($sm) {
  .promo {
    &__slide {
      height: var(--promo-height-sm);
    }
  }
}
</style>
