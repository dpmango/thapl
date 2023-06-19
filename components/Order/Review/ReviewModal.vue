<template>
  <UiModal name="review">
    <UiLoader v-if="!quiz" position="overlay" />

    <template v-if="quiz">
      <div v-if="!quizEnded" class="review__wrapper-questions">
        <template v-for="question in quizQuestions" :key="question.id">
          <OrderReviewGroup
            v-if="question.id === activeQuizId"
            :question="question"
            @on-next="handleNextQuestion"
          />
        </template>
      </div>

      <template v-else>
        <OrderReviewGroup :question="lastQuestion" :last="true" @on-next="postReview" />
        <UiLoader v-if="quizLoading" position="overlay" />
      </template>
    </template>
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
} from '~/interface'

const { $log } = useNuxtApp()
const toast = useToast()

const ui = useUiStore()
const { modalParams, modal } = storeToRefs(ui)

const quiz = ref<IReviewQuestionnaire | null>(null)
const quizQuestions = ref<IQuestion[]>([])
const activeQuizId = ref<number | null>(null)
const quizAnswers = ref<ISendReviewAnswer[]>([])
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

const handleNextQuestion = (answer: ISendReviewAnswer) => {
  if (quizQuestions.value.length === 0) return

  const curIndex = quizQuestions.value.findIndex((x) => x.id === activeQuizId.value)
  const nextQuestion = quizQuestions.value.find((_, idx) => idx > curIndex)

  quizAnswers.value.push(answer)

  if (nextQuestion) {
    activeQuizId.value = nextQuestion.id
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

  quiz.value = data
  activeQuizId.value = data.additional_questions[0]?.id || null
  quizQuestions.value = [...data.additional_questions]
  quizEnded.value = false
}

const postReview = async (lastAnswer: ISendReviewAnswer) => {
  if (!modalParams.value?.id && !modal.value.includes('review')) return

  quizLoading.value = true

  const reviewPostBody = {
    order_id: modalParams.value?.id,
    common_comment: lastAnswer.user_comment,
    answers: quizAnswers.value,
  } as ISendReviewDto

  const data = (await useApi('order/send-questionnaire', {
    method: 'POST',
    headers: useHeaders(),
    body: reviewPostBody,
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
    }
  }
)

ui.setModal({ name: 'review', params: { id: 10 } })

onMounted(() => {
  fetchQuestions()
})
</script>

<style lang="scss" scoped>
.review {
  position: relative;
  min-height: 200px;
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
}
</style>
