<template>
    <header ref="headerRef" class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out"
        :style="headerStyles">
        <div class="container mx-auto px-4 py-4">
            <nav class="flex items-center justify-between">
                <div class="text-xl font-bold hover:text-primary-500 items-center flex">江西财经大学网络安全协会
                    <ToggleTheme class="ml-1"></ToggleTheme>
                </div>
                <div class="hidden md:flex space-x-6">
                    <NuxtLink to="/" class="nav-link" :class="{ 'active-link': $route.path === '/' }">首页</NuxtLink>
                    <NuxtLink to="/archive" class="nav-link" :class="{ 'active-link': $route.path === '/archive' }">归档
                    </NuxtLink>
                    <NuxtLink to="/about" class="nav-link" :class="{ 'active-link': $route.path === '/about' }">关于协会
                    </NuxtLink>
                    <NuxtLink to="/links" class="nav-link" :class="{ 'active-link': $route.path === '/links' }">相关链接
                    </NuxtLink>
                </div>
                <button class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-500 focus:outline-none"
                    @click.stop="toggleMenu">
                    <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </nav>
            <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
                :style="{ maxHeight: isMenuOpen ? '500px' : '0' }">
                <div class="mt-4 pb-4">
                    <NuxtLink to="/" class="mobile-nav-link" :class="{ 'mobile-active-link': $route.path === '/' }"
                        @click.native="closeMenu">首页</NuxtLink>
                    <NuxtLink to="/archive" class="mobile-nav-link"
                        :class="{ 'mobile-active-link': $route.path === '/archive' }" @click.native="closeMenu">归档
                    </NuxtLink>
                    <NuxtLink to="/about" class="mobile-nav-link"
                        :class="{ 'mobile-active-link': $route.path === '/about' }" @click.native="closeMenu">关于协会
                    </NuxtLink>
                    <NuxtLink to="/links" class="mobile-nav-link"
                        :class="{ 'mobile-active-link': $route.path === '/links' }" @click.native="closeMenu">相关链接
                    </NuxtLink>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ToggleTheme from './ToggleTheme.vue'
const navBgRgb = '255, 255, 255'
const opacity = ref(0)
const headerRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
let animationFrameId: number | null = null

const headerStyles = computed(() => {
    const showBlurEffect = opacity.value > 0.1 || isMenuOpen.value
    return {
        backgroundColor: `rgba(var(--nav-bg-rgb), ${isMenuOpen.value ? 0.8 : opacity.value * 0.8})`,
        backdropFilter: `blur(${isMenuOpen.value ? 10 : Math.min(opacity.value * 12, 10)}px)`,
        boxShadow: showBlurEffect ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
        borderBottom: showBlurEffect ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
    }
})

const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
}

const handleScroll = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }

    animationFrameId = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop
        const rawOpacity = Math.min(scrollPosition / 150, 0.85)
        opacity.value = easeOutCubic(rawOpacity)
    })
}

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
    isMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
    if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
        isMenuOpen.value = false
    }
}

onMounted(() => {
    document.documentElement.style.setProperty('--nav-bg-rgb', navBgRgb)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClickOutside)
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleClickOutside)
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
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
}

.nav-link:hover {
    color: var(--color-primary-pressed);
}

.active-link {
    color: var(--color-primary-500);
    font-weight: 500;
}

.mobile-nav-link {
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    color: inherit;
    transition:
        background-color 0.3s ease,
        color 0.3s ease;
}

.mobile-nav-link:hover {
    background-color: rgba(243, 244, 246, 0.8);
    color: var(--color-primary-pressed);
}

.mobile-active-link {
    color: var(--color-primary-500);
    font-weight: 500;
}

/* 暗色模式适配 */
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
