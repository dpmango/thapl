<template>
  <div class="container _narrow">
    <h1 class="h2-title title">
      Рестораны
      <template v-if="$env.useRegions">
        в&nbsp;
        <UiSelect
          theme="ghost"
          :value="region"
          :options="regionOptions"
          @on-select="(v) => (region = v)"
        />
      </template>
    </h1>

    <div v-if="list?.length" class="tags">
      <UiButton v-for="tag in allTags" :key="tag.slug" size="small">{{ tag.slug }}</UiButton>
    </div>
  </div>

  <div class="container">
    <div v-if="list?.length" class="map">
      <ClientOnly>
        <YandexMap
          :coordinates="centerCooridinates"
          :zoom="15"
          :controls="['zoomControl']"
          :scroll-zoom="false"
          @created="onMapCreated"
        >
          <YandexMarker
            v-for="marker in list"
            :key="marker.id"
            :marker-id="marker.id"
            :options="{
              iconLayout: 'default#image',
              iconImageHref: 'img/mapMarker.svg',
              iconImageSize: [28, 28],
              iconImageOffset: [-14, -14],
            }"
            :coordinates="[marker.lat, marker.lng]"
          >
            <template #component>
              <div v-if="marker.title" class="text-m fw-700">{{ marker.title }}</div>
              <div v-if="marker.address" class="text-s">{{ marker.address }}</div>
            </template>
          </YandexMarker>
        </YandexMap>
      </ClientOnly>
    </div>
  </div>

  <div class="addresses">
    <div class="container _narrow">
      <div class="addresses__search">
        <UiInput
          name="address"
          type="text"
          placeholder="Найти по названию"
          icon="search"
          icon-position="left"
          :value="search"
          :clearable="false"
          @on-change="handleSearchChange"
        />
      </div>
      <div class="addresses__list">
        <UiAtomAddressRow
          v-for="(restaurant, idx) in restaurantsSearched"
          :key="idx"
          modifier="large"
          :title="restaurant.title || restaurant.address"
          :description="[restaurant.phone, restaurant.working_hours]"
          @click="selectRestaurant(restaurant)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { IRestaurantDto, IRestaurantTag } from '~/interface/Dto/Restaurant.dto'
import { useDeliveryStore } from '~/store'

const { $env } = useNuxtApp()
const router = useRouter()

const deliveryStore = useDeliveryStore()
const { regions } = storeToRefs(deliveryStore)

const props = withDefaults(defineProps<{ list: IRestaurantDto[] | null }>(), {
  list: () => [],
})

// display

const allTags = computed(() => {
  let tags = [] as IRestaurantTag[]

  props.list?.forEach((x) => {
    tags = [...tags, ...x.tags]
  })

  return tags
})

let mapInstance = null as any

const onMapCreated = (e) => {
  mapInstance = e
  setTimeout(setBounds, 100)
  setTimeout(setBounds, 300)
}

const setBounds = () => {
  if (!mapInstance) return
  mapInstance.setBounds(mapInstance.geoObjects.getBounds())
  mapInstance.setZoom(mapInstance.getZoom() - 0.2)
}

const centerCooridinates = computed(() => {
  function getMiddle(prop, markers) {
    let values = markers.map((m) => m[prop])
    let min = Math.min(...values)
    let max = Math.max(...values)
    if (prop === 'lng' && max - min > 180) {
      values = values.map((val) => (val < max - 180 ? val + 360 : val))
      min = Math.min(...values)
      max = Math.max(...values)
    }
    let result = (min + max) / 2
    if (prop === 'lng' && result > 180) {
      result -= 360
    }
    return result
  }

  function findCenter(markers) {
    return {
      lat: getMiddle('lat', markers),
      lng: getMiddle('lng', markers),
    }
  }

  const centerFromList = findCenter(props.list)

  return [centerFromList.lat, centerFromList.lng]
})

// search
const search = ref('')
const handleSearchChange = (v) => {
  search.value = v
}

const restaurantsSearched = computed(() => {
  const searchStr = search.value.trim().toLowerCase()

  if (searchStr.length >= 2) {
    return props.list?.filter(
      (x) =>
        (x.title || '').toLowerCase().includes(searchStr) ||
        (x.address || '').toLowerCase().includes(searchStr)
    )
  }

  return props.list
})

const selectRestaurant = (e) => {
  router.push(`/restaurants/${e.id}`)
}

// region
const firstRegion = computed(() => {
  return regions.value[0]
})

const region = ref(
  firstRegion.value && { label: firstRegion.value.title, value: firstRegion.value.id }
)

const regionOptions = computed(() => {
  return regions.value.map((x) => ({ label: x.title, value: x.id }))
})
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
}

.map {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  border-radius: var(--map-border-radius);
  overflow: hidden;
  height: 520px;
  margin: 36px 0 60px;
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

.addresses {
  margin-top: 60px;
  &__search {
  }
  &__list {
    margin-top: 24px;
  }
}
</style>
