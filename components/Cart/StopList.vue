<template>
  <UiModal name="stoplist">
    <div class="stoplist">
      <div class="h2-title">Закончилось</div>

      <div class="stoplist__list">
        <ProductCardAddon
          v-for="(product, idx) in stopedItems"
          :key="idx"
          :product="product"
          :stoplisted="true"
        />
      </div>

      <div class="stoplist__cta">
        <UiButton @click="removeStoppedItems">Хорошо, удалить</UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore, useUiStore } from '~/store'

const { $env, $log } = useNuxtApp()

const cartStore = useCartStore()
const ui = useUiStore()

const { modal, modalParams } = storeToRefs(ui)
const { cart, products } = storeToRefs(cartStore)

const stopedItems = computed(() => {
  if (modalParams.value?.ids) {
    return modalParams.value?.ids.map((id) => products.value?.find((x) => x.id === id))
  }
  return []
})

const removeStoppedItems = () => {
  const ids = modalParams.value?.ids

  ids.forEach((id) => {
    cartStore.removeFromCart(id)
  })

  ui.closeModal()
}

watch(
  () => modal.value,
  (newModals) => {
    if (newModals.includes('stoplist')) {
      // const res = await useApi('catalog/get-catalog-items-by-ids', {
      //   method: 'POST',
      //   headers: useHeaders(),
      //   body: {
      //     ids: cart.value.map((x) => x.id),
      //   },
      // })
      //   res.forEach((product) => {
      //     cartStore.hydrateProducts(product)
      //   })
    }
  }
)

onMounted(() => {})
</script>

<style lang="scss" scoped>
.stoplist {
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
