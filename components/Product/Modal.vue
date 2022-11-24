<template>
  <UiModal name="product" size="x-large" :padding="false">
    <div class="product">
      <UiLoader v-if="true" position="overlay" :loading="loading" />
      <div v-if="product" class="product__wrapper">
        <div class="product__media hidden-md">
          <div class="product__image">
            <UiAtomProductImage :src="product.image" :alt="product.title" />
          </div>
        </div>
        <div class="product__body">
          <div class="product__scroller">
            <div class="product__title h4-title">
              <UiAtomLongWords :text="product.title" />&nbsp;
              <span v-if="product.is_hot">🌶</span>
            </div>
            <div class="product__weight text-s c-gray">
              {{ product.packing_weights }}
            </div>

            <div class="product__media visible-md">
              <div class="product__image">
                <UiAtomProductImage :src="product.image" :alt="product.title" />
              </div>
            </div>

            <div class="product__description text-s">
              {{ product.description }}
            </div>

            <!-- <UiToggle
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
            /> -->

            <div v-if="product.modifier_groups?.length" class="product__modifiers">
              <div
                v-for="(group, idx) in product.modifier_groups"
                :key="idx"
                class="product__modifier"
              >
                <div class="h6-title">{{ group.title }}</div>
                <div class="product__modifier-note text-xs c-gray">
                  Нужно выбрать от {{ group.min_items }} до {{ group.max_items }} ингредиентов
                </div>
                <div class="product__modifier-list">
                  <div
                    v-for="option in group.items"
                    :key="option.id"
                    class="product__modifier-option mod-option text-m"
                    @click="changeModifier(option)"
                  >
                    <span class="mod-option__name">{{ option.title }}</span>
                    <span class="mod-option__price">{{ formatPrice(option.price) }} ₽</span>
                    <UiCheckbox
                      class="mod-option__radio"
                      type="radio"
                      :checked="modifierGroups.some((x) => x.id === option.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="product__cta">
            <ProductCardAddToCart
              :product="product"
              :modifiers="modifierGroups"
              btn-theme="primary"
              :should-emit="false"
            >
              В корзину &bull; {{ priceWithModifiers }} ₽
            </ProductCardAddToCart>
          </div>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup>
import { useUiStore } from '~/store'
import { formatPrice } from '#imports'

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

// модификаторы товара
const modifierGroups = ref([])

const priceWithModifiers = computed(() => {
  let price = product.value.price

  if (modifierGroups.value.length) {
    modifierGroups.value.forEach((x) => {
      price += x.price
    })
  }

  return price
})

// TODO - валдиация обязательный выбор
const changeModifier = (opt) => {
  if (modifierGroups.value.some((x) => x.id === opt.id)) {
    modifierGroups.value = modifierGroups.value.filter((x) => x.id === opt.id)
  } else {
    modifierGroups.value = [opt]
  }
}

const fetchProduct = async (id) => {
  loading.value = true
  const data = await useApi('catalog/get-item-data', {
    method: 'GET',
    headers: useHeaders(),
    params: { id },
  }).catch(useCatchError)

  $log.log('opened product', { data })

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
    width: 100%;
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
  &__title {
    word-break: break-word;
  }
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
  // &__modifiers{}
  &__modifier {
    margin: 12px 0;
  }
  &__modifier-note {
    margin-top: 12px;
    background: var(--color-bg-darken);
    border-radius: 8px;
    font-weight: 500;
    padding: 8px 12px;
  }
  &__modifier-list {
    margin-top: 16px;
  }
  &__modifier-option {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
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
      width: 100%;
      background: var(--color-bg-darken);
    }
  }
}

.mod-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  &__name {
    display: inline-block;
    flex: 1 1 auto;
    padding-right: 16px;
  }
  &__price {
    display: inline-block;
    font-weight: 500;
    color: var(--color-primary);
    flex: 0 0 auto;
  }
  &__radio {
    flex: 0 0 auto;
    margin-left: 12px;
  }
}

@include r(1120) {
  .product {
    &__title {
      padding-right: 30px;
    }
  }
}

@include r($lg) {
  .product {
    &__media {
      flex: 0 0 55%;
      padding: 32px;
    }
    &__body {
      flex: 0 0 45%;
    }
  }
}

@include r($md) {
  .product {
    &__scroller {
      padding: 24px;
    }
    &__media {
      margin: 20px auto;
      padding: 0;
      max-width: 240px;
    }
    &__body {
      flex: 0 0 100%;
      background: transparent;
    }
    &__cta {
      padding: 16px 24px;
      box-shadow: var(--box-shadow-extra-large);
      background: transaprent;
    }
  }
}

@include r($sm) {
  .product {
    height: 100%;
    &__wrapper {
      height: 100%;
    }
  }
}
</style>
