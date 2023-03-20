<template>
  <div class="stat">
    <div class="stat-title">пищевая ценность:</div>
    <div class="stat-row">
      <label for="">Энерг. ценность:</label>
      <span>{{ toNum(product.energy_full_amount, 'Ккал') }}</span>
    </div>
    <div class="stat-row">
      <label for="">Белки:</label>
      <span>{{ toNum(product.fiber_full_amount) }}</span>
    </div>
    <div class="stat-row">
      <label for="">Жиры:</label>
      <span>{{ toNum(product.fat_full_amount) }}</span>
    </div>
    <div class="stat-row">
      <label for="">Углеводы:</label>
      <span>{{ toNum(product.carbohydrate_full_amount) }}</span>
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

const toNum = (x: any, add = '') => {
  let returnable = ''
  if (!x) return returnable
  if (typeof x === 'number') returnable = x.toFixed(0)
  if (typeof x === 'string') returnable = parseInt(x).toFixed(0)

  return add ? `${returnable} ${add}` : returnable
}
</script>

<style lang="scss" scoped>
.stat {
  margin: 24px 0 12px;
  text-align: left;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &-title {
    text-align: center;
    margin-bottom: 8px;

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
