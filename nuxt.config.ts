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
      },
      meta: [
        {
          name: "江西财经大学网络安全协会",
          content: "江西财经大学网络安全协会成立于2016年9月，协会的宗旨是想全校师生普及网络安全知识、培养网络安全技术人才、互相交流、共同进步",
        },
      ],
    }
  }
})
