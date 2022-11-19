<template>
  <div class="address">
    <!-- <span class="text-s">{{ address }}</span> -->
    <div class="address__head">
      <h4 class="h4-title h6-title-md">{{ address.full_string }}</h4>
    </div>

    <div class="address__rows row">
      <div class="col col-3 col-md-6">
        <div class="address__label text-s c-gray">Квартира / офис</div>
        <UiInput
          v-if="editable"
          name="apt"
          placeholder=""
          :value="apt"
          :error="errors.apt"
          @on-change="(v) => setFieldValue('apt', v)"
        />
        <div v-else-if="address.apt" class="text-m">{{ address.apt }}</div>
        <div v-else class="text-m c-gray">—</div>
      </div>
      <div class="col col-3 col-md-6">
        <div class="address__label text-s c-gray">Подъезд</div>
        <UiInput
          v-if="editable"
          name="entrance"
          placeholder=""
          :value="entrance"
          :error="errors.entrance"
          @on-change="(v) => setFieldValue('entrance', v)"
        />
        <div v-else-if="address.entrance" class="text-m">{{ address.entrance }}</div>
        <div v-else class="text-m c-gray">—</div>
      </div>
      <div class="col col-3 col-md-6">
        <div class="address__label text-s c-gray">Этаж</div>
        <UiInput
          v-if="editable"
          name="floor"
          placeholder=""
          :value="floor"
          :error="errors.floor"
          @on-change="(v) => setFieldValue('floor', v)"
        />
        <div v-else-if="address.floor" class="text-m">{{ address.floor }}</div>
        <div v-else class="text-m c-gray">—</div>
      </div>
      <div class="col col-3 col-md-6">
        <div class="address__label text-s c-gray">Домофон</div>
        <UiInput
          v-if="editable"
          name="door_code"
          placeholder=""
          :value="door_code"
          :error="errors.door_code"
          @on-change="(v) => setFieldValue('door_code', v)"
        />
        <div v-else-if="address.door_code" class="text-m">{{ address.door_code }}</div>
        <div v-else class="text-m c-gray">—</div>
      </div>
      <div class="col col-12">
        <div class="address__label text-s c-gray">Комментарий для курьера</div>
        <UiInput
          v-if="editable"
          name="user_comment"
          placeholder=""
          :value="user_comment"
          :error="errors.user_comment"
          @on-change="(v) => setFieldValue('user_comment', v)"
        />
        <div v-else-if="address.user_comment" class="text-m">{{ address.user_comment }}</div>
        <div v-else class="text-m c-gray">—</div>
      </div>
    </div>

    <div v-if="editable" class="address__actions">
      <UiButton :loading="loading" @click="handleSave"> Сохранить </UiButton>
    </div>
    <div v-else class="address__actions">
      <UiButton @click="handleEditClick"> Изменить </UiButton>
      <UiButton theme="secondary" @click="handleRemoveClick"> Удалить </UiButton>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useField, useForm } from 'vee-validate'

const { $env, $log } = useNuxtApp()
const toast = useToast()

const props = defineProps({
  address: Object,
})

const emit = defineEmits('dispatchUpdate')

const editable = ref(false)
const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: {
    apt: props.address.apt || '',
    entrance: props.address.entrance || '',
    floor: props.address.floor || '',
    door_code: props.address.door_code || '',
    user_comment: props.address.user_comment || '',
  },
})

const { value: apt } = useField('apt', (v) => {
  return true
})
const { value: entrance } = useField('entrance', (v) => {
  return true
})
const { value: floor } = useField('floor', (v) => {
  return true
})
const { value: door_code } = useField('door_code', (v) => {
  return true
})
const { value: user_comment } = useField('user_comment', (v) => {
  return true
})

const handleEditClick = () => {
  editable.value = true
}

const loading = ref(false)
const handleSave = async () => {
  const { valid, errors } = await validate()

  if (!valid) return
  loading.value = true

  const response = await useApi('profile/edit-address', {
    method: 'POST',
    headers: useHeaders(),
    body: {
      id: props.address.id,
      apt: apt.value || '',
      entrance: entrance.value || '',
      floor: floor.value || '',
      door_code: door_code.value || '',
      user_comment: user_comment.value || '',
    },
  }).catch((err) => useCatchError(err, 'Ошибка, проверьте заполненные поля'))

  loading.value = false

  if (response) {
    toast.success('Адрес сохранен')
    emit('dispatchUpdate')
  }
}

const handleRemoveClick = async () => {
  const res = await useApi('profile/dell-address', {
    method: 'POST',
    headers: useHeaders(),
    body: {
      id: props.address.id,
    },
  }).catch(useCatchError)

  if (res && res.success) {
    toast.success('Удалено')
    emit('dispatchUpdate')
  }
}
</script>

<stlye lang="scss" scoped>
.address {
  background: var(--component-background);
  box-shadow: var(--box-shadow-large);
  border-radius: var(--card-border-radius);
  padding: 36px;
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__rows {
    .col {
      margin-top: 28px;
    }
  }
  &__label {
    font-weight: 500;
    margin-bottom: 8px;
  }
  &__actions {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    button {
      margin-top: 20px;
      margin-right: 20px;
    }
  }
}

@include r($sm) {
  .address {
    padding: 0 0 24px;
    box-shadow: none;
    border-radius: 0;
    border-bottom: 1px solid var(--color-border);
    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
    &__rows {
      .col {
        margin-top: 24px;
      }
    }
    &__actions {
      margin-top: 20px;
      button {
        width: 100%;
        margin-top: 8px;
        margin-right: 0px;
      }
    }
  }
}
</stlye>
