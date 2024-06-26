import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  ssr: true,

  experimental: { writeEarlyHints: false, inlineSSRStyles: false },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    'nuxt-proxy',
    '@nuxtjs/google-fonts',
    'nuxt-icons',
    '@nuxt/image-edge',
  ],

  piniaPersistedstate: {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 30 * 6,
      sameSite: false,
    },
    storage: 'cookies',
  },

  proxy: {
    options: {
      target: process.env.NUXT_PUBLIC_API_BASE,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      pathFilter: ['/api'],
    },
  },

  runtimeConfig: {
    public: {
      // базовые (тема)
      projectName: 'Thapl',
      apiBase: '',
      theme: 'orange',
      catalogType: 'singlepage',
      showCategoryName: true,
      categoryNameShadow: true,
      promoListType: 1,
      stopListType: 1,
      useRegions: false,
      useSearch: true,
      useTestimonials: false,
      useContacts: true,
      useWorkTimes: false,
      useHeaderMenu: false,
      takeawayOnly: false,
      footerNavTitle: 'Компания',
      loyaltyTitle: 'Бонусы',
      // заказ
      orderAskAuth: true,
      orderUsePacking: true,
      orderPackingCompact: 'Компактная',
      orderPackingSeparate: 'Отдельная',
      orderUseNotCall: false,
      orderNotCall: 'Не звонить',
      orderUseNotHeat: false,
      orderPaymentOptions: '1030,3,1',
      orderUseKino: false,
      // product
      isDisplayProductDesc: false,
      // вендоры
      yandexMetrikaId: '',
      yandexMapsKey: '',
      yandexMapsSuggestKey: '',
      googleId: '',

      geocoderSearchedCities: '',
      geocoderBoundedBy: '',
    },
  },

  build: {
    transpile: ['swiper', 'vee-validate', 'maska', '@vuepic/vue-datepicker'],
  },

  css: ['~/assets/css/app.scss'],

  googleFonts: {
    families: {
      // 'IBM+Plex+Sans': {
      //   wght: [300, 400, 500, 600, 700],
      // },
      Inter: {
        wght: [300, 400, 500, 600, 700],
      },
    },
  },

  i18n: {
    defaultLocale: 'ru',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/utilities/index.scss";',
        },
      },
    },
    plugins: [
      eslintPlugin({
        failOnError: false,
        cache: false,
      }),
    ],
  },

  nitro: {
    compressPublicAssets: true,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'UTF-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
})
