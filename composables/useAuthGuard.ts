import { storeToRefs } from 'pinia'
import { useSessionStore } from '~/store'

export const useAuthGuard = () => {
  const sessionStore = useSessionStore()
  const { isAuthenticated } = storeToRefs(sessionStore)

  if (!isAuthenticated.value) return navigateTo('/')
}
