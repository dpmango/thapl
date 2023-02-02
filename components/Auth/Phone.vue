<template>
  <h2 class="auth__title h2-title">Вход на сайт</h2>
  <div class="auth__form">
    <UiInput
      name="phone"
      type="tel"
      placeholder="+7"
      :value="phone"
      mask="+7 (###) ###-##-##"
      :error="errors.phone"
      @on-change="(v) => setFieldValue('phone', v)"
      @keyup="key_event"
    />
    <div class="auth__cta">
      <UiButton :block="true" :disabled="nextDisabled" :loading="loading" @click="next">
        Выслать код
      </UiButton>
    </div>
    <div class="auth__note text-s">
      Продолжая, вы соглашаетесь
      <template v-if="app_settings.privacy_link">со</template>
      <template v-else>c&nbsp;</template>
      <template v-if="app_settings.privacy_link">
        <a :href="app_settings.privacy_link" target="_blank">
          сбором и обработкой персональных данных
        </a>
        и
      </template>
      <a href="#" target="_blank">пользовательским соглашением</a>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { clearPhone, validPhone } from '#imports'
import { useSessionStore } from '~/store'

const session = useSessionStore()
const { app_settings } = storeToRefs(session)

const loading = ref(false)

const emit = defineEmits(['change-view'])

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { phone: '' },
})

const { value: phone, meta } = useField('phone', (v) => {
  const { valid, phone_error_text } = validPhone(v)
  return valid || phone_error_text
})

const nextDisabled = computed(() => {
  return !meta.dirty || Object.keys(errors.value).length !== 0
})

const key_event = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault()
    e.stopPropagation()

    next()
  }
}

const next = async () => {
  const { valid, errors } = await validate()
  if (!valid) return

  loading.value = true

  const res = await useApi('user/get-code', {
    method: 'POST',
    headers: useHeaders(),
    body: {
      phone: '+7' + clearPhone(phone.value),
      key: '1',
    },
  }).catch(useCatchError)

  loading.value = false

  if (res) {
    session.setPhone(phone.value)
    emit('change-view', 'code')
  }
}
</script>

<style lang="scss" scoped>
.auth {
  &__title {
    text-align: center;
  }
  &__form {
    margin-top: 28px;
  }
  &__cta {
    margin-top: 28px;
  }
  &__note {
    margin-top: 16px;
    color: var(--color-gray);
    text-align: center;
    a {
      color: var(--color-primary);
      transition: color 0.25s $ease;
      &:hover {
        color: var(--color-font);
      }
    }
  }
}

@include r($sm) {
  .auth {
    &__title {
      text-align: left;
      padding-right: 30px;
    }
    &__note {
      text-align: left;
    }
  }
}
</style>
