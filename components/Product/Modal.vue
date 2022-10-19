<template>
  <UiModal name="product" size="x-large" :padding="false">
    <div class="product">
      <UiLoader v-if="true" position="overlay" :loading="loading" />
      <div v-if="product" class="product__wrapper">
        <div class="product__media">
          <div class="product__image">
            <img :src="product.image" :alt="product.title" />
          </div>
        </div>
        <div class="product__body">
          <div class="product__scroller">
            <div class="product__title h4-title">
              <UiAtomLongWords :text="product.title" />
            </div>
            <div class="product__weight text-s c-gray">
              {{ product.packing_weights }}
            </div>
            <div class="product__description text-s">
              {{ product.description }}
            </div>

            <UiToggle
              class="product__options"
              :autosize="true"
              size="small"
              :list="optionsSizeList"
              :value="optionsSize"
              @on-change="(v) => (optionsSize = v)"
            />

            <UiToggle
              class="product__options"
              :autosize="true"
              size="small"
              :list="optionsModList"
              :value="optionsMod"
              @on-change="(v) => (optionsMod = v)"
            />
          </div>

          <div class="product__cta">
            <ProductCardAddToCart :product="product" btn-theme="primary" :should-emit="false">
              В корзину &bull; {{ product.price }} ₽
            </ProductCardAddToCart>
          </div>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup>
import { useUiStore } from '~/store'

const { $env, $log } = useNuxtApp()

const ui = useUiStore()

const product = ref(null)
const loading = ref(false)

const optionsSizeList = ref([
  { id: 1, label: 'Маленькая' },
  { id: 2, label: 'Средняя' },
  { id: 3, label: 'Большая' },
])

const optionsSize = ref(1)

const optionsModList = ref([
  { id: 1, label: 'Традиционное' },
  { id: 2, label: 'Тонкое' },
])

const optionsMod = ref(null)

const fetchProduct = async (id) => {
  loading.value = true
  const data = await useApi('catalog/get-item-data', {
    method: 'GET',
    headers: useHeaders(),
    params: { id },
  }).catch(useCatchError)

  if (data) {
    product.value = { ...data }
  }

  loading.value = false
}

watch(
  () => ui.modalParams,
  (params, prev) => {
    if (params) {
      if (params.id) {
        // Установка критичных параметров из того что было в карточке
        // и запрос на получение полных параметров
        if (params.critical) {
          $log.log('Opened with params', params)
          product.value = { ...params.critical }
        }

        fetchProduct(params.id)
      }
    } else {
      setTimeout(() => {
        product.value = null
      }, 250)
    }
  }
)
</script>

<style lang="scss" scoped>
.product {
  position: relative;
  &__wrapper {
    display: flex;
  }
  &__media {
    flex: 0 0 62.5%;
    padding: 48px;
  }
  &__image {
    position: relative;
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
    }
  }
  &__body {
    flex: 0 0 37.5%;
    min-width: 1px;
    display: flex;
    flex-direction: column;
    background: var(--color-bg);
  }
  &__scroller {
    flex: 1 0 auto;
    padding: 32px 32px 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  // &__title {
  //   word-break: break-all;
  // }
  &__weight {
    margin-top: 8px;
  }
  &__description {
    margin-top: 8px;
  }

  &__options {
    margin-top: 12px;
    background: var(--color-bg-darken);
  }
  &__cta {
    flex: 0 0 auto;
    padding: 24px 32px;
    background: var(--color-bg);
    :deep(button) {
      display: block;
      width: 100%;
    }
    :deep(.plusminus) {
      max-width: 100%;
      background: var(--color-bg-darken);
    }
  }
}
</style>
