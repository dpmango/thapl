<template>
  <div class="stat">
    <div class="stat-title">пищевая ценность:</div>
    <div class="stat-row">
      <label for="">Энерг. ценность:</label>
      <span>{{ product.energy_full_amount }}</span>
    </div>
    <div class="stat-row">
      <label for="">Белки:</label>
      <span>{{ product.fiber_full_amount }}</span>
    </div>
    <div class="stat-row">
      <label for="">Жиры:</label>
      <span>{{ product.energy_full_amount }}</span>
    </div>
    <div class="stat-row">
      <label for="">Углеводы:</label>
      <span>{{ product.carbohydrate_full_amount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IProduct } from '~/interface/Product'
import { useUiStore } from '~/store'

const ui = useUiStore()

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => {},
  },
})
</script>

<style lang="scss" scoped>
.stat {
  margin: 24px 0 12px;
  text-align: left;
  font-size: 14px;
  color: #d5d5d5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &-title {
    text-align: center;
    margin-bottom: 8px;
    color: white;
    text-transform: uppercase;
  }
  &-row {
    display: flex;
    justify-content: center;
    margin: 6px 0;
    padding: 0 20px;
    label {
      flex: 0 0 50%;
      position: relative;
      padding-right: 20px;
      text-align: right;
      &::after {
        display: block;
        content: '-';
        position: absolute;
        right: 0;
        top: 0;
        color: currentColor;
      }
    }
    span {
      flex: 0 0 50%;
      padding-left: 20px;
    }
  }
}
</style>
