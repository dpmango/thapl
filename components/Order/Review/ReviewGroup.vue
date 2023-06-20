<template>
  <div class="review">
    <OrderReviewHead title="Отзыв о заказе" :description="question.question" />

    <div class="review__body">
      <!-- product -->
      <div v-if="productReview" class="review__product">
        <div class="review__product-image-box">
          <div class="review__product-image">
            <UiImage :src="productReview.image" :alt="productReview.title" />
          </div>
        </div>
        <div class="review__product-title h6-title">
          <UiAtomLongWords :text="productReview.title" />
        </div>
      </div>

      <!-- answers -->
      <div v-if="answersShown" class="review__answers">
        <div v-for="answer in question.answers" :key="answer.id" class="review__option">
          <UiCheckbox
            :checked="checkedAnswersId.includes(answer.id)"
            @change="() => handleCheckboxToggle(answer)"
          >
            {{ answer.title }}
          </UiCheckbox>
        </div>
      </div>

      <!-- comment -->

      <template v-if="question.has_comment && commentShown">
        <div class="review__comment" :class="[uploaderShown && '_has-uploader']">
          <UiInput
            type="textarea"
            rows="3"
            :value="comment"
            :clearable="false"
            :error="errors.comment"
            @on-change="(v) => setFieldValue('comment', v)"
          />
        </div>

        <UiUploader v-if="uploaderShown" @on-change="(f: IUpload | null) => (upload = f)" />
      </template>

      <!-- like / dislike -->
      <template v-if="reactionsShown">
        <div v-if="!productReview" class="review__accent">
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

    <!-- actions -->
    <div v-if="!reactionMode || (reaction === 'dislike' && answersShown)" class="review__cta">
      <UiButton v-if="!last" @click="handleNext">Продолжить</UiButton>
      <UiButton v-if="last" @click="handleNext">Оставить отзыв</UiButton>

      <UiButton
        v-if="question.has_comment && !isDislikeQuestions && !last"
        theme="secondary"
        @click="handleCommentVisibility"
      >
        <template v-if="!commentShown">Добавить комментарий</template>
        <template v-else>Скрыть комментарий</template>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { IQuestion, IAnswer, ISendReviewAnswer, IUpload } from '~/interface'

const props = defineProps<{
  question: IQuestion
  last?: boolean
}>()

const productReview = computed(() => {
  return props.question.catalog_item
})

const emit = defineEmits(['onNext'])

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { comment: '' },
})

// реакции
const isDislikeQuestions = computed(
  () => props.question.answers.length === 0 && !props.question.has_comment
)

const reactionMode = computed(() => {
  return isDislikeQuestions.value || productReview.value
})

const reactionsShown = ref(!!reactionMode.value)

const reaction = ref('')

watch(
  () => reaction.value,
  (newVal) => {
    if (newVal === 'like') {
      handleNext()
    } else if (newVal === 'dislike') {
      if (productReview.value) {
        answersShown.value = true
        commentShown.value = true
        reactionsShown.value = false
      } else {
        handleNext()
      }
    }
  }
)

// загрузка фото
const uploaderShown = ref(
  props.last || !!(props.question.has_comment && props.question.answers.length === 0)
)

const upload = ref<IUpload | null>(null)

// комментарий
const commentShown = ref(!!(props.question.has_comment && props.question.answers.length === 0))

const handleCommentVisibility = () => {
  commentShown.value = !commentShown.value
}

const { value: comment } = useField<string>('comment', (v) => {
  if (!commentShown.value || reactionMode.value || props.last) return true
  return clearString(v).length >= 2 ? true : 'Введите комментарий'
})

// вопросы
const answersShown = ref(!productReview.value)
const checkedAnswersId = ref<number[]>([])

const handleCheckboxToggle = ({ id }: IAnswer) => {
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
    is_like: reaction.value ? reaction.value === 'like' : true,
    // photo_id?: number
  } as ISendReviewAnswer

  if (productReview.value) {
    emittedAnswer.cart_item_id = productReview.value.id
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
    margin-top: 16px;
  }
  &__comment {
    margin-top: 16px;
    &._has-uploader {
      :deep(textarea) {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
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
    margin: 24px auto 0;
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

  &__product {
    margin: 16px 0;
  }
  &__product-image-box {
    max-width: 190px;
    margin: 0 auto;
  }
  &__product-image {
    position: relative;
    z-index: 1;
    border-radius: 8px;
    font-size: 0;
    padding-bottom: var(--product-card-mini-ar);
    background: var(--color-bg);
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease-out;
    }
  }
  &__product-title {
    margin-top: 16px;
    text-align: center;
  }
}
</style>
