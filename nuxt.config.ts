// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      title: '江西财经大学网络安全协会',
      link: [
        { rel: 'icon', type: 'image/webp', href: '/favicon.webp' },
      ],
      htmlAttrs: {
        lang: 'zh-CN'
      }
    }
  }
})
