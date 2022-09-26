export const useHeaders = ({ api_token, user_token }) => {
  const headers = {}
  if (api_token) {
    headers['x-thapl-apitoken'] = api_token
  }
  if (user_token) {
    headers['x-thapl-authorization'] = user_token
  }

  return headers
}
