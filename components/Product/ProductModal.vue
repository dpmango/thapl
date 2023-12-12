<template>
  <UiModal name="product" size="x-large" :padding="false">
    <div class="product">
      <UiLoader v-if="true" position="overlay" :loading="loading" />
      <div
        v-if="product && displayProduct"
        :class="['product__wrapper', product.suggest?.length && '_withSuggest']"
      >
        <div
          class="product__media hidden-md"
          :style="imageWidth ? { flexBasis: `${imageWidth}px` } : {}"
        >
          <div ref="imageRef" class="product__image">
            <UiImage
              :src="displayProduct.image"
              :alt="displayProduct.title"
              @load="handleImageLoad"
            />
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
                <UiAtomProductIcon :product="displayProduct" />
                <span v-if="countWithModifiersInCart" class="text-s fw-500 c-gray">
                  &nbsp;(В корзине уже {{ countWithModifiersInCart }})
                </span>
              </div>
              <div
                v-if="displayProduct.packing_weights.split(' ')[0][0] !== '0'"
                class="product__weight text-s c-gray"
              >
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
                v-if="displayModifiers?.length"
                ref="productModifiers"
                class="product__modifiers"
              >
                <div v-for="(group, idx) in displayModifiers" :key="idx" class="product__modifier">
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
                      Нужно выбрать {{ group.min_items }}
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
                      @click="changeModifier(option, idx, group.max_items === 1)"
                    >
                      <span class="mod-option__name">{{ option.title }}</span>
                      <span v-if="option.price" class="mod-option__price">
                        <template v-if="option.price > 0">+</template
                        >{{ formatPrice(option.price, 0, false) }}
                      </span>
                      <UiCheckbox
                        class="mod-option__radio"
                        :name="`mod_radio_${idx}`"
                        :error="modifierErrors.includes(idx)"
                        :type="group.max_items === 1 ? 'checkbox' : 'radio'"
                        :checked="modifierGroups.some((x) => x.id === option.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="product && product.suggest?.length" class="product__suggest _md">
                <div class="product__suggest-title h6-title">Рекомендуем попробовать</div>

                <UiLibSwiper class="product__suggest-list" :params="swiperParams">
                  <SwiperSlide v-for="(card, idx) in product.suggest" :key="idx">
                    <ProductCardAddon :product="card" :is-display-mode="true" />
                  </SwiperSlide>
                </UiLibSwiper>
              </div>
            </div>
          </div>
          <div class="product__cta">
            <p
              v-if="noRequiredModifiersAvailable"
              class="product__cta-disabled text-l fw-500 c-red"
            >
              К сожалению эта позиция недоступна
            </p>
            <ProductCardAddToCart
              v-else-if="isCardEnabled"
              :product="displayProduct"
              :modifiers="modifierGroups"
              btn-theme="primary"
              :should-emit="hasUnselectedModifiers"
              @on-before-add="showModifiersToast"
            >
              В корзину &bull; {{ productPriceLabel }}
              <template v-if="product.old_price">
                &bull;&nbsp;
                <span class="product__old-price">{{ formatPrice(product.old_price) }}</span>
              </template>
            </ProductCardAddToCart>
          </div>
        </div>
      </div>

      <div v-if="product && product.suggest?.length" class="product__suggest">
        <div class="product__suggest-title h6-title">Рекомендуем попробовать</div>

        <UiLibSwiper class="product__suggest-list" :params="swiperParams">
          <SwiperSlide v-for="(card, idx) in product.suggest" :key="idx">
            <ProductCardAddon :product="card" :is-display-mode="true" />
          </SwiperSlide>
        </UiLibSwiper>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { SwiperSlide } from 'swiper/vue'
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
const { modal, modalParams } = storeToRefs(ui)

const product = ref(null) as Ref<IProductFullDto | null>
const productChildrenShown = ref(null) as Ref<IProduct | null>
const loading = ref(false)

const swiperParams = {
  slidesPerView: 'auto',
  spaceBetween: 16,
  threshold: 3,
  preventClicks: true,
  touchEventsTarget: 'container',
  freeMode: {
    enabled: true,
    sticky: false,
  },
  mousewheel: {
    forceToAxis: true,
    releaseOnEdges: true,
    sensitivity: 0.7,
  },
}

const displayProduct = computed(() => {
  return productChildrenShown.value || product.value
})

const isCardEnabled = computed(() => {
  return !modalParams.value?.isGift
})

interface IModifierItemGrouped extends ICartModifier {
  groupID: number
}

const modifierGroups = ref([]) as Ref<IModifierItemGrouped[]>

const { productPriceLabel } = useProductHelpers({ product: displayProduct, modifierGroups })
const { zoneData } = useCheckout()

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
const modifiersWithStopList = computed(() => {
  const groups = displayProduct.value?.modifier_groups || []
  if (!zoneData.value.organization?.modifiers_stop_list) return groups

  return groups.map((g) => ({
    ...g,
    items: g.items.filter((i) => !zoneData.value.organization?.modifiers_stop_list.includes(i.id)),
  }))
})

const displayModifiers = computed(() => {
  return modifiersWithStopList.value.filter((x) => x.items.length)
})

const noRequiredModifiersAvailable = computed(() => {
  let condition = false

  const modifierGroups = displayProduct.value?.modifier_groups
  const modifierStops = zoneData.value.organization?.modifiers_stop_list

  if (modifierGroups?.length && modifierStops?.length) {
    modifierGroups?.forEach((group) => {
      if (group.min_items !== 0) {
        const groupItemIds = group.items.map((x) => x.id)
        condition = groupItemIds.every((id) => modifierStops.includes(id))
      }
    })
  }

  return condition
})

const modifierErrors = ref([]) as Ref<number[]>
const modifierShowErorrs = ref(false)

const changeModifier = (opt, groupID, isRadio) => {
  const hasAdded = modifierGroups.value.some((x) => x.id === opt.id && x.groupID === groupID)
  const groupData = modifierGroups.value.find((x) => x.groupID === groupID)
  const hasGroup = !!groupData

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
  if (displayModifiers.value.length) {
    displayModifiers.value.forEach((group, idx) => {
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
    // router.push({ hash: `#${data.id.toString()}` })

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
    imageHeight.value = 500
    imageWidth.value = null

    nextTick(() => {
      if (!imageRef.value) return
      const imgHeight = imageRef.value.offsetHeight
      const imgElement = imageRef.value.querySelector('img')

      imageHeight.value = imgHeight ? imgHeight + 40 + 40 : 500

      if (imgElement) {
        const imgW = imgElement.offsetWidth + 40 * 2
        imageWidth.value = imgW || null
      }
    })
  },
  100,
  { leading: true }
)

const handleImageLoad = () => {
  setScrollerHeight()
}

onMounted(() => {
  // const hashID = route.hash.slice(1, route.hash.length)
  // if (hashID && isFinite(parseInt(hashID))) {
  //   ui.setModal({ name: 'product', params: { id: +hashID, critical: null } })
  // }

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
          product.value = { ...params.critical }
          productChildrenShown.value = null
        }

        fetchProduct(params.id)
      }
    } else {
      setTimeout(() => {
        product.value = null
        productChildrenShown.value = null
        // router.push({ hash: '' })
      }, 250)
    }
  }
)

watch(
  () => imageRef.value,
  (newVal) => {
    if (newVal) {
      setScrollerHeight()
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
    &._withSuggest {
      max-height: calc(100vh - 164px - 40px);
    }
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
  &__old-price {
    text-decoration: line-through;
    opacity: 0.5;
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
  &__cta-disabled {
    text-align: center;
  }

  &__suggest {
    padding: 20px 24px 24px;
    background: var(--color-bg);
    overflow: hidden;
    &._md {
      display: none;
    }
  }
  &__suggest-title {
  }
  &__suggest-list {
    overflow: visible;
    margin-top: 16px;
    .swiper-wrapper {
      overflow: visible;
    }
    .swiper-slide {
      width: 260px;
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
      &._withSuggest {
        max-height: 100%;
      }
    }
    &__image {
      max-height: 100%;
    }
    &__scrolling {
      padding: 24px 24px 124px;
      overflow: hidden;
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
    &__suggest {
      display: none;
      margin-left: -24px;
      margin-right: -24px;
      padding: 16px;
      &._md {
        display: block;
      }
    }
    &__suggest-title {
      font-size: 14px;
    }
    &__suggest-list {
      margin-top: 12px;
      .swiper-slide {
        width: 220px;
      }
    }
  }
}
</style>
