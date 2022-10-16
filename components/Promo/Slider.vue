<template>
  <div v-if="slides && slides.length > 0" id="promo" class="promo" :class="modifiers">
    <div class="container">
      <UiLibSwiper class="promo__slider" :params="swiperParams">
        <SwiperSlide v-for="(slide, idx) in slides" :key="idx">
          <NuxtLink
            :to="`/promo/${slide.slug}`"
            class="promo__slide"
            :class="[viewedItems.includes(slide.slug) && '_viewed']"
          >
            <img class="promo__slide-bg" :src="slide.image" :alt="slide.title" />
          </NuxtLink>
        </SwiperSlide>
      </UiLibSwiper>
    </div>
  </div>
</template>

<script setup>
import { SwiperSlide } from 'swiper/vue'
import { localStorageGet } from '~/utils'

const props = defineProps({
  slides: {
    type: Array,
    default: () => [],
  },
})

const { $env } = useNuxtApp()
const listType = $env.promoListType
const modifiers = computed(() => [listType === 1 && '_wide', listType === 2 && '_narrow'])

const swiperParams = {
  slidesPerView: 'auto',
  spaceBetween: 32,
  centeredSlides: true,
  autoplay: { delay: 10000, pauseOnMouseEnter: true },
  pagination: {
    clickable: true,
  },
}

const viewedItems = ref([])

onMounted(() => {
  const stored = localStorageGet('viewedPromo') || []
  viewedItems.value = [...stored]
})
</script>

<style lang="scss" scoped>
.promo {
  margin: 32px 0px 60px;
  overflow: hidden;
  &__slider {
    overflow: visible;
    .swiper-wrapper {
      overflow: visible;
    }
  }
  &__slide {
    position: relative;
    height: var(--promo-height);
    border-radius: var(--card-border-radius);
    overflow: hidden;
  }
  &__slide-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg);
    object-fit: cover;
    object-position: left center;
  }
  &._wide {
    .promo {
      &__slider {
        :deep(.swiper-slide) {
          flex-basis: 100%;
          width: 100%;
        }
      }
    }
  }

  &._narrow {
    .promo {
      &__slider {
        :deep(.swiper-slide) {
          flex-basis: 268px;
          width: 268px;
        }
      }
      &__slide {
        border: 2px solid var(--color-primary);
        padding: 6px;
        &._viewed {
          border-color: transparent;
        }
      }
      &__slide-bg {
        top: 6px;
        left: 6px;
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        border-radius: var(--card-border-radius);
      }
    }
  }
}

@include r($md) {
  .promo {
    margin: 16px 0px 36px;
    &__slide {
      height: var(--promo-height-md);
    }
  }
}

@include r($sm) {
  .promo {
    &__slide {
      height: var(--promo-height-sm);
    }
  }
}
</style>
