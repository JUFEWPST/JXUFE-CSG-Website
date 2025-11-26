<template>
    <main ref="scrollContainer" class="snap-container">
        <section
            class="min-h-screen relative bg-linear-to-br from-blue-50 to-blue-100 dark:bg-none flex flex-col items-center justify-center px-4 scroll-section">
            <div class="text-center space-y-4 transform transition-all duration-500 hover:scale-105">
                <h1 class="text-5xl md:text-6xl font-bold tracking-wide">
                    <AnimationTypingCursor :text="t('meta.school')" :blink-cursor="false" :show-cursor="false"
                        :start-delay="100">
                    </AnimationTypingCursor>
                </h1>
                <h2 class="text-4xl md:text-5xl font-semibold text-(--anzu-accent-text) bg-clip-text">
                    <AnimationTypingCursor :text="t('meta.guild')" :start-delay="100"></AnimationTypingCursor>
                </h2>
            </div>
            <div class="absolute bottom-10 flex flex-col items-center">
                <p class="text-xl text-center font-bold mb-2">{{ t("pages.home.slogan") }}</p>
                <AnimationScrollDown />
            </div>
        </section>
        <section
            class="sm:h-auto md:min-h-screen bg-linear-to-br relative from-blue-50 to-white dark:bg-none flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:py-10 gap-4 sm:gap-6 md:gap-8 md:flex-row box-border scroll-section">
            <div class="w-full max-w-screen-sm md:max-w-none md:w-1/3 flex justify-center">
                <h3
                    class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white p-3 sm:p-4 border-b-4 border-(--anzu-primary)">
                    {{ t('pages.home.aboutUs.title') }}
                </h3>
            </div>
            <div
                class="w-full max-w-screen-sm md:max-w-2xl md:w-1/2 bg-white dark:bg-[#1E1E1E] p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mb-4 md:mb-0">
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    <i18n-t keypath="pages.about.index.intro.p1" tag="span">
                        <template #default>
                            <span class="font-bold text-(--anzu-accent-hover)">{{ t("meta.fullName") }}</span>
                        </template>
                    </i18n-t>
                </p>
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    <i18n-t keypath="pages.about.index.intro.p2" tag="span">
                        <template #highlighted>
                            <span
                                class="font-bold text-(--anzu-accent-hover)">{{ t('pages.about.index.intro.highlightedText') }}</span>
                        </template>
                    </i18n-t>
                </p>
                <NuxtLink to="/about"
                    class="mt-4 inline-block text-sm font-bold text-(--anzu-accent-hover) transition-colors duration-200 relative group">
                    {{ t('pages.home.aboutUs.more') }}
                    <span
                        class="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 dark:bg-gray-600 group-hover:w-full transition-all duration-300"></span>
                </NuxtLink>
                <div class="mt-4 sm:mt-6">
                    <h4 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2 dark:text-[#E5E5E5]">
                        {{ t('pages.home.participate.title') }}</h4>
                    <div class="flex flex-wrap gap-1 sm:gap-2">
                        <span
                            class="px-2 sm:px-3 py-1 bg-(--anzu-primary-bg) text-(--anzu-primary-pressed) rounded-full text-xs sm:text-sm font-medium hover:bg-(--anzu-primary) hover:text-white transition-colors">ISCC</span>
                        <span
                            class="px-2 sm:px-3 py-1 bg-[#f7fbff] text-(--anzu-primary-pressed) rounded-full text-xs sm:text-sm font-medium hover:bg-(--anzu-primary) hover:text-white transition-colors">CISCN</span>
                        <span
                            class="px-2 sm:px-3 py-1 bg-(--anzu-primary-bg) text-(--anzu-primary-pressed) rounded-full text-xs sm:text-sm font-medium hover:bg-(--anzu-primary) hover:text-white transition-colors">联合比赛</span>
                        <span
                            class="px-2 sm:px-3 py-1 bg-(--anzu-primary-bg) text-(--anzu-primary-pressed) rounded-full text-xs sm:text-sm font-medium hover:bg-(--anzu-primary) hover:text-white transition-colors">校园挖洞活动</span>
                    </div>
                </div>
            </div>
        </section>
        <section
            class="relative min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 scroll-section bg-white dark:bg-transparent">
            <div class="w-full md:w-1/3 flex justify-center">
                <h3
                    class="text-4xl md:text-5xl font-bold p-4 border-b-4 text-gray-800 dark:text-white border-(--anzu-primary)">
                    {{ t('pages.home.recentNews.title') }}
                </h3>
            </div>
            <div class="w-full md:w-1/2 max-w-2xl">
                <div v-if="loading" class=" items-center flex justify-center">
                    <AnimationLoadingSpinner size="xl2" color="[var(--anzu-accent-hover)]">
                    </AnimationLoadingSpinner>
                </div>
                <ul v-else-if="archives">
                    <ArticleBlock v-for="archive in archives" :key="archive.id"
                        :datetime="new Date(archive.createdAt).toLocaleString()"
                        :linkto="`/archive/${archive.documentId}`" :title="archive.title" :tags="archive.tags?.tags" />
                </ul>
                <div v-else-if="error">
                    <ErrorDisplay :errorData="error"></ErrorDisplay>
                </div>
            </div>
            <div class="absolute w-full flex justify-center bottom-6 sm:bottom-4">
                <NuxtLink to="/archive"
                    class="text-base sm:text-xl font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group">
                    {{ t('pages.home.recentNews.more') }}
                    <span
                        class="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 dark:bg-gray-600 group-hover:w-full transition-all duration-300"></span>
                </NuxtLink>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import type { Archive } from '~/types/archives'

const { t } = useI18n()

useHead(() => ({
    title: t('pages.home.meta.title'),
    meta: [
        {
            name: 'description',
            content: t('pages.home.meta.description')
        }
    ]
}))

const { data: archives, loading, error, get } = useApi<Archive[]>()

// 获取文章列表
const loadArticles = async () => {
    await get(
        `/archives?pagination[page]=1&pagination[pageSize]=4&filters[type][$eq]=announcement`
    )
}
void loadArticles()

const scrollContainer = ref<HTMLElement | null>(null)

let isScrolling = false
const scrollTimeout = 800 // 防抖时间

const lockScroll = () => {
    isScrolling = true
    window.setTimeout(() => {
        isScrolling = false
    }, scrollTimeout)
}

const getSections = (): HTMLElement[] =>
    Array.from(document.querySelectorAll<HTMLElement>('.scroll-section'))

const scrollToSection = (index: number): void => {
    if (isScrolling) return

    const sections = getSections()

    // 处理滚动到 Footer
    if (index >= sections.length) {
        const footer = document.querySelector('footer') as HTMLElement | null
        if (footer) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            })
        }
        lockScroll()
        return
    }

    // 处理滚动到顶部
    if (index < 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        lockScroll()
        return
    }

    // 正常滚动到区块
    sections[index]!.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })

    lockScroll()
}

const getCurrentSectionIndex = (): number => {
    const sections = getSections()
    const scrollPosition = window.scrollY || window.pageYOffset

    // 计算当前最接近视口的区块
    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i]!.offsetTop
        const sectionBottom = sectionTop + sections[i]!.offsetHeight

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            return i
        }
    }

    // 如果不在任何区块内，返回最接近的区块
    let closestIndex = 0
    let minDistance = Infinity

    sections.forEach((section, idx) => {
        const sectionTop = section.offsetTop
        const distance = Math.abs(scrollPosition - sectionTop)

        if (distance < minDistance) {
            minDistance = distance
            closestIndex = idx
        }
    })

    return closestIndex
}

// 鼠标滚轮事件处理
const handleWheel = (e: WheelEvent): void => {
    if (isScrolling) return
    e.preventDefault()

    const currentIndex = getCurrentSectionIndex()

    if (e.deltaY > 0) {
        scrollToSection(currentIndex + 1)
    } else if (e.deltaY < 0) {
        scrollToSection(currentIndex - 1)
    }
}

let touchStartY = 0

const handleTouchStart = (e: TouchEvent): void => {
    touchStartY = e.touches[0]!.clientY
}

const handleTouchEnd = (e: TouchEvent): void => {
    const touchEndY = e.changedTouches[0]!.clientY
    const deltaY = touchEndY - touchStartY
    const currentIndex = getCurrentSectionIndex()

    if (deltaY < -50) {
        scrollToSection(currentIndex + 1)
    } else if (deltaY > 50) {
        scrollToSection(currentIndex - 1)
    }
}

onMounted(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchend', handleTouchEnd)
})
</script>

<style>
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.hover-float:hover {
    animation: float 2s ease-in-out infinite;
}
</style>
