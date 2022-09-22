<template>
  <section class="popular">
    <div class="container">
      <h2 class="popular__title h2-title">Часто заказывают</h2>

      <div class="popular__list">
        <SwiperSlide v-for="(card, idx) in list" :key="idx">
          <ProductCard />
        </SwiperSlide>
      </div>
    </div>
  </section>
</template>

<script setup>
import { SwiperSlide } from 'swiper/vue'

const props = defineProps({
  list: {
    type: Array,
    // default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.popular {
  margin: 80px 0;
  &__list {
    margin-top: 36px;
  }
}
</style>
