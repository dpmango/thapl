<template>
  <section class="popular">
    <div class="container">
      <h2 class="popular__title h2-title">{{ data.title }}</h2>

      <UiLibSwiper class="popular__slider" :params="swiperParams">
        <SwiperSlide v-for="(card, idx) in data.catalog_items" :key="idx">
          <ProductCardMini :product="card" />
        </SwiperSlide>
      </UiLibSwiper>
    </div>
  </section>
</template>

<script setup>
import { SwiperSlide } from 'swiper/vue'

const { $env, $log } = useNuxtApp()

const props = defineProps({
  data: {
    type: Object,
    default: () => null,
  },
})

const swiperParams = {
  slidesPerView: 'auto',
  spaceBetween: 32,
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
.popular {
  margin: 20px 0 20px;
  overflow: hidden;
  padding-bottom: 60px;
  &__slider {
    overflow: visible;
    margin-top: 36px;
    .swiper-wrapper {
      overflow: visible;
    }
    .swiper-slide {
      width: 368px;
    }
  }
}
</style>
