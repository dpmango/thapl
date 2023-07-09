import { useToast } from 'vue-toastification/dist/index.mjs'
import type { IGeoCoords } from '~/interface'

export const useGeolocation = ({
  onGeolocationSuccess,
}: {
  onGeolocationSuccess: (coordinates: IGeoCoords) => any
}) => {
  const toast = useToast()
  const geolocationLoading = ref(false)

  const getUserLocation = () => {
    if (navigator.geolocation) {
      geolocationLoading.value = true
      navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure)
    } else {
      toast.error('Ваш браузер не поддерживает геолокацию')
      geolocationLoading.value = false
    }
  }

  const geolocationSuccess = async (position: any) => {
    if (!position.coords.latitude || !position.coords.longitude) {
      return null
    }

    geolocationLoading.value = true
    await onGeolocationSuccess(position.coords)

    geolocationLoading.value = false
  }

  const geolocationFailure = (positionError: any) => {
    try {
      if (positionError.code === 1) {
        toast.error('Разрешите геолокацию в браузере')
      } else if (positionError.code === 500) {
        toast.error('Ошибка, попробуйте еще раз')
      } else {
        throw new Error('unknown')
      }
    } catch {
      toast.error('Ошибка в определении координаты')
    }
  }

  return { geolocationLoading, getUserLocation, geolocationFailure }
}
