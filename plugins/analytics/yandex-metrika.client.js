/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { useRouter } from '#imports'

export default defineNuxtPlugin(() => {
  let ready = false
  const config = useRuntimeConfig()

  // Mark when the router has completed the initial navigation.
  useRouter()
    .isReady()
    .then(() => {
      ready = true
    })

  function create() {
    if (!ready) {
      // Don't record a duplicate hit for the initial navigation.
      ;(function (m, e, t, r, i, k, a) {
        m[i] =
          m[i] ||
          function () {
            ;(m[i].a = m[i].a || []).push(arguments)
          }
        m[i].l = 1 * new Date()
        ;(k = e.createElement(t)),
          (a = e.getElementsByTagName(t)[0]),
          (k.async = 1),
          (k.src = r),
          a.parentNode.insertBefore(k, a)
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

      ym(config.public.yandexMetrikaID, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        triggerEvent: true,
        ecommerce: true,
      })
    }

    useRouter().afterEach((to, from) => {
      ym(config.public.yandexMetrikaID, 'hit', to.fullPath, {
        referer: from.fullPath,
        title: to.meta.title,
      })
    })
  }

  if (window.ym === undefined && config.public.yandexMetrikaID) {
    create()
  }
})
