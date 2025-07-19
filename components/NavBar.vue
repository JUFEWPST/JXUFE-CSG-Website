<template>
    <header ref="headerRef" class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out"
        :style="headerStyles">
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <div class="absolute -right-10 -top-10 text-blue-100/70 dark:text-gray-700/80 text-9xl transition-opacity duration-500"
                :style="{ opacity: currentBgOpacity }">✧</div>
            <div class="absolute -left-5 -bottom-5 text-pink-100/70 dark:text-gray-700/80 text-7xl transition-opacity duration-500"
                :style="{ opacity: currentBgOpacity }">♡</div>
        </div>

        <div class="container mx-auto px-4 py-4 relative z-10">
            <nav class="flex items-center justify-between" role="navigation" aria-label="主导航">
                <div class="text-xl font-bold hover:text-primary-500 items-center flex">
                    <span class="relative">
                        江西财经大学网络安全协会
                        <span
                            class="absolute right-0 top-1/2 -translate-y-1/2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">✦</span>
                    </span>
                    <ToggleTheme class="ml-1"></ToggleTheme>
                </div>
                <div
                    class="absolute left-1/2 transform -translate-x-1/2 w-full max-w-[50vw] pointer-events-none hidden md:inline">
                    <div v-if="route.path.startsWith('/archive/') && navArticleInfo.title"
                        class="mx-auto transition-all duration-500 text-center" :style="{
                            opacity: articleTitleOpacity,
                            transform: `translateY(${titleOffset}px)`,
                            width: 'fit-content'
                        }">
                        <div class="text-lg font-semibold leading-tight transition-all duration-700" :class="{
                            'translate-y-2 opacity-0': !titleVisible,
                            'translate-y-0 opacity-100': titleVisible
                        }">
                            {{ navArticleInfo.title }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 justify-center gap-4 leading-tight transition-all duration-1000"
                            :class="{
                                'translate-y-2 opacity-0': !subtitleVisible,
                                'translate-y-0 opacity-70': subtitleVisible
                            }">
                            <span v-if="navArticleInfo.publishedAt">发布于 {{ navArticleInfo.publishedAt }}</span>
                            <span v-if="navArticleInfo.publisher">作者 {{ navArticleInfo.publisher }}</span>
                        </div>
                    </div>
                </div>

                <!-- 桌面导航 -->
                <div class="hidden md:flex space-x-6">
                    <template v-for="link in navLinks" :key="link.path">
                        <NuxtLink :to="link.path" class="nav-link"
                            :class="{ 'active-link': $route.path === link.path }">
                            <span class="relative">
                                {{ link.label }}
                                <span v-if="$route.path === link.path"
                                    :class="`absolute -top-2 -right-3 text-${link.color}-400 text-xs`">{{ link.icon }}</span>
                            </span>
                        </NuxtLink>
                    </template>
                </div>

                <!-- 移动菜单按钮 -->
                <button
                    class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-500 focus:outline-none relative"
                    aria-label="打开菜单" @click.stop="toggleMenu">
                    <Bars3Icon v-if="!isMenuOpen" class="w-8 h-8"></Bars3Icon>
                    <XMarkIcon v-else class="w-8 h-8"></XMarkIcon>
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-75"
                        v-if="isMenuOpen"></span>
                </button>
            </nav>

            <!-- 移动导航 -->
            <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
                :style="{ maxHeight: isMenuOpen ? '500px' : '0' }" :aria-hidden="!isMenuOpen">
                <div class="mt-4 pb-4 relative">
                    <div class="absolute -top-4 right-4 text-pink-300 text-xl opacity-70">✧</div>
                    <div class="absolute -bottom-4 left-4 text-blue-300 text-xl opacity-70">✦</div>
                    <template v-for="link in navLinks" :key="`mobile-${link.path}`">
                        <NuxtLink :to="link.path" class="mobile-nav-link"
                            :class="{ 'mobile-active-link': $route.path === link.path }" @click="closeMenu">
                            <span class="relative">
                                {{ link.label }}
                                <span v-if="$route.path === link.path"
                                    :class="`absolute -top-1 -right-4 text-${link.color}-400 text-sm`">{{ link.icon }}</span>
                            </span>
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ToggleTheme from './ToggleTheme.vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const route = useRoute()
const navArticleInfo = useState('navArticleInfo', () => ({
    title: '',
    publishedAt: '',
    publisher: ''
}))

const navLinks = [
    { path: '/', label: '首页', icon: '✧', color: 'pink' },
    { path: '/archive', label: '归档', icon: '✦', color: 'blue' },
    { path: '/about', label: '关于协会', icon: '✧', color: 'purple' },
    { path: '/links', label: '相关链接', icon: '✦', color: 'yellow' }
]

const titleVisible = ref(false)
const subtitleVisible = ref(false)
const titleOffset = ref(0)
const opacity = ref(0)
const headerRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
let animationFrameId: number | null = null

const currentBgOpacity = computed(() => isMenuOpen.value ? 0.8 : opacity.value * 0.8)

const articleTitleOpacity = computed(() => {
    const baseOpacity = route.path.startsWith('/archive/') ? Math.min(opacity.value * 1.5, 1) : 0
    return baseOpacity * (titleVisible.value ? 1 : 0.5)
})

const headerStyles = computed(() => {
    const showBlurEffect = opacity.value > 0.1 || isMenuOpen.value
    return {
        backgroundColor: `rgba(var(--nav-bg-rgb), ${currentBgOpacity.value})`,
        backdropFilter: `blur(${isMenuOpen.value ? 10 : Math.min(opacity.value * 12, 10)}px)`,
        boxShadow: showBlurEffect ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
        borderBottom: showBlurEffect ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
    }
})

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

const handleScroll = () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)

    animationFrameId = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop
        const rawOpacity = Math.min(scrollPosition / 150, 0.85)
        opacity.value = easeOutCubic(rawOpacity)
        titleOffset.value = Math.min(scrollPosition * 0.1, 10)
    })
}

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
const closeMenu = () => isMenuOpen.value = false

const handleClickOutside = (event: MouseEvent) => {
    if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
        isMenuOpen.value = false
    }
}

onMounted(() => {
    document.documentElement.style.setProperty('--nav-bg-rgb', '255, 255, 255')
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClickOutside)
    handleScroll()

    // 标题浮现动画
    setTimeout(() => {
        titleVisible.value = true
        setTimeout(() => subtitleVisible.value = true, 300)
    }, 500)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleClickOutside)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
header {
    will-change: opacity, background-color, backdrop-filter;
    transition:
        background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
        backdrop-filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link {
    color: inherit;
    transition: color 0.3s ease;
    position: relative;
}

.nav-link:hover {
    color: var(--color-primary-pressed);
}

.active-link {
    color: var(--color-primary-500);
    font-weight: 500;
    position: relative;
}

.mobile-nav-link {
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    color: inherit;
    transition:
        background-color 0.3s ease,
        color 0.3s ease;
    position: relative;
}

.mobile-nav-link:hover {
    background-color: rgba(243, 244, 246, 0.8);
    color: var(--color-primary-pressed);
}

.mobile-active-link {
    color: var(--color-primary-500);
    font-weight: 500;
}

.dark header {
    --nav-bg-rgb: 17, 24, 39;
    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

.dark .mobile-nav-link:hover {
    background-color: rgba(31, 41, 55, 0.8);
}

.dark .nav-link:hover,
.dark .mobile-nav-link:hover {
    color: var(--color-primary-300);
}

.dark .active-link,
.dark .mobile-active-link {
    color: var(--color-primary-400);
}

.dark button {
    color: rgba(255, 255, 255, 0.8);
}

.dark button:hover {
    color: var(--color-primary-300);
}
</style>
