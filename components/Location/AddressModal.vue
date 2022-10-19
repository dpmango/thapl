<template>
  <UiModal name="address" size="large">
    <div class="address">
      <div class="address__head">
        <div class="h2-title">
          <template v-if="deliveryType === 1">Куда доставить?</template>
          <template v-else-if="deliveryType === 2">Откуда заберете?</template>
        </div>

        <UiToggle
          v-if="showOptions"
          class="address__toggle"
          :list="deliveryOptions"
          :value="deliveryType"
          @on-change="(v) => (deliveryType = v)"
        />
      </div>

      <div class="address__search">
        <UiInput
          name="address"
          type="text"
          :placeholder="placeholderText"
          icon="location"
          icon-position="left"
          :value="search"
          :error="errors.search"
          @on-change="handleSearchChange"
        />
      </div>

      <LocationAddressDelivery
        v-if="deliveryType === 1"
        class="address__delivery"
        @set-search="(v) => setFieldValue('search', v)"
      />

      <LocationAddressTakeaway v-if="deliveryType === 2" class="address__delivery" />
    </div>
  </UiModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { useDeliveryStore, useSessionStore } from '~/store'

const { $env } = useNuxtApp()

const session = useSessionStore()
const deliveryStore = useDeliveryStore()

const { app_settings } = storeToRefs(session)

const deliveryOptions = ref([
  { id: 1, label: 'Доставка' },
  { id: 2, label: 'Самовывоз' },
])

const showOptions = computed(() => {
  return app_settings.value.takeaway_enabled || !$env.takeawayOnly
})

const deliveryType = ref(showOptions.value ? 1 : 2)

const loading = ref(false)
const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { search: '' },
})

const { value: search } = useField('search')

const placeholderText = computed(() => {
  if (deliveryType.value === 1) {
    return 'Укажите новый адрес'
  } else if (deliveryType.value === 2) {
    return 'Найти ресторан'
  }

  return ''
})

const handleSearchChange = (v) => {
  setFieldValue('search', v)
  deliveryStore.setCurrentAddress(null)
}
</script>

<style lang="scss" scoped>
.address {
  // &__title {
  // }
  &__head {
    display: flex;
    align-items: center;
  }
  &__toggle {
    margin-left: auto;
    flex: 0 0 auto;
  }
  &__search {
    margin-top: 28px;
  }
  &__delivery {
    margin-top: 28px;
  }
}
</style>
