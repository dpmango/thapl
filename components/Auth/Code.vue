<template>
  <h2 class="auth__title h2-title">
    <span v-if="error" class="c-red">Неверный код</span>
    <span v-else>Введите код</span>
  </h2>
  <div class="auth__form">
    <div class="auth__note">
      Код отправлен смс-сообщением на номер телефона {{ phone }}<br />
      <a class="c-primary" href="#" @click.prevent="emit('change-view', 'phone')">Изменить номер</a>
    </div>
    <div class="auth__code">
      <UiCodeInput
        name="code"
        type="text"
        :value="code"
        :error="!!error || errors.code"
        @on-change="(v) => setFieldValue('code', v)"
        @keyup="key_event"
      />
    </div>
    <div class="auth__cta">
      <UiButton :block="true" :loading="loading" :disabled="nextDisabled" @click="next">
        Выслать код
      </UiButton>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { useSessionStore, useUiStore } from '~/store'
import { clearPhone } from '~/utils'

const session = useSessionStore()
const ui = useUiStore()
const { phone } = storeToRefs(session)

const error = ref(null)
const loading = ref(false)

const emit = defineEmits(['change-view'])

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { code: '' },
})

const { value: code, meta } = useField('code', (v) => {
  return v.length === 4
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

  // error.value = null
  loading.value = true

  const res = await useApi('user/check-code', {
    method: 'POST',
    headers: useHeaders(),
    body: {
      code: code.value,
      phone: '+7' + clearPhone(phone.value),
    },
  }).catch((err) => {
    error.value = err.data.message
  })

  loading.value = false

  if (res) {
    session.setSession(res)
    ui.closeModal()
  }
}
</script>

<style lang="scss" scoped>
.auth {
  &__title {
    text-align: center;
  }
  &__form {
    margin-top: 20px;
  }

  &__note {
    font-size: 14px;
    line-height: 22px;
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
  &__code {
    margin-top: 24px;
  }
  &__cta {
    margin-top: 28px;
  }
}
</style>
