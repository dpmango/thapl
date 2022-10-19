<template>
  <div
    class="card"
    :data-id="product.id"
    :class="[focused && '_focused']"
    @click="handleProductClick"
    @mouseenter="setFocused(true)"
    @mouseleave="setFocused(false)"
  >
    <div class="card__image">
      <img :src="product.image" :alt="product.title" />
      <div class="card__badges">
        <UiBadge v-for="tag in product.tags" :key="tag" theme="green" size="small">
          {{ tag }}
        </UiBadge>
      </div>
    </div>
    <div class="card__body">
      <div class="card__title h4-title">
        <UiAtomLongWords :text="product.title" />
      </div>
      <div class="card__description text-s c-gray">
        {{ product.description }}
      </div>
      <div
        class="card__actions"
        @click.stop
        @mouseenter="setFocused(false)"
        @mouseleave="setFocused(true)"
      >
        <div class="card__price text-l">{{ product.price }} ₽</div>

        <ProductCardAddToCart
          :product="product"
          btn-theme="secondary"
          @on-before-add="handleProductClick"
        >
          Выбрать
        </ProductCardAddToCart>
      </div>
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
  },
})

const handleProductClick = () => {
  ui.setModal({ name: 'product', params: { id: props.product.id, critical: props.product } })
}

// focus
const focused = ref(false)
const setFocused = (v) => {
  focused.value = v
}
</script>

<style lang="scss" scoped>
.card {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  &__image {
    position: relative;
    z-index: 1;
    border-radius: var(--card-border-radius);
    font-size: 0;
    padding-bottom: var(--product-card-ar);
    background: var(--color-bg);
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // max-width: auto;
      object-fit: cover;
      transition: transform 0.35s ease-out;
    }
  }
  &__badges {
    position: absolute;
    z-index: 2;
    top: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    .badge {
      margin-right: 4px;
    }
  }
  &__body {
    margin-top: 16px;
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
  }
  // &__title {
  //   word-break: break-all;
  // }
  &__description {
    margin-top: 12px;
  }
  &__actions {
    padding-top: 16px;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;
  }
  &__add {
    font-size: 0;
  }
  &._focused {
    .card__image img {
      transform: scale(1.04);
    }
  }
}
</style>
