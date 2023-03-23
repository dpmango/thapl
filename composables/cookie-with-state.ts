export const useCookieState = (name: string, maxAge?) => {
  const cookie = useCookie(name, { maxAge: maxAge || 60 * 60 * 24 * 30 * 6 })
  const state = useState(name, () => cookie.value)

  watch(
    state,
    () => {
      cookie.value = state.value
    },
    { deep: true }
  )

  return state
}
