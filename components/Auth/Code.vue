<template>
  <h2 class="auth__title h2-title">
    <span v-if="apiError" class="c-red">Неверный код</span>
    <span v-else>Введите код</span>
  </h2>
  <div class="auth__form">
    <div class="auth__note text-s">
      Код отправлен смс-сообщением на номер телефона {{ phone }}<br />
      <a class="c-primary" href="#" @click.prevent="emit('change-view', 'phone')">Изменить номер</a>
    </div>
    <div class="auth__code">
      <UiCodeInput
        name="code"
        type="text"
        :value="code"
        :error="!!apiError"
        @on-change="handleCodeChange"
        @keyup="key_event"
      />
    </div>
    <div class="auth__cta">
      <UiButton :block="true" :loading="loading" :disabled="nextDisabled" @click="next">
        <template v-if="meta.valid"> Войти </template>
        <template v-else-if="timeToResend > 0">
          Обновить код через {{ secondsToStamp(timeToResend) }}
        </template>
        <template v-else>Получить новый код</template>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useField, useForm } from 'vee-validate'
import { useSessionStore, useUiStore } from '~/store'
import { clearPhone, secondsToStamp } from '#imports'

const session = useSessionStore()
const ui = useUiStore()
const { phone } = storeToRefs(session)

const apiError = ref<boolean | null>(null)
const loading = ref(false)

const emit = defineEmits(['change-view'])

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { code: '' },
})

const {
  value: code,
  meta,
  resetField,
} = useField<string>('code', (v) => {
  return v.length === 4
})

const handleCodeChange = (v) => {
  setFieldValue('code', v)
  apiError.value = null
}

// таймер 2 минуты перед повторной отправкой
const timeToResend = ref(120)

const interval = setInterval(() => {
  if (timeToResend.value === 0) return
  timeToResend.value = timeToResend.value - 1
}, 1000)

const nextDisabled = computed(() => {
  if (meta.valid) return false
  return timeToResend.value !== 0
})

const key_event = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault()
    e.stopPropagation()

    next()
  }
}

const resendCode = async () => {
  timeToResend.value = 120
  apiError.value = false
  loading.value = true

  await useApi('user/get-code', {
    method: 'POST',
    headers: useHeaders(),
    body: {
      phone: '+7' + clearPhone(phone.value),
      key: '1',
    },
  }).catch(useCatchError)

  loading.value = false
}

const next = async () => {
  const { valid, errors } = await validate()

  if (!valid) {
    if (timeToResend.value === 0) {
      resendCode()
      resetField()
    }

    return
  }

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
    apiError.value = err.data.message
    resetField()
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

@include r($sm) {
  .auth {
    &__title {
      text-align: left;
      padding-right: 30px;
    }
    &__note {
      text-align: left;
    }
    &__code {
      .digits {
        margin-left: 0;
      }
    }
  }
}
</style>
