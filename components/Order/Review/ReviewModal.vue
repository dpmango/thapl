<template>
  <UiModal name="review">
    <div class="review">
      <template v-if="quizQuestions.length">
        <!-- секции -->
        <div v-if="!quizEnded" class="review__wrapper-questions">
          <template v-for="(question, idx) in quizQuestions" :key="question.id">
            <OrderReviewGroup
              v-if="idx === activeQuizIdx"
              :question="question"
              @on-next="handleNextQuestion"
            />
          </template>
        </div>

        <!-- финальный вопрос -->
        <template v-else>
          <OrderReviewGroup :question="lastQuestion" :last="true" @on-next="postReview" />
          <UiLoader v-if="quizLoading" position="overlay" />
        </template>
      </template>

      <UiLoader
        v-if="modal.includes('review') && quizQuestions.length === 0"
        position="overlay"
        :loading="true"
      />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useUiStore } from '~/store'
import type {
  IReviewQuestionnaire,
  IQuestion,
  ISendReviewDto,
  ISendReviewAnswer,
  ISendReviewAnswerUpload,
  IUpload,
} from '~/interface'

const { $log } = useNuxtApp()
const toast = useToast()

const ui = useUiStore()
const { modalParams, modal } = storeToRefs(ui)

const quizQuestions = ref<IQuestion[]>([])
const activeQuizIdx = ref<number>(0)
const quizAnswers = ref<ISendReviewAnswerUpload[]>([])
const quizEnded = ref(false)
const quizLoading = ref(false)

const lastQuestion = computed(() => ({
  id: 999,
  question: 'Мы обрабатываем все отзывы, чтобы постоянно улучшать качество работы',
  has_comment: true,
  max_answers: null,
  answers: [],
  cart_id: null,
}))

const handleNextQuestion = (answer: ISendReviewAnswerUpload) => {
  if (quizQuestions.value.length === 0) return
  const nextQuestionIndex = quizQuestions.value.findIndex((_, idx) => idx > activeQuizIdx.value)

  quizAnswers.value.push(answer)

  if (nextQuestionIndex !== -1) {
    activeQuizIdx.value = nextQuestionIndex
  } else {
    quizEnded.value = true
  }
}

const fetchQuestions = async () => {
  if (!modalParams.value?.id && !modal.value.includes('review')) return
  const data = (await useApi('order/get-order-questionnaire', {
    method: 'GET',
    headers: useHeaders(),
    params: {
      id: modalParams.value?.id,
    },
  })) as IReviewQuestionnaire

  if (!data) {
    toast.error('Ошибка, обратитесь к администратору')
    return
  }

  const quizProducts = data.order.cart.map((x) => ({
    ...data.default_question,
    cart_id: x.catalog_item.id,
    catalog_item: x.catalog_item,
  }))

  const quizCombined = [...quizProducts, ...data.additional_questions] as IQuestion[]
  // $log.log({ quizCombined })

  quizQuestions.value = quizCombined
  activeQuizIdx.value = 0
  quizEnded.value = false
}

const postReview = async (lastAnswer: ISendReviewAnswerUpload) => {
  if (!modalParams.value?.id && !modal.value.includes('review')) return

  quizLoading.value = true

  const reviewPostBody = {
    order_id: modalParams.value?.id,
    common_comment: lastAnswer.user_comment,
    answers: quizAnswers.value,
  } as ISendReviewDto

  const formData = new FormData()
  let useFormData = false

  $log.log({ postData: reviewPostBody })

  // переключатель на formData если исползуются изображения
  if (reviewPostBody.answers.some((a) => a.uploads?.length || lastAnswer.uploads?.length)) {
    const toBeUploaded = reviewPostBody.answers.reduce((acc, answer) => {
      if (answer.uploads?.length) {
        acc = [...acc, ...answer.uploads]
      }
      return acc
    }, [] as IUpload[])

    let processFiles = [...toBeUploaded]
    if (lastAnswer.uploads) {
      processFiles = [...processFiles, ...lastAnswer.uploads]
    }

    processFiles.forEach((upload, idx) => {
      if (upload.file) {
        formData.append(`common_photo_${idx + 1}`, upload.file)
      }
    })

    Object.keys(reviewPostBody).forEach((key) => {
      let data = JSON.stringify(reviewPostBody[key])
      if (key === 'answers') {
        data = JSON.stringify(reviewPostBody[key].map((x) => ({ ...x, uploads: null })))
      }

      formData.append(key, data)
    })

    useFormData = true
  }

  const data = (await useApi('order/send-questionnaire', {
    method: 'POST',
    headers: useHeaders(),
    body: useFormData ? formData : reviewPostBody,
  }).catch((err) => useCatchError(err, 'Ошибка, обратитесь к администратору'))) as any

  quizLoading.value = false

  $log.log({ postReviewResponce: data })

  if (data) {
    ui.closeAllModals()
  }
}

watch(
  () => modalParams.value?.id,
  (newid) => {
    if (modal.value.includes('review') && newid) {
      fetchQuestions()
    } else {
      quizQuestions.value = []
      quizAnswers.value = []
      activeQuizIdx.value = 0
      quizEnded.value = false
    }
  }
)

// ui.setModal({ name: 'review', params: { id: 10 } })
onMounted(() => {
  fetchQuestions()
})
</script>

<style lang="scss" scoped>
.review {
  position: relative;
  min-height: 300px;
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
}
</style>
