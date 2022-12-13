<template>
  <div class="addons">
    <h2 class="addons__title text-m fw-500 text-sm-s">Добавить к заказу?</h2>

    <UiLibSwiper class="addons__slider" :params="swiperParams">
      <SwiperSlide v-for="(card, idx) in list" :key="idx">
        <ProductCardAddon :product="card" />
      </SwiperSlide>
    </UiLibSwiper>
  </div>
</template>

<script setup>
import { SwiperSlide } from 'swiper/vue'

const { $env, $log } = useNuxtApp()

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const swiperParams = {
  slidesPerView: 'auto',
  spaceBetween: 16,
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
}
</script>

<style lang="scss" scoped>
.addons {
  overflow: hidden;
  background: var(--color-bg);
  border-radius: 12px;
  padding: 20px 24px 24px;
  &__slider {
    overflow: visible;
    margin-top: 16px;
    .swiper-wrapper {
      overflow: visible;
    }
    .swiper-slide {
      width: 260px;
    }
  }
}

@include r($sm) {
  .addons {
    padding: 16px;
    &__slider {
      margin-top: 12px;
      .swiper-slide {
        width: 220px;
      }
    }
  }
}
</style>
