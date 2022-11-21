import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  ssr: true,

  experimental: { writeEarlyHints: false, inlineSSRStyles: false },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@pinia/nuxt', 'nuxt-proxy', '@nuxtjs/google-fonts', 'nuxt-icons'],

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
      projectName: 'Thapl',
      apiBase: '',
      timezone: 'Europe/Moscow',
      theme: 'orange',
      catalogType: 'singlepage',
      promoListType: 1,
      useRegions: false,
      useSearch: true,
      useTestimonials: false,
      orderDeliveryFutureDays: false,
      orderDeliveryTimeSlots: false,
      takeawayOnly: false,
      footerNavTitle: 'Компания',

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
        ital: [400],
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
