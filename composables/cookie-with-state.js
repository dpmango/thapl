export const useCookieState = (name) => {
  const cookie = useCookie(name, { maxAge: 60 * 60 * 24 * 30 * 6 })
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
