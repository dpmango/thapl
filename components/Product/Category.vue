<template>
  <section class="category">
    <div class="container">
      <h2 class="category__title h2-title">{{ name }}</h2>

      <div class="category__list">
        <div class="row">
          <div v-for="(card, idx) in list" :key="idx" class="col col-3 col-lg-4 col-md-6 col-sm-12">
            <ProductCard />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  name: String,
  list: {
    type: Array,
    // default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.category {
  margin: 40px 0;
  &__list {
    margin-top: 36px;
    .card {
      margin-bottom: 48px;
    }
  }
}
</style>
