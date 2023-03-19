<template>
  <UiModal name="region" size="large">
    <div class="region">
      <div class="h2-title">Выберите город</div>
      <div class="region__form">
        <UiInput
          name="region"
          type="text"
          placeholder="Поиск"
          icon="search"
          icon-position="left"
          :value="search"
          :error="errors.search"
          @on-change="(v) => setFieldValue('search', v)"
        />
      </div>

      <div class="region__list">
        <li v-for="region in filteredList">
          <a :href="`https://${region.domain}`" @click="(e) => handleRegionSelect(region, e)">
            {{ region.title }}
          </a>
        </li>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { useDeliveryStore } from '~/store'

const { $env } = useNuxtApp()
const regionCookie = useCookieState('x-thapl-region-id')
const deliveryStore = useDeliveryStore()

const loading = ref(false)

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { search: '' },
})

const { value: search } = useField<string>('search')

const handleRegionSelect = (region, e) => {
  e.preventDefault()

  regionCookie.value = region.id

  if (region.domain) {
    window.location.href = region.domain
  } else {
    window.location.reload()
  }
}

const filteredList = computed(() => {
  const searchStr = search.value.trim().toLowerCase()
  return deliveryStore.regions.filter((x) => x.title.toLowerCase().includes(searchStr))
})
</script>

<style lang="scss" scoped>
.region {
  &__title {
  }
  &__form {
    margin-top: 28px;
  }
  &__list {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    li {
      margin-bottom: 24px;
    }
    a {
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
</style>
