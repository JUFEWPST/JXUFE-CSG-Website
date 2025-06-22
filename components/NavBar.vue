<template>
    <header ref="headerRef" class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out" :style="{
        backgroundColor: `rgba(var(--nav-bg-rgb), ${opacity * 0.8})`,
        backdropFilter: `blur(${Math.min(opacity * 12, 10)}px)`,
        boxShadow: opacity > 0.1 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
        borderBottom: opacity > 0.1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
    }">
        <div class="container mx-auto px-4 py-4">
            <nav class="flex items-center justify-between">
                <div class="text-xl font-bold hover:text-primary-500">江西财经大学网络安全协会</div>
                <div class="flex space-x-6">
                    <NuxtLink to="/" class="hover:text-(--color-primary-pressed) transition-colors">首页</NuxtLink>
                    <NuxtLink to="/about" class="hover:text-(--color-primary-pressed) transition-colors">关于协会
                    </NuxtLink>
                    <NuxtLink to="/blog" class="hover:text-(--color-primary-pressed) transition-colors">Blog
                    </NuxtLink>
                </div>
            </nav>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const navBgRgb = '255, 255, 255' // 白い
const opacity = ref(0)
const headerRef = ref<HTMLElement | null>(null)
let animationFrameId: number | null = null

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

onMounted(() => {
    document.documentElement.style.setProperty('--nav-bg-rgb', navBgRgb)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
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
</style>
