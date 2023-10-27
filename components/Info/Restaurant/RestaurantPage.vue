<template>
  <div class="container _narrow">
    <div v-if="data.tags" class="page__tags">
      <UiButton v-for="tag in data.tags" :key="tag.slug" size="small">{{ tag.slug }}</UiButton>
    </div>

    <div v-if="contactsList.length" class="page__contacts">
      <div class="row">
        <div v-for="(contact, idx) in contactsList" :key="idx" class="col col-6 col-md-12">
          <component
            :is="contact.isPhone ? 'a' : 'div'"
            class="contact"
            :href="
              contact.isPhone ? `tel:${contact.value.replace(/\s/g, '').replaceAll('-', '')}` : ''
            "
          >
            <div class="contact__label text-s c-gray">{{ contact.label }}</div>
            <div class="contact__value text-xl">{{ contact.value }}</div>

            <UiButton
              v-if="contact.isAddress"
              theme="secondary"
              :loading="geolocationLoading"
              @click="getUserLocation"
            >
              Проложить маршрут
            </UiButton>
          </component>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div v-if="data.lat && data.lng" class="page__map">
      <ClientOnly>
        <YandexMap
          :coordinates="[data.lat, data.lng]"
          :zoom="15"
          :controls="['zoomControl']"
          :scroll-zoom="false"
          @created="onMapCreated"
        >
          <YandexMarker :marker-id="data.id" :coordinates="[data.lat, data.lng]">
            <template #component>
              <div class="text-m">{{ data.address }}</div>
            </template>
          </YandexMarker>
        </YandexMap>
      </ClientOnly>
    </div>

    <div v-if="data.image" class="page__image">
      <img :src="data.image" :alt="data.title || ''" />
    </div>
  </div>

  <div class="container _narrow">
    <div class="page__content">
      <ContentUniversal v-if="data.content_data?.blocks" :blocks="data.content_data?.blocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IRestaurantPageDto, IGeoCoords } from '~/interface'

const props = withDefaults(defineProps<{ data: IRestaurantPageDto }>(), {
  data: () => ({} as IRestaurantPageDto),
})

// карта
let mapInstance = null as any

const onMapCreated = (e) => {
  mapInstance = e
}

// списки
const contactsList = computed(() => {
  const contactsArr = [] as {
    label: string
    value: string
    isPhone?: boolean
    isAddress?: boolean
  }[]

  const { phone, working_hours, address } = props.data

  if (phone) {
    contactsArr.push({
      label: 'Телефон',
      value: phone,
      isPhone: true,
    })
  }

  if (working_hours) {
    contactsArr.push({
      label: 'Часы работы',
      value: working_hours,
    })
  }

  if (address) {
    contactsArr.push({
      label: 'Адрес',
      value: address,
      isAddress: true,
    })
  }

  // if (working_hours) {
  //   contactsArr.push({
  //     label: 'Бронирование',
  //     value: working_hours,
  //   })
  // }

  return contactsArr
})

// геолокация
const onGeolocationSuccess = ({ latitude, longitude }: IGeoCoords) => {
  if (!window.ymaps || !mapInstance) return

  try {
    // @ts-ignore
    const route = new window.ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [
          [latitude, longitude],
          [props.data.lat, props.data.lng],
        ],
        params: {
          results: 2,
        },
      },
      {
        boundsAutoApply: true,
      }
    )

    mapInstance.geoObjects.removeAll()
    mapInstance.geoObjects.add(route)
  } catch {
    geolocationFailure({ code: 500 })
  }
}

const { geolocationLoading, getUserLocation, geolocationFailure } = useGeolocation({
  onGeolocationSuccess,
})
</script>

<style lang="scss" scoped>
.page {
  &__contacts {
    margin: 36px 0 -36px;
  }
  &__image {
    position: relative;
    z-index: 1;
    margin: 36px 0;
    border-radius: var(--card-border-radius);
    overflow: hidden;
    font-size: 0;
    img {
      max-width: 100%;
    }
  }

  &__map {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    border-radius: var(--map-border-radius);
    overflow: hidden;
    height: 360px;
    margin: 36px 0;
    background: var(--color-bg);
    > section {
      flex: 1 1 auto;
      height: 100%;
    }
    :deep(.yandex-balloon) {
      width: 160px;
      height: 84px;
    }
  }
}

.contact {
  margin-bottom: 36px;
  &__value {
    margin-top: 8px;
  }
  button {
    margin-top: 20px;
  }
}

a.contact {
  transition: color 0.25s $ease;
  &:hover {
    color: var(--color-primary);
  }
}
</style>
