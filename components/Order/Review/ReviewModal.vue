<template>
  <UiModal name="review">
    <UiLoader v-if="!questions" position="overlay" />

    <template v-if="questions">
      <OrderReviewText />
    </template>
  </UiModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUiStore } from '~/store'

const { $env, $log } = useNuxtApp()

const ui = useUiStore()
const { modalParams, modal } = storeToRefs(ui)

const questions = ref(null)

const fetchQuestions = async () => {
  if (!modalParams.value?.id && modal.value.includes('review')) return

  const data = await useApi('order/get-order-questionnaire', {
    method: 'GET',
    headers: useHeaders(),
    params: {
      id: modalParams.value.id,
    },
  })

  if (data) {
    questions.value = data
  }
}

watch(
  () => modalParams.value?.id,
  (newid) => {
    fetchQuestions()
  }
)

onMounted(() => {
  fetchQuestions()
})

// Вначале показываем вопросы из массива additional_questions
// в виде https://www.figma.com/file/KqA5lKZ9AQdH2VTSjyJ2Fi/thapl-(31.05.2022)?node-id=453%3A2895&t=7SZHOg9jELabrEi9-4

// Потом для каждого элемента корзины смотрим есть ли в массиве вопросов items_questionary вопрос с cart_id соттветсвующим вопросу, если нет показываем default_question

// Правила отображения

// additional_questions показываем в виде https://www.figma.com/file/KqA5lKZ9AQdH2VTSjyJ2Fi/thapl-(31.05.2022)?node-id=453%3A2895&t=7SZHOg9jELabrEi9-4

// вопросы к блюдам https://www.figma.com/file/KqA5lKZ9AQdH2VTSjyJ2Fi/thapl-(31.05.2022)?node-id=453%3A2914&t=7SZHOg9jELabrEi9-4

// если отвечаем да - переходим к следующему вопросу
// если нет проверяем есть ли answers или has_comment
// если есть answers показываем https://www.figma.com/file/KqA5lKZ9AQdH2VTSjyJ2Fi/thapl-(31.05.2022)?node-id=453%3A2950&t=7SZHOg9jELabrEi9-4

// если max_answers - 0 можно выбрать любое количество ответов
// если 1 то надо переключаться между ответами
// если has_comment - то показываем кнопку добавить коментарий
// если answers пустой но has_comment - true сразу показываем https://www.figma.com/file/KqA5lKZ9AQdH2VTSjyJ2Fi/thapl-(31.05.2022)?node-id=453%3A2977&t=7SZHOg9jELabrEi9-4 можно прикрепить не более 1й фото

// После ответа на вопросы выводим https://www.figma.com/file/KqA5lKZ9AQdH2VTSjyJ2Fi/thapl-(31.05.2022)?node-id=453%3A2977&t=7SZHOg9jELabrEi9-4 можно прикрепить на более 4х фото
</script>

<style lang="scss" scoped>
.review {
  position: relative;
  min-height: 200px;
}
</style>
