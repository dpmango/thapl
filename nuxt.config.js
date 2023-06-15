import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  ssr: true,

  experimental: { writeEarlyHints: false, inlineSSRStyles: false },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-proxy',
    '@nuxtjs/google-fonts',
    'nuxt-icons',
    '@nuxt/image-edge',
  ],

  piniaPersistedstate: {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 30 * 6,
      sameSite: 'strict',
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
      promoListType: 1,
      stopListType: 1,
      useRegions: false,
      useSearch: true,
      useTestimonials: false,
      useContacts: true,
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
      // product
      isDisplayProductDesc: false,
      // вендоры
      yandexMetrikaID: '',
      yandexMapsKey: '',
      googleID: '',

      geocoderSearchedCities: '',
      geocoderBoundedBy: '',
    },
  },

  build: {
    transpile: ['swiper', 'vee-validate', 'maska'],
  },

  css: ['~/assets/css/app.scss'],

  googleFonts: {
    families: {
      Inter: {
        wght: [400, 500, 600, 700],
        ital: [],
      },
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
