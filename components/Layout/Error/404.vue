<template>
  <div class="error">
    <div class="container">
      <div class="error__wrapper wysiwyg">
        <img src="~/assets/img/error-not-found.svg" alt="404" />
        <h1 class="h4-title">Ошибка 404</h1>
        <p class="text-m">
          Возможно, она когда-то была доступна по этой ссылке, но сейчас ее не существует.
          Попробуйте найти то, что ищете, начав с главной страницы.
        </p>
        <div class="error__cta">
          <UiButton type="button" to="/">Перейти на главную</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<styles lang="scss" scoped>
.error {
  &__wrapper {
    max-width: 432px;
    margin: 32px auto;
    min-height: calc(100vh - 215px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  &__cta {
    margin-top: 32px;
  }
}
</styles>
