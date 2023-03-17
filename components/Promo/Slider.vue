<template>
  <div v-if="slides?.length > 0" id="promo" class="promo" :class="modifiers">
    <div class="container">
      <UiLibSwiper class="promo__slider" :params="swiperParams">
        <SwiperSlide v-for="(slide, idx) in slides" :key="idx">
          <NuxtLink
            :to="slide.view_type === 1 ? `/promo/${slide.slug}` : '#'"
            class="promo__slide"
            :class="[viewedPromos.includes(slide.slug) && '_viewed']"
            @click="handleSlideClick(slide)"
          >
            <img class="promo__slide-bg" :src="slide.image" :alt="slide.title" />
          </NuxtLink>
        </SwiperSlide>
      </UiLibSwiper>
    </div>

    <PromoStories
      :stories="openedStories"
      :visible="storiesVisible"
      @on-close="() => (storiesVisible = false)"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { SwiperSlide } from 'swiper/vue'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { localStorageGet } from '#imports'
import { IPromoListDto, IStoriesDto, IPromoPageDto } from '~/interface/Promo'

const props = defineProps({
  slides: {
    type: Array as PropType<IPromoListDto[]>,
    default: () => [],
  },
})

const { $env } = useNuxtApp()
const toast = useToast()
const listType = $env.promoListType
const modifiers = computed(() => [listType === 1 && '_wide', listType === 2 && '_narrow'])

const swiperParams = {
  slidesPerView: 'auto',
  // spaceBetween: 32,
  centeredSlides: true,
  autoplay: { delay: 10000, pauseOnMouseEnter: true },
  pagination: {
    clickable: true,
  },
}

const viewedPromos = ref<string[]>([])

const storiesVisible = ref(false)
const openedStories = ref<IStoriesDto[]>([])

const handleSlideClick = async (slide: IPromoListDto) => {
  if (slide.view_type === 2) {
    const data = (await useApi('promo/get-page-data', {
      method: 'GET',
      headers: useHeaders(),
      params: {
        slug: slide.slug,
      },
    })) as IPromoPageDto

    if (data) {
      openedStories.value = data.stories_data || []
      storiesVisible.value = true
    } else {
      toast.error('Ошибка при открытии сторис. Попробуйте еще раз')
    }
  }
}
onMounted(() => {
  const stored = localStorageGet('viewedPromo') || []
  viewedPromos.value = [...stored]
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
          margin-right: 32px;
          &:last-child {
            margin-right: 0;
          }
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
          margin-right: 32px;
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
    &._wide,
    &._narrow {
      .promo__slide {
        height: var(--promo-height-md);
      }
    }
    &._narrow {
      .promo__slider {
        :deep(.swiper-slide) {
          flex-basis: 198px;
          width: 198px;
          margin-right: 24px;
        }
      }
    }
  }
}

@include r($sm) {
  .promo {
    &__slide {
      border-radius: var(--card-border-radius-sm);
    }

    &._wide,
    &._narrow {
      .promo__slide {
        height: var(--promo-height-sm);
      }
    }
    &._narrow {
      .promo {
        &__slider {
          :deep(.swiper-slide) {
            flex-basis: 108px;
            width: 108px;
            margin-right: 12px;
          }
        }
        &__slide {
          padding: 2px;
        }
        &__slide-bg {
          top: 2px;
          left: 2px;
          width: calc(100% - 4px);
          height: calc(100% - 4px);
          border-radius: 8px;
        }
      }
    }
  }
}
</style>
