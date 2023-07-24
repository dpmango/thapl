<template>
  <UiModal name="product" size="x-large" :padding="false">
    <div class="product">
      <UiLoader v-if="true" position="overlay" :loading="loading" />
      <div v-if="product && displayProduct" class="product__wrapper">
        <div
          class="product__media hidden-md"
          :style="imageWidth ? { flexBasis: `${imageWidth}px` } : {}"
        >
          <div ref="imageRef" class="product__image">
            <UiImage :src="displayProduct.image" :alt="displayProduct.title" />
          </div>
        </div>
        <div
          class="product__body"
          :style="{
            maxHeight: `${imageHeight}px`,
            ...(imageWidth ? { flexBasis: `calc(100% - ${imageWidth}px)` } : {}),
          }"
        >
          <div class="product__scrolling-wrap">
            <div class="product__scrolling">
              <div class="product__title h4-title">
                <UiAtomLongWords :text="displayProduct.title" />&nbsp;
                <span v-if="displayProduct.is_hot">🌶</span>
                <span v-if="countWithModifiersInCart" class="text-s fw-500 c-gray">
                  &nbsp;(В корзине уже {{ countWithModifiersInCart }})
                </span>
              </div>
              <div class="product__weight text-s c-gray">
                {{ displayProduct.packing_weights }}
              </div>

              <div class="product__media visible-md">
                <div class="product__image">
                  <UiImage :src="displayProduct.image" :alt="displayProduct.title" />
                </div>
              </div>

              <div class="product__description text-s">
                {{ displayProduct.description }}
              </div>

              <template v-if="product.variants?.length">
                <UiToggle
                  v-for="(variant, idx) in product.variants"
                  :key="idx"
                  class="product__options"
                  :label="product.title"
                  :autosize="true"
                  size="small"
                  :list="variant.variants.map((x) => ({ id: x.id, label: x.title }))"
                  :value="selectedVariants[idx]"
                  @on-change="(v) => selectVariant(idx, v)"
                />
              </template>

              <ProductCardEnergyStats :product="displayProduct" class="card__stat" />

              <div
                v-if="displayProduct.modifier_groups?.length"
                ref="productModifiers"
                class="product__modifiers"
              >
                <div
                  v-for="(group, idx) in displayProduct.modifier_groups"
                  :key="idx"
                  class="product__modifier"
                >
                  <div class="h6-title">{{ group.title }}</div>

                  <div
                    class="product__modifier-note text-xs c-gray"
                    :class="[modifierShowErorrs && modifierErrors.includes(idx) && 'c-red _error']"
                  >
                    <template v-if="group.min_items === 0">
                      Опционально, максимум {{ group.max_items }}
                      {{ Plurize(group.max_items, 'ингредиент', 'ингредиента', 'ингредиентов') }}
                    </template>
                    <template v-else-if="group.min_items === group.max_items">
                      Нужно выбрать минимум {{ group.min_items }}
                      {{ Plurize(group.min_items, 'ингредиент', 'ингредиента', 'ингредиентов') }}
                    </template>
                    <template v-else>
                      Нужно выбрать от {{ group.min_items }} до
                      {{ group.max_items }} ингредиентов</template
                    >
                  </div>
                  <div class="product__modifier-list">
                    <div
                      v-for="option in group.items"
                      :key="option.id"
                      class="product__modifier-option mod-option text-m"
                      @click="changeModifier(option, idx, group.min_items > 0)"
                    >
                      <span class="mod-option__name">{{ option.title }}</span>
                      <span v-if="option.price" class="mod-option__price">
                        +{{ formatPrice(option.price, 0, false) }}
                      </span>
                      <UiCheckbox
                        class="mod-option__radio"
                        :name="`mod_radio_${idx}`"
                        :error="modifierErrors.includes(idx)"
                        :type="group.min_items > 0 ? 'radio' : 'checkbox'"
                        :checked="modifierGroups.some((x) => x.id === option.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="product__cta">
            <ProductCardAddToCart
              :product="displayProduct"
              :modifiers="modifierGroups"
              btn-theme="primary"
              :should-emit="hasUnselectedModifiers"
              @on-before-add="showModifiersToast"
            >
              В корзину &bull; {{ formatPrice(priceWithModifiers) }}
            </ProductCardAddToCart>
          </div>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useCartStore, useUiStore } from '~/store'
import { IProduct, ICartModifier, IProductFullDto } from '~/interface'
import { formatPrice, Plurize } from '#imports'

const { $env, $log } = useNuxtApp()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const ui = useUiStore()
const cartStore = useCartStore()
const { cart, productsCountInCart } = storeToRefs(cartStore)
const { modal } = storeToRefs(ui)

const product = ref(null) as Ref<IProductFullDto | null>
const productChildrenShown = ref(null) as Ref<IProduct | null>
const loading = ref(false)

const displayProduct = computed(() => {
  return productChildrenShown.value || product.value
})

// работа с определением представления товара (variants / options)
const selectedVariants = ref([0, 0, 0])

const computeChildrenElement = () => {
  const computedVariantId = selectedVariants.value.filter((x) => x).join('.')
  const targetId = product.value?.options
    ?.find((x) => x.id === computedVariantId)
    ?.catalog_item_id.toString()
  if (!targetId) return
  const childrenElement = product.value?.children?.find((x) => x.id.toString() === targetId)

  if (!childrenElement) return
  productChildrenShown.value = { ...childrenElement }
  nextTick(() => {
    setScrollerHeight()
  })
}

const selectVariant = (groupId, v) => {
  selectedVariants.value[groupId] = v
  computeChildrenElement()
  resetModifiers()
}

// модификаторы товара
interface IModifierItemGrouped extends ICartModifier {
  groupID: number
}

const modifierGroups = ref([]) as Ref<IModifierItemGrouped[]>
const modifierErrors = ref([]) as Ref<number[]>
const modifierShowErorrs = ref(false)

const priceWithModifiers = computed(() => {
  if (!displayProduct.value) return 0
  let price = displayProduct.value.price

  if (modifierGroups.value.length) {
    modifierGroups.value.forEach((x) => {
      price += x.price
    })
  }

  return price
})

const changeModifier = (opt, groupID, isRadio) => {
  const hasAdded = modifierGroups.value.some((x) => x.id === opt.id && x.groupID === groupID)
  const hasGroup = modifierGroups.value.some((x) => x.groupID === groupID)

  // радиокнопки и группа
  if (isRadio && hasGroup) {
    modifierGroups.value = modifierGroups.value.map((x) => {
      return x.groupID === groupID ? { ...opt, groupID } : x
    })

    return
  } else if (hasAdded) {
    // чекбоксы (removeCurrent)
    modifierGroups.value = modifierGroups.value.filter((x) => {
      // sort only in current group
      if (x.groupID === groupID) {
        return x.id !== opt.id
      }

      return true
    })
    return
  }

  modifierGroups.value = [...modifierGroups.value, { ...opt, groupID }]
}

const validateModifiers = () => {
  const errors = [] as number[]
  if (displayProduct.value?.modifier_groups) {
    displayProduct.value?.modifier_groups.forEach((group, idx) => {
      const itemsInGroup = modifierGroups.value.filter((x) => x.groupID === idx)

      if (itemsInGroup.length > group.max_items) {
        errors.push(idx)
      } else if (itemsInGroup.length < group.min_items) {
        errors.push(idx)
      }
    })
  }

  if (errors.length === 0) {
    modifierShowErorrs.value = false
  }

  modifierErrors.value = [...errors]
  return errors
}

const resetModifiers = () => {
  modifierGroups.value = []
  modifierErrors.value = []
  modifierShowErorrs.value = false
}

const hasUnselectedModifiers = computed(() => {
  const errors = validateModifiers()
  return !!errors.length
})

const productModifiers = ref<HTMLElement | null>(null)

const showModifiersToast = () => {
  modifierShowErorrs.value = true

  let scrollerRef
  if (window.innerWidth < 768) {
    scrollerRef = document.querySelector('.modal._active .modal__content')
  } else {
    scrollerRef = document.querySelector('.modal._active .product__scrolling-wrap')
  }

  if (productModifiers.value && scrollerRef) {
    const targetTop =
      productModifiers.value.getBoundingClientRect().top - scrollerRef.getBoundingClientRect().top

    // toast.error('Выберите параметры блюда')
    scrollWithSpeed(targetTop, 300, scrollerRef)
  }
}

const countWithModifiersInCart = computed(() => {
  if (!displayProduct.value?.id) return 0

  return productsCountInCart.value(displayProduct.value?.id)
})

const fetchProduct = async (id) => {
  if (!modal.value.includes('product')) return

  modifierGroups.value = []
  modifierErrors.value = []
  modifierShowErorrs.value = false

  loading.value = true
  const data = (await useApi('catalog/get-item-data', {
    method: 'GET',
    headers: useHeaders(),
    params: { id },
  }).catch(useCatchError)) as IProductFullDto

  $log.log('opened product', { data })

  if (data) {
    product.value = { ...data }
    setScrollerHeight()
    router.push({ hash: `#${data.id.toString()}` })

    if (data.variants?.length) {
      selectedVariants.value = data.variants.map((x) => x.variants[0].id)
      computeChildrenElement()
    }

    if (window && window.dataLayer) {
      window.dataLayer.push({
        ecommerce: {
          currencyCode: 'RUB',
          detail: {
            products: [
              {
                id: data.id,
              },
            ],
          },
        },
      })
    }
  } else {
    ui.closeAllModals()
  }

  loading.value = false
}

// резайс по параметрам изобржения
const imageRef = ref<HTMLElement | null>(null)
const imageHeight = ref(500)
const imageWidth = ref<number | null>(null)

const setScrollerHeight = debounce(
  () => {
    if (imageRef.value) {
      imageHeight.value = 500
      imageWidth.value = null

      nextTick(() => {
        if (!imageRef.value) return
        const imgHeight = imageRef.value.offsetHeight
        const imgElement = imageRef.value.querySelector('img')

        imageHeight.value = imgHeight ? imgHeight + 40 + 40 : 0

        if (imgElement) {
          const imgW = imgElement.offsetWidth + 40 * 2
          imageWidth.value = imgW || null
        }
      })
    }
  },
  100,
  { leading: true }
)

onMounted(() => {
  const hashID = route.hash.slice(1, route.hash.length)
  if (hashID && isFinite(parseInt(hashID))) {
    ui.setModal({ name: 'product', params: { id: +hashID, critical: null } })
  }

  setScrollerHeight()
  window.addEventListener('resize', setScrollerHeight, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setScrollerHeight, true)
})

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
          productChildrenShown.value = null
        }

        fetchProduct(params.id)
      }
    } else {
      setTimeout(() => {
        product.value = null
        productChildrenShown.value = null
        // const oldScrollPosition =
        //   window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        // router.replace({ hash: '' })
        // document.documentElement.scrollTop(0, oldScrollPosition)
      }, 250)
    }
  }
)
</script>

<style lang="scss" scoped>
.product {
  position: relative;
  margin: auto 0;
  min-height: 1px;
  display: flex;
  flex-direction: column;
  position: relative;
  &__wrapper {
    flex: 1 0 auto;
    display: flex;
    min-height: 1px;
    max-height: calc(100vh - 120px - 40px);
  }
  &__media {
    flex: 0 0 62.5%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 40px 32px;
  }
  &__image {
    position: relative;
    z-index: 1;
    width: 100%;
    border-radius: var(--card-border-radius);
    font-size: 0;
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-height: calc(100vh - 120px - 40px);
    overflow: hidden;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  &__body {
    position: relative;
    z-index: 1;
    flex: 0 0 37.5%;
    min-width: 1px;
    min-height: 1px;
    display: flex;
    flex-direction: column;
    background: var(--color-bg);
  }
  &__scrolling {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 32px 32px 0;
  }
  &__scrolling-wrap {
    flex: 0 1 auto;
    overflow-y: auto;
    height: 100%;
    min-height: 1px;
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
    .h6-title {
      text-transform: uppercase;
    }
    & + & {
      margin-top: 24px;
    }
  }
  &__modifier-note {
    margin-top: 12px;
    background: var(--color-bg-darken);
    border-radius: 8px;
    font-weight: 500;
    line-height: 1.7;
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
    text-transform: capitalize;
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
    position: static;
    &__wrapper {
      max-height: 100%;
    }
    &__image {
      max-height: 100%;
    }
    &__scrolling {
      padding: 24px 24px 124px;
    }
    &__media {
      margin: 20px auto;
      flex: 0 0 auto;
      padding: 0;
    }
    &__body {
      position: static;
      flex: 0 0 100% !important;
      max-height: 100% !important;
      overflow: hidden;
      background: transparent;
    }
    &__cta {
      z-index: 3;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 24px;
      box-shadow: var(--box-shadow-extra-large);
      background: transaprent;
      will-change: transform;
      backface-visibility: hidden;
      transform: translate3d(0, 0, 0.001);
    }
  }
}
</style>
