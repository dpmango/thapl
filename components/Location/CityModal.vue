<template>
  <UiModal name="city" size="large">
    <div class="city">
      <div class="h2-title">Выберите город</div>
      <div class="city__form">
        <UiInput
          name="city"
          type="text"
          placeholder="Поиск"
          icon="search"
          icon-position="left"
          :value="search"
          :error="errors.search"
          @on-change="(v) => setFieldValue('search', v)"
        />
      </div>

      <div class="city__list">
        <li v-for="link in filteredList">
          <a :href="`https://${link.domain}`">{{ link.title }}</a>
        </li>
      </div>
    </div>
  </UiModal>
</template>

<script setup>
import { useField, useForm } from 'vee-validate'
import { useCartStore } from '~/store'

const loading = ref(false)

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { search: '' },
})

const { value: search } = useField('search')

const { data: regionsData, error: regionsError } = await useAsyncData('regions', () =>
  useApi('organization/get-regions', {
    method: 'GET',
    headers: useHeaders(),
  })
)

const filteredList = computed(() => {
  const searchStr = search.value.trim().toLowerCase()
  return regionsData.value.filter((x) => x.title.toLowerCase().includes(searchStr))
})
</script>

<style lang="scss" scoped>
.city {
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
