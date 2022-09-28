import { useSessionStore } from '~/store'

export const useHeaders = () => {
  const session = useSessionStore()

  const { api_token, user_token, region } = session

  const headers = {}
  if (api_token) {
    headers['x-thapl-apitoken'] = api_token
  }
  if (user_token) {
    headers['x-thapl-authorization'] = user_token
  }
  if (user_token) {
    headers['x-thapl-region-id'] = region
  }

  return headers
}
