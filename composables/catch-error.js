import { useToast } from 'vue-toastification/dist/index.mjs'

export const useCatchError = (error, text, silent = false) => {
  const { $log } = useNuxtApp()

  // const { message, code } = error
  const toast = useToast()

  if (!silent) {
    toast.error(text || 'Ошибка, обновите страницу')
  }

  $log.warn(error)
}
