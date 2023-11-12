<template>
  <UiModal name="gift">
    <div class="gift">
      <div class="h2-title">Выберите подарок</div>

      <div class="gift__list">
        <ProductCardAddon
          v-for="(product, idx) in promo?.gifts"
          :key="idx"
          :product="product"
          :gift="true"
          :gift-current="selectedId === product.id"
          @click="selectedId = product.id"
        />
      </div>

      <div class="gift__cta">
        <UiButton @click="handleSelect">Выбрать подарок</UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useCartStore, useUiStore } from '~/store'

const toast = useToast()
const cartStore = useCartStore()
const ui = useUiStore()

const { cart, promo, promoGiftId } = storeToRefs(cartStore)

const selectedId = ref<number | null>(promoGiftId.value)

const handleSelect = () => {
  if (selectedId.value) {
    promoGiftId.value = selectedId.value
    ui.closeModal()
  } else {
    toast.error('Выберите подарок')
  }
}
</script>

<style lang="scss" scoped>
.gift {
  flex: 1 1 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  &__list {
    margin: 24px 0 28px;
    .card {
      margin-bottom: 16px;
      text-align: left;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
