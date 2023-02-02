<template>
  <div class="error">
    <div class="container">
      <div class="error__wrapper">
        <UiAtomErrorMessage title="Оплата не прошла" image="error-default">
          <template #content>
            По какой-то неведомой причине оплата указанной банковской картой не прошла. Попробуйте
            еще раз или воспользуйтесь другими реквизитами.
          </template>
          <template #action>
            <UiButton type="button" to="/order">Попробовать еще раз</UiButton>
          </template>
        </UiAtomErrorMessage>
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
    .error {
      max-width: 100%;
    }
  }
}

@include r($md) {
  .error {
    &__wrapper {
      margin: 68px auto;
      min-height: 1px;
    }
  }
}

@include r($sm) {
  .error {
    &__wrapper {
      margin: 52px auto;
    }
  }
}
</styles>
