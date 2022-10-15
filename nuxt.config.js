import eslintPlugin from 'vite-plugin-eslint'

export default defineNuxtConfig({
  ssr: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@pinia/nuxt', 'nuxt-proxy', '@nuxtjs/google-fonts', 'nuxt-icons', 'floating-vue/nuxt'],

  // 445, 474, 172, 439, 419, 296
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
      apiBase: '',
      theme: '',
      catalogType: '',
      useRegions: '',
      promoListType: '',
      yandexMetrikaID: '',
      yandexMapsKey: '',
      googleID: '',
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
      title: 'Thapl',
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
      // link: [
      //   { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      //   { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      //   { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      //   { rel: 'manifest', href: '/site.webmanifest' },
      //   { rel: 'mask-icon', href: '/safari-pinned-tab.svg' },
      // ],
      script: [
        {
          hid: 'gtm-script1',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-',
          defer: true,
          async: true,
        },
        {
          hid: 'gtm-script2',
          children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-');
        `,
        },
      ],
    },
  },
})
