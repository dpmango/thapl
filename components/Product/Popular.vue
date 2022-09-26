<template>
  <section class="popular">
    <div class="container">
      <h2 class="popular__title h2-title">Часто заказывают</h2>

      <LibSwiper class="popular__slider" :params="swiperParams">
        <SwiperSlide v-for="(card, idx) in list" :key="idx">
          <ProductCardMini :name="card.title" :description="card.description" :price="card.price" />
        </SwiperSlide>
      </LibSwiper>
    </div>
  </section>
</template>

<script setup>
import { SwiperSlide } from 'swiper/vue'

const list = ref([
  {
    id: 1,
    title: 'Веган бургер 🌱',
    description: 'Ветчина, картошечка, моцарелла, соус альфредо',
    price: 'от 220 ₽',
  },
  {
    id: 2,
    title: 'Сливочный суп с мидиями',
    description: 'Ветчина, картошечка, моцарелла, соус альфредо',
    price: 'от 220 ₽',
  },
  { id: 3, title: 'Чиабатта клаб', description: '220 г', price: 'от 220 ₽' },
  { id: 4, title: 'Сливочный суп с мидиями', description: '', price: 'от 220 ₽' },
])

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
