<template>
    <main class="bg-(--md-sys-color-surface-container-lowest) px-4 py-2 box-border">
        <section ref="aboutRef">
            <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-(--md-sys-color-on-surface)">
                {{ t('pages.home.aboutUs.title') }}
            </h3>
            <div class="space-y-2 text-(--md-sys-color-on-surface) leading-relaxed">
                <p class="text-sm sm:text-base md:text-lg">
                    <i18n-t keypath="pages.about.index.intro.p1" tag="span">
                        <template #default>
                            <span class="font-bold text-(--md-sys-color-primary)">
                                {{ t("meta.fullName") }}
                            </span>
                        </template>
                    </i18n-t>
                </p>
                <p class="text-sm sm:text-base md:text-lg">
                    <i18n-t keypath="pages.about.index.intro.p2" tag="span">
                        <template #highlighted>
                            <span class="font-bold text-(--md-sys-color-primary)">
                                {{ t('pages.about.index.intro.highlightedText') }}
                            </span>
                        </template>
                    </i18n-t>
                </p>
                <div class="mt-8">
                    <h4 class="text-base sm:text-lg font-semibold text-(--md-sys-color-on-surface) mb-3">
                        {{ t('pages.home.participate.title') }}
                    </h4>
                    <div class="flex flex-wrap gap-2 sm:gap-3 justify-center">
                        <span class="chip">ISCC</span>
                        <span class="chip bg-(--md-sys-color-surface-container-high)">CISCN</span>
                        <span class="chip">联合比赛</span>
                        <span class="chip">校园挖洞活动</span>
                    </div>
                </div>

                <div class="mt-8 flex flex-wrap gap-5 justify-center">
                    <NuxtLink to="/about"
                        class="text-sm sm:text-base font-bold text-(--md-sys-color-primary) hover:opacity-80 transition">
                        {{ t('pages.home.aboutUs.more') }} →
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section ref="newsRef" class="mx-auto">
            <div class="flex items-end justify-between gap-4 mb-7 sm:mb-9">
                <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-(--md-sys-color-on-surface)">
                    {{ t('pages.home.recentNews.title') }}
                </h3>

                <NuxtLink to="/archive" class="text-sm sm:text-base font-semibold text-(--md-sys-color-on-surface-variant)
                 hover:text-(--md-sys-color-on-surface) transition">
                    {{ t('pages.home.recentNews.more') }} →
                </NuxtLink>
            </div>

            <div class="space-y-4 sm:space-y-5">
                <div v-if="loading" class="flex justify-center py-10">
                    <AnimationLoadingSpinner size="xl2" color="[var(--md-sys-color-primary)]" />
                </div>

                <div v-else-if="error">
                    <ErrorDisplay :errorData="error" />
                </div>

                <ul v-else-if="archives?.length" class="space-y-3 sm:space-y-4">
                    <ArticleBlock v-for="archive in archives" :key="archive.id"
                        :datetime="new Date(archive.createdAt).toLocaleString()"
                        :linkto="`/archive/${archive.documentId}`" :title="archive.title" :tags="archive.tags?.tags" />
                </ul>

                <div v-else class="py-12 text-center text-(--md-sys-color-outline)">
                    暂无动态，去归档页看看吧～
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import type { Archive } from '~/types/archives'
import gsap from 'gsap'

const { t } = useI18n()

useHead(() => ({
    title: t('pages.home.meta.title'),
    meta: [{ name: 'description', content: t('pages.home.meta.description') }]
}))

const { data: archives, loading, error, get } = useApi<Archive[]>()
const loadArticles = async () => {
    await get(`/archives?pagination[page]=1&pagination[pageSize]=4&filters[type][$eq]=announcement`)
}
void loadArticles()

const aboutRef = ref<HTMLElement | null>(null)
const newsRef = ref<HTMLElement | null>(null)

onMounted(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const targets = [aboutRef.value, newsRef.value].filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return
            gsap.from(e.target, { opacity: 0, y: 12, duration: 0.55, ease: 'power2.out' })
            io.unobserve(e.target)
        })
    }, { threshold: 0.12 })
    targets.forEach(t => io.observe(t))
})
</script>

<style scoped>
@reference "tailwindcss";

.chip {
    @apply px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-high) border border-(--md-sys-color-outline-variant) dark:border-none text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container) hover:border-(--md-sys-color-primary-container) transition-colors;
}
</style>
