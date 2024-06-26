<template>
  <div class="profile">
    <div class="container _narrow">
      <ProfileNav class="profile__nav" />

      <div class="profile__info">
        <div class="row">
          <div class="profile__info-col col col-6 col-sm-12">
            <UiInput
              name="name"
              label="Имя"
              placeholder=""
              :value="name"
              :error="errors.name"
              @on-change="(v) => setFieldValue('name', v)"
            />
          </div>
          <!-- <div class="profile__info-col col col-6 col-sm-12">
            <UiInput
              name="surname"
              label="Фамилия"
              placeholder=""
              :value="surname"
              :error="errors.surname"
              @on-change="(v) => setFieldValue('surname', v)"
            />
          </div> -->
          <div class="profile__info-col col col-6 col-sm-12">
            <UiInput
              name="phone"
              label="Номер телефона"
              placeholder="+7"
              mask="+7 (###) ###-##-##"
              :disabled="true"
              :clearable="false"
              :value="phone"
              :error="errors.phone"
              @on-change="(v) => setFieldValue('phone', v)"
            />
          </div>
          <div class="profile__info-col col col-6 col-sm-12">
            <UiInput
              name="email"
              label="Электронная почта"
              placeholder=""
              :value="email"
              :error="errors.email"
              @on-change="(v) => setFieldValue('email', v)"
            />
          </div>
          <div class="profile__info-col col col-6 col-sm-12">
            <UiInput
              name="birthday"
              label="Дата рождения"
              placeholder="ДД/ММ/ГГГГ"
              mask="##/##/####"
              inputmode="numeric"
              :value="birthday"
              :error="errors.birthday"
              :disabled="Boolean(user.birthday)"
              :clearable="!user.birthday"
              @on-change="(v) => setFieldValue('birthday', v)"
            />
          </div>
        </div>
      </div>

      <div class="profile__cta">
        <UiButton :loading="loading" :disabled="saveDisabled" @click="saveProfile">
          Сохранить изменения
        </UiButton>
        <UiButton theme="secondary" to="/profile"> Отменить </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useSessionStore } from '~/store'
import { clearString, validPhone, validEmail, validDate, dateMask } from '#imports'

const sessionStore = useSessionStore()
const { user } = storeToRefs(sessionStore)

const toast = useToast()
const router = useRouter()

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    name: user.value.name || '',
    // surname: user.value.surname || '',
    phone: user.value.username || '',
    email: user.value.email || '',
    birthday: user.value.birthday ? djs(user.value.birthday).format('DD/MM/YYYY') : '',
  },
})

const { value: name, meta: nameMeta } = useField<string>('name', (v) => {
  if (!clearString(v)) return true
  return clearString(v).length >= 2 ? true : 'Введите имя'
})

// const { value: surname, meta: surnameMeta } = useField<string>('surname', (v) => {
//   if (!clearString(v)) return true
//   return clearString(v).length >= 2 ? true : 'Введите фамилию'
// })

const { value: phone, meta: phoneMeta } = useField<string>('phone', (v) => {
  if (!clearString(v)) return true
  const { valid, phone_error_text } = validPhone(v)
  return valid || phone_error_text
})

const { value: email, meta: emailMeta } = useField<string>('email', (v) => {
  if (!clearString(v)) return true
  return validEmail(v) ? true : 'Проверьте адрес электронной почты'
})

const tDate = new Date()
tDate.setFullYear(tDate.getFullYear() - 13)

const { value: birthday, meta: birthdayMeta } = useField<string>('birthday', (v) => {
  if (!clearString(v)) return true
  return validDate(v, tDate) ? true : 'Неверная дата рождения'
})

const saveDisabled = computed(() => {
  return Object.keys(errors.value).length !== 0
})

const loading = ref(false)

const saveProfile = async () => {
  const { valid, errors } = await validate()
  if (!valid) return

  loading.value = true

  const requestObj = {
    name: name.value,
    // surname: surname.value,
    email: email.value,
    phone: phone.value,
    birth: birthday.value ? djs(birthday.value, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
  }

  const response = await useApi('profile/set-user-data', {
    method: 'POST',
    headers: useHeaders(),
    body: requestObj,
  }).catch((err) => useCatchError(err, 'Ошибка, проверьте заполненные поля'))

  if (response) {
    toast.success('Профиль обновлен')
    sessionStore.updateUser({
      ...requestObj,
      birthday: djs(birthday.value, 'DD/MM/YYYY').toDate(),
    })
    router.push('/profile')
  }

  loading.value = false
}
</script>

<style lang="scss" scoped>
.profile {
  margin: 60px 0 120px;
  // &__nav {}
  &__info-col {
    margin-top: 36px;
  }
  &__cta {
    margin-top: 48px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .button {
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
}

@include r($sm) {
  .profile {
    margin: 32px 0 72px;
    &__info-col {
      margin-top: 20px;
    }
    &__cta {
      margin-top: 28px;
    }
  }
}
</style>
