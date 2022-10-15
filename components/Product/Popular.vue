<template>
  <section v-if="popularList && popularList.length" class="popular">
    <div class="container">
      <h2 class="popular__title h2-title">Часто заказывают</h2>

      <UiLibSwiper class="popular__slider" :params="swiperParams">
        <SwiperSlide v-for="(card, idx) in popularList" :key="idx">
          <ProductCardMini :name="card.title" :description="card.description" :price="card.price" />
        </SwiperSlide>
      </UiLibSwiper>
    </div>
  </section>
</template>

<script setup>
import { SwiperSlide } from 'swiper/vue'

const { $env, $log } = useNuxtApp()

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

const { data: popularList, error: categoriesError } = await useAsyncData('popular', () =>
  api('catalog/get-popular-items', {
    method: 'GET',
    headers: useHeaders(),
  })
)

$log.log({ popularList })
</script>

<style lang="scss" scoped>
.popular {
  margin: 80px 0 20px;
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
