<template>
  <div v-if="vartiantList.length" class="stat">
    <div class="stat-title">пищевая ценность:</div>
    <div class="stat__selector">
      <UiToggle
        :autosize="true"
        size="small"
        :list="vartiantList"
        :value="selectedVariant"
        @on-change="(v) => (selectedVariant = v)"
      />
    </div>
    <div v-for="(stat, idx) in dispayList" :key="idx" class="stat__row">
      <label for="">{{ stat.label }}</label>
      <span>{{ stat.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IToggleOption } from 'interface'
import { IProduct } from '~/interface/Product'
import { useUiStore } from '~/store'

const ui = useUiStore()

const props = defineProps({
  product: {
    type: Object as PropType<IProduct>,
    default: () => ({}),
  },
})

const selectedVariant = ref<'full' | '100g'>('full')

const vartiantList = computed(() => {
  const {
    energy_full_amount,
    fiber_full_amount,
    fat_full_amount,
    carbohydrate_full_amount,
    energy_amount,
    fiber_amount,
    fat_amount,
    carbohydrate_amount,
  } = props.product

  const hasFullStats =
    energy_full_amount || fiber_full_amount || fat_full_amount || carbohydrate_full_amount
  const has100Stats = energy_amount || fiber_amount || fat_amount || carbohydrate_amount

  const returnable = [] as IToggleOption[]

  if (hasFullStats) {
    returnable.push({ id: 'full', label: 'На порцию' })
  }
  if (has100Stats) {
    returnable.push({ id: '100g', label: 'На 100 г' })
  }

  return returnable
})

const dispayList = computed(() => {
  if (vartiantList.value.length === 0) return []

  if (selectedVariant.value === 'full') {
    return [
      { label: 'Энерг. ценность:', value: toNum(props.product.energy_full_amount, 'Ккал') },
      { label: 'Белки:', value: toNum(props.product.fiber_full_amount) },
      { label: 'Жиры:', value: toNum(props.product.fat_full_amount) },
      { label: 'Углеводы:', value: toNum(props.product.carbohydrate_full_amount) },
    ]
  } else if (selectedVariant.value === '100g') {
    return [
      { label: 'Энерг. ценность:', value: toNum(props.product.energy_amount, 'Ккал') },
      { label: 'Белки:', value: toNum(props.product.fiber_amount) },
      { label: 'Жиры:', value: toNum(props.product.fat_amount) },
      { label: 'Углеводы:', value: toNum(props.product.carbohydrate_amount) },
    ]
  }

  return []
})

watch(
  () => vartiantList.value,
  (newList) => {
    if (newList.length === 1) {
      selectedVariant.value = newList[0].id as 'full' | '100g'
    }
  }
)

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
  &__title {
    text-align: center;
    margin-bottom: 8px;
    text-transform: uppercase;
  }
  &__selector {
    margin-top: 12px;
    margin-bottom: 8px;
  }
  &__row {
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
