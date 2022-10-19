<template>
  <div class="checkout">
    <div class="container">
      <div class="checkout__wrapper row">
        <div class="checkout__main col">
          <h1 className="h2-title">Оформление заказа</h1>

          <div class="checkout__row row">
            <div class="col col-6 col-sm-12">
              <UiInput
                name="name"
                label="Имя"
                placeholder="Введите имя"
                :value="name"
                :error="errors.name"
                @on-change="(v) => setFieldValue('name', v)"
              />
            </div>

            <div class="col col-6 col-sm-12">
              <UiInput
                name="phone"
                type="tel"
                label="Телефон"
                placeholder="+7"
                :value="phone"
                mask="+7 (###) ###-##-##"
                :error="errors.phone"
                @on-change="(v) => setFieldValue('phone', v)"
              />
            </div>
          </div>

          <div class="checkout__row">
            <div class="ui-label">Способ связи</div>
            <div class="checkout__radio-grid">
              <UiCheckbox
                type="radio"
                :error="errors.contact"
                :checked="contact === 'phone'"
                @change="() => setFieldValue('contact', 'phone')"
              >
                Можно позвонить
              </UiCheckbox>
              <UiCheckbox
                type="radio"
                :error="errors.contact"
                :checked="contact === 'message'"
                @change="() => setFieldValue('contact', 'message')"
              >
                Только в сообщениях
              </UiCheckbox>
            </div>
          </div>

          <div class="checkout__row row">
            <div class="col col-12">
              <UiInput
                name="address"
                label="Адрес доставки"
                placeholder="Введите адрес"
                :disabled="true"
                :changable="true"
                :value="address"
                :error="errors.address"
                @on-change="(v) => setFieldValue('address', v)"
              />
            </div>
          </div>

          <div class="checkout__row">
            <div class="ui-label">Дата доставки</div>
            <div class="checkout__toggle-grid">
              <UiToggle
                :list="deliveryDateOptions"
                :value="deliveryDate"
                :error="errors.deliveryDate"
                @on-change="(v) => setFieldValue('deliveryDate', v)"
              />
            </div>
          </div>

          <div class="checkout__row">
            <div class="ui-label">Время доставки</div>
            <div class="checkout__toggle-grid">
              <UiToggle
                :list="deliveryTimeOptions"
                :value="deliveryTime"
                :error="errors.deliveryTime"
                @on-change="(v) => setFieldValue('deliveryTime', v)"
              />
            </div>
          </div>

          <div class="checkout__row">
            <div class="ui-label">Способ оплаты</div>
            <div class="checkout__toggle-grid">
              <UiToggle
                :list="paymentOptions"
                :value="payment"
                :error="errors.payment"
                @on-change="(v) => setFieldValue('payment', v)"
              />
            </div>
          </div>

          <div class="checkout__cta">
            <UiButton :loading="loading" @click="requestCheckout">
              Оформить заказ &bull; {{ formatPrice(priceData.totalToPay) }} ₽
            </UiButton>
            <UiButton to="/" theme="secondary">Вернуться в меню</UiButton>
          </div>
        </div>

        <div class="checkout__sidebar col">
          <OrderCheckoutSummary />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { useDeliveryStore } from '~/store'
import { clearString, clearPhone, validPhone, validAdress, formatPrice } from '~/utils'

const deliveryStore = useDeliveryStore()
const { currentAddress } = storeToRefs(deliveryStore)

const { priceData } = useCheckout()

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    name: '',
    phone: '',
    contact: '',
    address: currentAddress.value.name,
    deliveryDate: 1,
    deliveryTime: 1,
    payment: 1,
  },
})

const { value: name, meta: nameMeta } = useField('name', (v) => {
  return clearString(v).length >= 2 ? true : 'Введите имя'
})

const { value: phone, meta: phoneMeta } = useField('phone', (v) => {
  const { valid, phone_error_text } = validPhone(v)
  return valid || phone_error_text
})

const { value: contact, meta: contactMeta } = useField(
  'contact',
  (v) => (v && v.length ? true : 'Выберите способ связи'),
  {
    type: 'radio',
  }
)

const { value: address, meta: addressMeta } = useField('address', (v) => {
  return clearString(v).length >= 2 ? true : 'Введите адрес'
})

const { value: deliveryDate } = useField('deliveryDate', (v) => v, {
  type: 'radio',
})

const deliveryDateOptions = ref([
  { id: 1, label: 'Сегодня' },
  { id: 2, label: 'В другой день' },
])

const { value: deliveryTime } = useField('deliveryTime', (v) => v, {
  type: 'radio',
})

const deliveryTimeOptions = ref([
  { id: 1, label: 'Как можно скорее' },
  { id: 2, label: 'Ко времени' },
])

const { value: payment } = useField('payment', (v) => v, {
  type: 'radio',
})

const paymentOptions = ref([
  { id: 1, label: 'Картой на сайте' },
  { id: 2, label: 'Картой курьеру' },
  { id: 2, label: 'Наличными' },
])

const loading = ref(false)

const requestCheckout = async () => {
  const { valid, errors } = await validate()
  console.log({ valid, errors })
  if (!valid) return

  loading.value = true

  await useApi('checkout', {
    method: 'POST',
    body: {
      name: name.value,
      phone: phone.value,
      contact: contact.value,
      address: address.value,
      deliveryDate: deliveryDate.value,
      deliveryTime: deliveryTime.value,
      payment: payment.value,
    },
  }).catch(useCatchError)

  loading.value = false
}
</script>

<style lang="scss" scoped>
.checkout {
  margin: 60px 0 120px;
  &__wrapper {
    align-items: flex-start;
  }
  &__main {
    flex: 0 0 calc(100% - (368px + 32px));
  }
  &__sidebar {
    flex: 0 0 calc(368px + 32px);
    position: sticky;
    top: calc(68px + 32px);
  }
  &__row {
    margin-top: 36px;
  }
  &__radio-grid {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    margin-bottom: -20px;
    .cb {
      margin-bottom: 20px;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  // &__toggle-grid{}

  &__cta {
    margin-top: 48px;
    display: flex;
    flex-wrap: wrap;
    .button {
      margin-right: 12px;
    }
  }
}

@include r($lg) {
  .checkout {
    &__main {
      order: 2;
      flex-basis: 100%;
      margin-top: 32px;
    }
    &__sidebar {
      position: static;
      order: 1;
      flex-basis: 100%;
    }
  }
}
</style>
