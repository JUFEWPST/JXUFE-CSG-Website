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
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ja', iso: 'ja-JP', name: '日本語', file: 'ja.json' },
      { code: 'ko', iso: 'ko-KR', name: '한국어', file: 'ko.json' },
    ],
    defaultLocale: 'zh',
  },

  runtimeConfig: {
    public: {
      buildInfo: {
        builder: process.env.NUXT_PUBLIC_BUILDER || 'Manual Build',
        buildTime: process.env.NUXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
        commitHash: process.env.NUXT_PUBLIC_COMMIT_HASH || 'unknown'
      }
    }
  },

  app: {
    head: {
      title: '江西财经大学网络安全协会 - 共筑网络安全 坚守网络防线',
      link: [
        { rel: 'icon', href: '/favicon.svg' },
      ],
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        {
          name: "description",
          content: "江西财经大学网络安全协会成立于2016年9月，协会的宗旨是想全校师生普及网络安全知识、培养网络安全技术人才、互相交流、共同进步",
        },
        {
          name: "keywords",
          content: "江财网安协会,江西财经大学网络安全协会,网络安全协会,网络安全,CTF"
        }
      ],
    }
  },

  modules: ['@nuxtjs/i18n']
})
