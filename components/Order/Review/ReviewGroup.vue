<template>
  <div class="review">
    <OrderReviewHead title="Отзыв о заказе" :description="question.question" />

    <div class="review__body">
      <template v-if="question.has_comment && commentShown">
        <UiInput
          type="textarea"
          rows="3"
          :value="comment"
          :clearable="false"
          :error="errors.comment"
          @on-change="(v) => setFieldValue('comment', v)"
        />
      </template>

      <div v-if="question.answers" class="review__answers">
        <div v-for="answer in question.answers" :key="answer.id" class="review__option">
          <UiCheckbox
            :checked="checkedAnswersId.includes(answer.id)"
            @change="() => handleCheckboxToggle(answer)"
          >
            {{ answer.title }}
          </UiCheckbox>
        </div>
      </div>

      <template v-if="likeMode">
        <div class="review__accent">
          <span class="text-m">{{ question.question }}</span>
        </div>

        <div class="review__reaction">
          <UiButton icon-left="dislike" theme="muted" @click="() => (reaction = 'dislike')">
            Нет
          </UiButton>
          <UiButton icon-left="like" @click="() => (reaction = 'like')">Да</UiButton>
        </div>
      </template>
    </div>

    <div v-if="!likeMode" class="review__cta">
      <UiButton v-if="!last" @click="handleNext">Продолжить</UiButton>
      <UiButton v-if="question.has_comment" theme="secondary" @click="handleCommentVisibility">
        <template v-if="!commentShown">Добавить комментарий</template>
        <template v-else>Скрыть комментарий</template>
      </UiButton>
      <UiButton v-if="last" @click="handleNext">Оставить отзыв</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { IQuestion, IAnswer, ISendReviewAnswer } from '~/interface'

const props = defineProps<{
  question: IQuestion
  last?: boolean
}>()

const emit = defineEmits(['onNext'])

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { comment: '' },
})

// реакции
const likeMode = computed(() => {
  return props.question.answers.length === 0 && !props.question.has_comment
})

const reaction = ref('')

watch(
  () => reaction.value,
  (newVal) => {
    if (newVal) {
      handleNext()
    }
  }
)

// комментарий
const commentShown = ref(!!(props.question.has_comment && props.question.answers.length === 0))

const handleCommentVisibility = () => {
  commentShown.value = !commentShown.value
}

const { value: comment } = useField<string>('comment', (v) => {
  if (!commentShown.value || likeMode.value || props.last) return true
  return clearString(v).length >= 2 ? true : 'Введите комментарий'
})

// вопросы
const checkedAnswersId = ref<number[]>([])

const handleCheckboxToggle = ({ id, label }: IAnswer) => {
  const hasMaxAnswer = props.question.max_answers === 1

  if (checkedAnswersId.value.includes(id)) {
    checkedAnswersId.value = checkedAnswersId.value.filter((x) => x !== id)
  } else {
    if (hasMaxAnswer) {
      checkedAnswersId.value = [id]
      return
    }
    checkedAnswersId.value = [...checkedAnswersId.value, id]
  }
}

// валидация кнопки "далее"
const handleNext = async () => {
  if (props.question.has_comment) {
    const { valid, errors } = await validate()
    if (!valid) return
  }
  if (props.question.max_answers === 1) {
    if (checkedAnswersId.value.length > 1) return
  }

  const emittedAnswer = {
    question_id: props.question.id,
    user_comment: comment.value,
    // cart_item_id?: number
    // photo_id?: number
  } as ISendReviewAnswer

  if (likeMode.value) {
    emittedAnswer.is_like = reaction.value === 'like'
  }
  if (checkedAnswersId.value.length > 0) {
    emittedAnswer.answers = checkedAnswersId.value
  }

  emit('onNext', emittedAnswer)
}
</script>

<style lang="scss" scoped>
.review {
  &__body {
    max-width: 304px;
    margin: 24px auto 0;
  }
  &__answers {
  }
  &__option {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  &__accent {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    border-radius: 12px;
    text-align: center;
    font-weight: 500;
    padding: 32px 24px;
    min-height: 240px;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 304px;
    margin: 16px auto 0;
    .button {
      width: 100%;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }

  &__reaction {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 304px;
    margin: 28px auto 0;
    .button {
      width: calc(50% - 8px);
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
