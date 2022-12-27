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

            <div v-if="!phoneExists" class="col col-6 col-sm-12">
              <UiInput
                name="phone"
                type="tel"
                label="Телефон"
                placeholder="+7"
                :disabled="phoneExists"
                :value="phone"
                mask="+7 (###) ###-##-##"
                :error="errors.phone"
                @on-change="(v) => setFieldValue('phone', v)"
              />
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

            <div class="checkout__row row">
              <div class="col col-6">
                <UiInput
                  name="entrance"
                  label="Подъезд"
                  placeholder=""
                  :value="entrance"
                  :error="errors.entrance"
                  @on-change="(v) => setFieldValue('entrance', v)"
                />
              </div>
              <div class="col col-6">
                <UiInput
                  name="floor"
                  label="Этаж"
                  placeholder=""
                  :value="floor"
                  :error="errors.floor"
                  @on-change="(v) => setFieldValue('floor', v)"
                />
              </div>
            </div>
            <div class="checkout__row row">
              <div class="col col-6">
                <UiInput
                  name="apt"
                  label="Квартира/офис"
                  placeholder=""
                  :value="apt"
                  :error="errors.apt"
                  @on-change="(v) => setFieldValue('apt', v)"
                />
              </div>
              <div class="col col-6">
                <UiInput
                  name="intercom"
                  label="Домофон"
                  placeholder=""
                  :value="intercom"
                  :error="errors.intercom"
                  @on-change="(v) => setFieldValue('intercom', v)"
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

          <!-- Дата и время -->
          <template v-if="true || app_settings.order_to_time">
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

            <div v-if="deliveryTime === 2" class="checkout__row">
              <UiRangeSlider
                :min="deliveryRangeOptions.min"
                :max="deliveryRangeOptions.max"
                :step="deliveryRangeOptions.step"
                :value="deliveryRange"
                :minutes="true"
                @on-change="(v) => setFieldValue('deliveryRange', +v)"
              />
            </div>
          </template>

          <!-- Упаковка -->
          <div v-if="$env.orderUsePacking && packingOptions.length" class="checkout__row">
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
                v-for="opt in packingOptions"
                :key="opt.value"
                type="radio"
                :error="errors.pack"
                :checked="pack === opt.value"
                @change="() => setFieldValue('pack', opt.value)"
              >
                {{ opt.label }}
                <span v-if="opt.price" class="c-gray">+{{ formatPrice(opt.price) }} ₽</span>
              </UiCheckbox>
            </div>
          </div>

          <!-- Приборы -->
          <div v-if="app_settings.show_persons" class="checkout__row row">
            <div class="col col-6 col-sm-12">
              <div class="ui-label">Количество приборов</div>
              <UiPlusMinus
                size="medium"
                :as-input="true"
                :min-value="0"
                :max-value="25"
                :value="personsCount"
                @on-change="(v) => setFieldValue('personsCount', v)"
              />
            </div>
          </div>

          <!-- Дополнительные поля -->
          <div v-if="$env.orderUseNotCall || $env.orderUseNotHeat" class="checkout__row">
            <div class="ui-label">Дополнительно</div>
            <div class="checkout__radio-grid">
              <UiCheckbox
                v-if="$env.orderUseNotCall"
                type="checkbox"
                :error="errors.not_call"
                :checked="not_call"
                @change="() => setFieldValue('not_call', !not_call)"
              >
                {{ $env.orderNotCall }}
              </UiCheckbox>
              <UiCheckbox
                v-if="$env.orderUseNotHeat"
                type="checkbox"
                :error="errors.not_heat"
                :checked="not_heat"
                @change="() => setFieldValue('not_heat', !not_heat)"
              >
                Без подогрева блюд
              </UiCheckbox>
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

          <div v-if="payment === 1" class="checkout__row row">
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

          <div v-if="requireEmail" class="checkout__row row">
            <div class="col col-6 col-sm-12">
              <UiInput
                name="email"
                label="Email"
                placeholder="Введите email"
                :value="email"
                :error="errors.email"
                @on-change="(v) => setFieldValue('email', v)"
              />
            </div>
          </div>

          <!-- промокод  / бонус -->
          <template v-if="app_settings.loyalty?.enabled">
            <div v-if="!combinedPromo" class="checkout__row">
              <div class="ui-label">Бонусная программа</div>
              <div class="checkout__toggle-grid">
                <UiToggle
                  theme="spaced"
                  :list="bonusOptions"
                  :value="bonusType"
                  :error="errors.bonusType"
                  @on-change="(v) => setFieldValue('bonusType', v)"
                />
              </div>
            </div>

            <div class="checkout__row row">
              <div v-if="showBonus.promocode" class="col col-6 col-sm-12">
                <UiInput
                  name="promocode"
                  label="Промокод"
                  :value="promocode"
                  :error="errors.promocode"
                  :changable="promocodeApplied ? 'Изменить' : 'Применить'"
                  @on-change="(v) => setFieldValue('promocode', v)"
                  @on-changable="handlePromocodeClick"
                />
              </div>
              <div v-if="showBonus.points" class="col col-6 col-sm-12">
                <UiInput
                  name="points"
                  label="Сколько бонусов списать"
                  placeholder="100"
                  inputmode="numeric"
                  :value="points"
                  :error="errors.points"
                  helper="Максимально можно списать 2 500"
                  @on-change="(v) => setFieldValue('points', v)"
                />
              </div>
            </div>
          </template>

          <!-- Комментарий -->
          <div class="checkout__row row">
            <div class="col col-12">
              <UiInput
                type="textarea"
                rows="3"
                name="comment"
                label="Комментарий"
                :value="comment"
                :error="errors.comment"
                @on-change="(v) => setFieldValue('comment', v)"
              />
            </div>
          </div>

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
  validEmail,
  formatPrice,
  generateDaysFrom,
  generateTimeSlots,
  openExternalLink,
} from '#imports'

const sessionStore = useSessionStore()
const deliveryStore = useDeliveryStore()
const cartStore = useCartStore()
const ui = useUiStore()
const { currentAddress } = storeToRefs(deliveryStore)
const { app_settings, user } = storeToRefs(sessionStore)

const { $env, $log } = useNuxtApp()
const toast = useToast()
const router = useRouter()

const { priceData, zoneData, stopListData, slotsData } = useCheckout()

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    name: '',
    phone: user.value.username || '',
    address: currentAddress.value?.name,
    entrance: '',
    floor: '',
    apt: '',
    intercom: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryRange: 0,
    pack: '',
    personsCount: +app_settings.value.default_persons_count,
    not_call: false,
    not_heat: false,
    payment: '',
    change: '',
    email: '',
    bonusType: 1,
    promocode: '',
    points: '',
    comment: '',
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

const phoneExists = computed(() => {
  if (user.value.username) return true

  return false
})

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

const { value: entrance, meta: entranceMeta } = useField('entrance', (v) => {
  if (zoneData.value.isTakeaway) return true
  return true
})
const { value: floor, meta: floorMeta } = useField('floor', (v) => {
  if (zoneData.value.isTakeaway) return true
  return true
})
const { value: apt, meta: aptMeta } = useField('apt', (v) => {
  if (zoneData.value.isTakeaway) return true
  return true
})
const { value: intercom, meta: intercomMeta } = useField('intercom', (v) => {
  if (zoneData.value.isTakeaway) return true
  return true
})

const { value: deliveryDate } = useField(
  'deliveryDate',
  (v) => {
    if (zoneData.value.isTakeaway) return true
    if (!app_settings.value.order_to_time) return true
    return v ? true : 'Выберите дату'
  },
  {
    type: 'radio',
  }
)

// текущее время пользователя либо следующий день (логика только для выбора опций)
// const noTimeOptionsAvailable = ref(false)
const orderDay = computed(() => {
  let userDate = dayjs().tz(zoneData.value?.organization?.timezone)
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

  if (slotsData.value.hasSlots) {
    return [
      { id: orderDay.value.day.format('DD.MM.YYYY'), label: startLabel },
      ...generateDaysFrom(orderDay.value.day, $env.orderDeliveryFutureDays - subtractDays),
    ]
  }

  const dayOptions = [{ id: 0, label: 'В другой день' }]

  // + добавить есть доступные на сегодня слоты
  if (showASAPTime.value) {
    dayOptions.unshift({ id: orderDay.value.day.format('DD.MM.YYYY'), label: startLabel })
  }

  return dayOptions
})

const { value: deliveryTime } = useField(
  'deliveryTime',
  (v) => {
    if (zoneData.value.isTakeaway) return true
    if (!app_settings.value.order_to_time) return true
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
    const dayFromString = dayjs(deliveryDate.value, 'DD.MM.YYYY', true).tz(
      zoneData.value?.organization?.timezone
    )

    // не меняем время если заказ на Сегодня
    if (!dayFromString.isToday()) {
      orderDaySelected = dayFromString
    }
  }

  return orderDaySelected
})

// время доставки включая сгенерированные слоты
const showASAPTime = computed(() => {
  return zoneData.value.isOpen && !stopListData.value.hasStops
})

const deliveryTimeOptions = computed(() => {
  if (slotsData.value.hasSlots) {
    const startTime = orderDaySelected.value.hour(10).minute(0)
    const endTime = orderDaySelected.value.hour(20).minute(0)

    // начальное, конечное, интервал в часах, now с указанием насколько задержать заказ
    return generateTimeSlots(startTime, endTime, 2, orderDaySelected.value.add(2, 'hour'))
  }

  const timeOptions = [{ id: 2, label: 'Ко времени' }]

  if (showASAPTime.value) {
    timeOptions.unshift({ id: 1, label: 'Как можно скорее' })
  }

  return timeOptions
})

// при изменении даты сбрасывать время
watch(
  () => deliveryDate.value,
  (newVal) => {
    setFieldValue('deliveryTime', '')
  }
)

// ползунок время доставки
const { value: deliveryRange } = useField('deliveryRange', (v) => {
  return true
})

const deliveryRangeOptions = computed(() => {
  return {
    min: zoneData.value.timeFrom,
    max: zoneData.value.timeTo,
    step: 15,
  }
})

// TODO если нет доступных слотов, ставить следующий день

// упаковка
const { value: pack, meta: packMeta } = useField(
  'pack',
  (v) => (v && v.length ? true : 'Выберите вариант упаковки'),
  {
    type: 'radio',
  }
)

const packingData = ref(null)
const packingOptions = computed(() => {
  if (!packingData.value) return []

  const options = []

  Object.keys(packingData.value).forEach((key) => {
    const priceVal = packingData.value[key]

    if (priceVal !== -1) {
      let label = 'Бесплатная'
      if (key === 'compact_pack') {
        label = $env.orderPackingCompact
      } else if (key === 'separate_pack') {
        label = $env.orderPackingSeparate
      }

      options.push({ id: key, label, price: priceVal })
    }
  })

  return options
})

const fetchPackingOptions = async () => {
  if (!$env.orderUsePacking) return null

  const data = await useApi('cart/get-packing', {
    method: 'POST',
    headers: useHeaders(),
    body: {
      cart: cartStore.cartToApi,
    },
  }).catch((err) =>
    useCatchError(err, 'Ошибка при получении вариантов упаковки. Обратитесь в поддержку')
  )

  if (data) {
    packingData.value = data
  }
}

// Количество приборов
const { value: personsCount, meta: personsCountMeta } = useField('personsCount', (v) => {
  if (!$env.orderUsePacking) return true
  return v
})

// Дополнительные поля (связь)
const { value: not_call, meta: contactMeta } = useField('not_call', (v) => true, {
  type: 'checkbox',
})

// Дополнительные поля (подгорев блюд)
const { value: not_heat, meta: heatMeta } = useField('not_heat', (v) => true, {
  type: 'checkbox',
})

// Оплата
const { value: payment } = useField(
  'payment',
  (v) => {
    return v ? true : 'Выберите способ оплаты'
  },
  {
    type: 'radio',
  }
)

// 1050 - картой через SDK, 1040 - pay сервисами через SDK
const paymentOptions = computed(() => {
  const envOptions = $env.orderPaymentOptions.split(',')

  const optionsList = [
    // +  сбп
    { id: 1030, label: 'Картой онлайн' },
    { id: 3, label: zoneData.value.isDelivery ? 'Картой курьеру' : 'Картой в ресторане' },
    { id: 1, label: 'Наличными' },
  ]

  return envOptions.map((key) => ({ ...optionsList.find((x) => x.id === +key) }))
})

// Доп. поля оплаты (почта, сдача)
const { value: change, meta: changeMeta } = useField('change', (v) => {
  if (!v || payment.value !== 1) return true

  if (!isValidNumber(v)) {
    return 'Введите сумму (числом)'
  }

  if (v <= priceData.value.totalToPay) {
    return 'Сумма должна быть больше стоимости заказа'
  }

  return true
})

const requireEmail = computed(() => {
  if (![1030, 1040, 1050].includes(payment.value)) return false
  return zoneData.value?.organization.payment_data?.need_email
})

const { value: email } = useField('email', (v) => {
  if (!requireEmail.value) return true
  return validEmail(v) ? true : 'Введите email'
})

// Бонусная программа
const { value: bonusType } = useField('bonusType', (v) => {
  return true
})

const bonusOptions = computed(() => {
  return [
    { id: 1, label: 'Промокод' },
    { id: 2, label: 'Бонусы' },
  ]
})

const combinedPromo = computed(() => {
  return app_settings.value.loyalty?.combine_promo_and_bonus
})

const showBonus = computed(() => {
  if (!combinedPromo.value) {
    return {
      promocode: bonusType.value === 1,
      points: bonusType.value === 2,
    }
  }

  return {
    promocode: true,
    points: true,
  }
})

// Бонусная программа (промокод)
const { value: promocode, meta: promocodeMeta } = useField('promocode', (v) => {
  return true
})

const promocodeApplied = ref(false)

const handlePromocodeClick = () => {
  if (promocodeApplied.value) {
    promocodeApplied.value = false
    setFieldValue('promocode', '')
  } else {
    promocodeApplied.value = true
  }

  fetchPromo()
}

// Бонусная программа (боунсы)
const { value: points, meta: pointsMeta } = useField('points', (v) => {
  return true
})

const fetchPromo = async () => {
  const requestObj = {}

  if (promocode.value) {
    requestObj.code = promocode.value
  }
  if (deliveryTime.value) {
    requestObj.time_to_delivery = deliveryTime.value
  }

  const res = await cartStore.getPromo(requestObj)
}

watch(
  () => bonusType.value,
  (newVal) => {
    if (newVal === 1) {
      setFieldValue('points', '')
    } else if (newVal === 2) {
      setFieldValue('bonus', '')
      promocodeApplied.value = false
    }
  }
)

// Комментарий
const { value: comment } = useField('comment', (v) => {
  return true
})

// Запрос на создание
const loading = ref(false)
const requestCheckout = async () => {
  const { valid, errors } = await validate()

  if (!valid || !edgeFieldsValid.value) {
    scrollPageToTop()
    return
  }

  loading.value = true

  const orderObject = {
    name: name.value,
    phone: phone.value,
    order_type: zoneData.value.orderType,
    address: address.value,
    lat: currentAddress.value.latitude,
    lng: currentAddress.value.longitude,
    payment_method: payment.value,

    cart: cartStore.cartToApi,
    comment:
      process.env.NODE_ENV === 'development' ? 'ТЕСТОВЫЙ ЗАКАЗ В РЕЖИМЕ РАЗРАБОТКИ' : comment.value,
  }

  if (zoneData.value.isDelivery) {
    orderObject.date = `${deliveryDate.value} ${deliveryTime.value}` // DD.MM.YYYY HH:mm
    orderObject.entrance = entrance.value
    orderObject.floor = floor.value
    orderObject.apt = apt.value
    orderObject.intercom = intercom.value
  }

  if ($env.orderUsePacking) {
    orderObject.pack = pack.value
  }

  if (app_settings.value.show_persons) {
    orderObject.persons_count = personsCount.value.toString()
  }

  if ($env.orderUseNotCall) {
    orderObject.not_call = not_call.value
  }

  if ($env.orderUseNotHeat) {
    orderObject.not_heat = not_heat.value
  }

  if (payment.value === 1) {
    orderObject.change = change.value
  }

  if (requireEmail.value) {
    orderObject.email = email.value
  }

  if (promocode.value) {
    // "promo_id": 0,
    orderObject.promo_code = promocode.value
  }
  if (points.value) {
    orderObject.points = points.value
  }

  // "time_to_delivery": "string",
  // "gift_id": 0,

  const response = await useApi('order/create', {
    method: 'POST',
    headers: useHeaders(),
    body: orderObject,
  }).catch((err) => useCatchError(err, 'Что-то пошло не так. Обратитесь в поддержку'))

  const handleSuccess = () => {
    toast.success(`Заказ ${response.order_id} Оформлен`)
    cartStore.resetCart()
    router.push('/')
  }

  if (response && response.suceess && response.order_id) {
    if (payment.value === 1030) {
      const paymentData = await useApi('order/get-payment-data', {
        method: 'POST',
        headers: useHeaders(),
        params: {
          id: response.order_id,
        },
      }).catch((err) => useCatchError(err, 'Ошибка платежного шлюза. Обратитесь в поддержку'))

      if (paymentData.link) {
        openExternalLink(paymentData.link)
      } else if (paymentData.success) {
        handleSuccess()
      }
    } else {
      handleSuccess()
    }
  } else {
    $log.error(response)
    const { error_field, error_reason, error_text } = response

    if (error_reason === 10) {
      toast.error('Неверные данные. Проверьте заполненные поля')
      setErrors({
        [error_field]: error_text || 'Ошибка',
      })
    } else if (error_reason === 20) {
      ui.setModal({ name: 'orgnotfound' })
    } else if (error_reason === 30) {
      ui.setModal({ name: 'closed' })
    } else if (!error_reason) {
      toast.error(error_text || 'Что-то пошло не так. Обратитесь в поддержку')
    }
  }

  loading.value = false
}

onMounted(() => {
  fetchPackingOptions()
  fetchPromo()
})
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
