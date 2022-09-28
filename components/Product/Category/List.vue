<template>
  <div class="category__list">
    <div class="row">
      <div v-for="card in list" :key="card.id" class="col col-3 col-lg-4 col-md-6 col-sm-12">
        <ProductCard :product="card" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IProduct } from '~/interface/Product'

const props = defineProps({
  list: Array as PropType<IProduct[]>,
})
</script>

<style lang="scss" scoped>
.category {
  &__list {
    margin-top: 36px;
    .card {
      margin-bottom: 48px;
    }
  }
}
</style>
