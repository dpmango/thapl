<template>
  <UiModal name="address" size="large">
    <div class="address">
      <div class="address__head">
        <div class="h2-title">Куда доставить?</div>
      </div>

      <div class="address__form">
        <UiInput
          name="address"
          type="text"
          placeholder="Укажите новый адрес"
          icon="location"
          icon-position="left"
          :value="search"
          :error="errors.search"
          @on-change="(v) => setFieldValue('search', v)"
        />
      </div>

      <div class="address__list"></div>
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

// console.log({ regionsData })
</script>

<style lang="scss" scoped>
.address {
  &__title {
  }
  &__form {
    margin-top: 28px;
  }
}
</style>
