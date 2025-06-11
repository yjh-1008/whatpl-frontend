// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', 'dayjs-nuxt'],
  css: ['@/assets/scss/main.scss'],

  postcss: {
    plugins: {
      tailwindcss: {}
    }
  },
  app: {
    baseURL: '/',
    head: {
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
      title: '왓플',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicons/favicon.ico'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      backEndBaseUrl: process.env.NUXT_PUBLIC_BACK_END_BASE_URL,
      backEnd365tJwt: process.env.NUXT_PUBLIC_BACK_END_365_JWT
    }
  },
  routeRules: {
    '/oauth2/callback/**': { ssr: false },
    '/recruitment/new': { ssr: false },
    '/recruitment/edit': { ssr: false }
  },
  vite: {
    server: {
      proxy: {
        '~/attachments/**': {
          target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/attachments/, ''),
          changeOrigin: true,
          secure: false
        },
        '~/projects/**': {
          target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/projects/, ''),
          changeOrigin: true,
          secure: false
        },
        '~/token/**': {
          target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/token/, ''),
          changeOrigin: true,
          secure: false
        },
        '~/images/**': {
          target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/images/, ''),
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
});
