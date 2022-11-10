<template>
  <div class="checkout">
    <div class="container">
      <div class="checkout__wrapper row">
        <div class="checkout__main col">
          <h1 class="h2-title hidden-lg">Оформление заказа</h1>

          <!-- контакты -->
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

          <!-- поля для доставки -->
          <template v-if="zoneData.isDelivery">
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
                  @on-changable="ui.setModal({ name: 'address' })"
                />
              </div>
            </div>

            <div class="checkout__row">
              <div class="ui-label">Дата доставки</div>
              <div class="checkout__toggle-grid">
                <UiToggle
                  theme="spaced"
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
                  theme="spaced"
                  :list="deliveryTimeOptions"
                  :value="deliveryTime"
                  :error="errors.deliveryTime"
                  @on-change="(v) => setFieldValue('deliveryTime', v)"
                />
              </div>
            </div>
          </template>

          <!-- поля для самовывоза -->
          <template v-else-if="zoneData.isTakeaway">
            <div class="checkout__row row">
              <div class="col col-12">
                <UiInput
                  name="address"
                  label="Адрес самовывоза"
                  :disabled="true"
                  :changable="true"
                  :value="address"
                  :error="errors.address"
                  @on-change="(v) => setFieldValue('address', v)"
                  @on-changable="ui.setModal({ name: 'address' })"
                />
              </div>
            </div>
          </template>

          <!-- кейс закрытым окном выбора -->
          <template v-else>
            <div class="checkout__row">
              <div class="h2-title checkout__no-address">
                Адрес не выбран.
                <a href="#" @click.prevent="ui.setModal({ name: 'address' })">Выбрать</a>
              </div>
            </div>
          </template>

          <!-- подогрев блюд -->
          <div class="checkout__row">
            <div class="ui-label">Подогрев блюд</div>
            <div class="checkout__radio-grid">
              <UiCheckbox
                type="radio"
                :error="errors.heat"
                :checked="heat === 'no'"
                @change="() => setFieldValue('heat', 'no')"
              >
                Не нужно
              </UiCheckbox>
              <UiCheckbox
                type="radio"
                :error="errors.heat"
                :checked="heat === 'yes'"
                @change="() => setFieldValue('heat', 'yes')"
              >
                Подогрейте, пожалуйста
              </UiCheckbox>
            </div>
          </div>

          <!-- Упаковка -->
          <div v-if="packOptions.length" class="checkout__row">
            <div class="ui-label">Упаковка</div>
            <div class="checkout__radio-grid">
              <UiCheckbox
                type="radio"
                :error="errors.pack"
                :checked="pack === 'no'"
                @change="() => setFieldValue('pack', 'no')"
              >
                Не важно
              </UiCheckbox>
              <UiCheckbox
                v-for="opt in packOptions"
                :key="opt.value"
                type="radio"
                :error="errors.pack"
                :checked="pack === opt.value"
                @change="() => setFieldValue('pack', opt.value)"
              >
                {{ opt.label }} <span class="c-gray">+{{ formatPrice(opt.price) }} ₽</span>
              </UiCheckbox>
            </div>
          </div>

          <!-- Приборы -->
          <div class="checkout__row row">
            <div class="col col-6 col-sm-12">
              <div class="ui-label">Количество приборов</div>
              <UiPlusMinus
                size="medium"
                :as-input="true"
                :min-value="1"
                :max-value="25"
                :value="personsCount"
                @on-change="(v) => setFieldValue('personsCount', v)"
              />
            </div>
          </div>

          <!-- способ оплаты -->
          <div class="checkout__row">
            <div class="ui-label">Способ оплаты</div>
            <div class="checkout__toggle-grid">
              <UiToggle
                theme="spaced"
                :list="paymentOptions"
                :value="payment"
                :error="errors.payment"
                @on-change="(v) => setFieldValue('payment', v)"
              />
            </div>
          </div>

          <div v-if="payment === 3" class="checkout__row row">
            <div class="col col-6 col-sm-12">
              <UiInput
                name="change"
                label="Подготовить сдачу с"
                placeholder="5 000"
                inputmode="numeric"
                :value="change"
                :error="errors.change"
                @on-change="(v) => setFieldValue('change', v)"
              />
            </div>
          </div>

          <!-- промокод -->

          <!-- действия -->
          <div class="checkout__cta">
            <UiButton :loading="loading" :disabled="checkoutDisabled" @click="requestCheckout">
              Оформить заказ &nbsp;&nbsp;&bull;&nbsp;&nbsp;
              {{ formatPrice(priceData.totalToPay) }} ₽
            </UiButton>
            <UiButton to="/" theme="secondary">Вернуться в меню</UiButton>
          </div>
        </div>

        <div class="checkout__sidebar col">
          <h1 class="h2-title visible-lg">Оформление заказа</h1>

          <OrderCheckoutSummary />

          <!-- <div class="dev wysiwyg">
            <p class="text-xs c-gray">zoneData: {{ zoneData }}</p>
            <p class="text-xs c-gray">orderDay: {{ orderDay }}</p>
            <p class="text-xs c-gray">orderDaySelected: {{ orderDaySelected }}</p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import dayjs from 'dayjs'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useDeliveryStore, useCartStore, useSessionStore, useUiStore } from '~/store'
import {
  scrollPageToTop,
  clearString,
  isValidNumber,
  validPhone,
  formatPrice,
  generateDaysFrom,
  generateTimeSlots,
} from '~/utils'

const sessionStore = useSessionStore()
const deliveryStore = useDeliveryStore()
const cartStore = useCartStore()
const ui = useUiStore()
const { currentAddress } = storeToRefs(deliveryStore)
const { app_settings } = storeToRefs(sessionStore)

const { $env } = useNuxtApp()
const toast = useToast()
const router = useRouter()

const { priceData, zoneData } = useCheckout()

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    name: '',
    phone: '',
    contact: '',
    address: currentAddress.value?.name,
    deliveryDate: '',
    deliveryTime: '',
    heat: '',
    pack: '',
    personsCount: 1,
    payment: '',
    change: '',
  },
})

const edgeFieldsValid = computed(() => {
  return currentAddress.value?.name
})

const checkoutDisabled = computed(() => {
  return Object.keys(errors.value).length !== 0 || !edgeFieldsValid.value
})

// контакты
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

watch(
  () => currentAddress.value,
  (newVal) => {
    setFieldValue('address', newVal?.name)
  },
  { deep: true }
)

// адрес и время
const { value: address, meta: addressMeta } = useField('address', (v) => {
  return clearString(v).length >= 2 ? true : 'Введите адрес'
})

const { value: deliveryDate } = useField(
  'deliveryDate',
  (v) => {
    return v ? true : 'Выберите дату'
  },
  {
    type: 'radio',
  }
)

// текущее время пользователя либо следующий день (логика только для выбора опций)
// const noTimeOptionsAvailable = ref(false)
const orderDay = computed(() => {
  let userDate = dayjs().tz($env.timezone)
  let isToday = true

  // TODO - поставить время работы from
  // ставит следующий день если зона закрыта (например вечернее время 20-24)
  // если заказ происходит утром (0-8), то нет необходимости менять дату
  if (!zoneData.value.isOpen && userDate.hour() >= 10) {
    userDate = userDate.add(1, 'day')
    isToday = false
  }

  return {
    day: userDate,
    isToday,
  }
})

// выбор даты доставки с возможностью указать N дней вперед
const deliveryDateOptions = computed(() => {
  const startLabel = orderDay.value.isToday ? 'Сегодня' : 'Завтра'
  const subtractDays = orderDay.value.isToday ? 0 : 1
  // TODO - выходные если указано в параметрах api

  if (!app_settings.value.order_to_time && $env.orderDeliveryFutureDays) {
    return [
      { id: orderDay.value.day.format('DD.MM.YYYY'), label: startLabel },
      ...generateDaysFrom(orderDay.value.day, $env.orderDeliveryFutureDays - subtractDays),
    ]
  }

  return [
    { id: orderDay.value.day.format('DD.MM.YYYY'), label: startLabel },
    { id: 0, label: 'В другой день' },
  ]
})

const { value: deliveryTime } = useField(
  'deliveryTime',
  (v) => {
    return v ? true : 'Выберите время'
  },
  {
    type: 'radio',
  }
)

// контроль времени в зависимости от выбранной даты (логика только для выбора опций)
const orderDaySelected = computed(() => {
  let orderDaySelected = orderDay.value.day

  if (deliveryDate.value) {
    // созданная дата 0:00 минут (все слоты будут доступны)
    const dayFromString = dayjs(deliveryDate.value, 'DD.MM.YYYY', true).tz($env.timezone)

    // не меняем время если заказ на Сегодня
    if (!dayFromString.isToday()) {
      orderDaySelected = dayFromString
    }
  }

  return orderDaySelected
})

// время доставки включая сгенерированные слоты
const deliveryTimeOptions = computed(() => {
  if ($env.orderDeliveryTimeSlots) {
    const startTime = orderDaySelected.value.hour(10).minute(0)
    const endTime = orderDaySelected.value.hour(20).minute(0)

    // начальное, конечное, интервал в часах, now с указанием насколько задержать заказ
    return generateTimeSlots(startTime, endTime, 2, orderDaySelected.value.add(2, 'hour'))
  }

  return [
    { id: 1, label: 'Как можно скорее' },
    { id: 2, label: 'Ко времени' },
  ]
})

// при изменении даты сбрасывать время
watch(
  () => deliveryDate.value,
  (newVal) => {
    setFieldValue('deliveryTime', '')
  }
)

// TODO если нет доступных слотов, ставить следующий день

// подгорев блюд
const { value: heat, meta: heatMeta } = useField(
  'heat',
  (v) => (v && v.length ? true : 'Выберите подогрев блюд'),
  {
    type: 'radio',
  }
)

// упаковка
const { value: pack, meta: packMeta } = useField(
  'pack',
  (v) => (v && v.length ? true : 'Выберите вариант упаковки'),
  {
    type: 'radio',
  }
)

// TODO - получать с API
const packOptions = ref([{ id: 1, label: 'Компактная', price: 300 }])

// Количество приборов
const { value: personsCount, meta: personsCountMeta } = useField('personsCount', (v) => v)

// Оплата, сдача
const { value: payment } = useField(
  'payment',
  (v) => {
    return v ? true : 'Выберите способ оплаты'
  },
  {
    type: 'radio',
  }
)

// 1 - наличные, 3 - картой курьеру, 1030 - картой онлайн, 1050 - картой через SDK, 1040 - pay сервисами через SDK
const paymentOptions = ref([
  { id: 1030, label: 'Картой на сайте' },
  { id: 3, label: 'Картой курьеру' },
  { id: 1, label: 'Наличными' },
])

const { value: change, meta: changeMeta } = useField('change', (v) => {
  if (!v || payment.value !== 3) return true

  if (!isValidNumber(v)) {
    return 'Введите сумму (числом)'
  }

  if (v <= priceData.value.totalToPay) {
    return 'Сумма должна быть больше стоимости заказа'
  }

  return true
})

const loading = ref(false)

const requestCheckout = async () => {
  const { valid, errors } = await validate()

  if (!valid || !edgeFieldsValid.value) {
    scrollPageToTop()
    return
  }

  loading.value = true

  const response = await useApi('order/create', {
    method: 'POST',
    headers: useHeaders(),
    body: {
      name: name.value,
      phone: phone.value,
      not_call: contact.value === 'message',
      order_type: zoneData.value.orderType,
      address: address.value,
      lat: currentAddress.value.latitude,
      lng: currentAddress.value.longitude,
      date: `${deliveryDate.value} ${deliveryTime.value}`, // DD.MM.YYYY HH:mm
      not_heat: heat.value === 'no',
      // pack: pack.value,
      persons_count: personsCount.value,
      payment_method: payment.value,
      change: change.value,
      cart: cartStore.cartToApi,
    },
  }).catch((err) => useCatchError(err, 'Ошибка, проверьте заполненные поля'))

  if (response && response.suceess) {
    toast.success(`Заказ ${response.order_id} Оформлен`)
    cartStore.resetCart()
    router.push('/')
  } else {
    useCatchError(response, response.error_field)
  }

  // "email": "string",
  // "intercom": "string",
  // "entrance": "string",
  // "floor": "string",
  // "apt": "string",
  // "comment": "string",
  // "time_to_delivery": "string",
  // "points": 0,
  // "gift_id": 0,
  // "promo_id": 0,
  // "promo_code": "string",
  // "order_type": 0,

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
  &__no-address {
    a {
      color: var(--color-primary);
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-font);
      }
    }
  }
  &__cta {
    margin-top: 48px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -12px;
    .button {
      margin-bottom: 12px;
      margin-right: 12px;
    }
  }
}

@include r($lg) {
  .checkout {
    margin: 24px 0 80px;
    &__main {
      order: 2;
      flex-basis: 100%;
    }
    &__sidebar {
      position: static;
      order: 1;
      flex-basis: 100%;
    }
    &__row {
      margin-top: 28px;
    }
  }
}

@include r($sm) {
  .checkout {
    &__row {
      .col:not(:last-child) {
        margin-bottom: 24px;
      }
    }
    &__cta {
      margin-top: 36px;
      display: flex;
      flex-direction: column;
      .button {
        width: 100%;
        margin-right: 0px;
      }
    }
  }
}
</style>
