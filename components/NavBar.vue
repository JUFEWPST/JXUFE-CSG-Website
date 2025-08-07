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
                <div class="text-md sm:text-xl font-bold hover:text-primary-500 items-center flex">
                    <img src="/favicon.svg" class="h-8 mr-2">
                    <span>
                        江西财经大学网络安全协会
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
                            <span v-if="navArticleInfo.updatedAt" class="mr-2">更新于:{{ navArticleInfo.updatedAt }}</span>
                            <span v-if="navArticleInfo.publisher">发布者:{{ navArticleInfo.publisher }}</span>
                        </div>
                    </div>
                </div>

                <!-- 桌面导航 -->
                <div class="hidden md:flex space-x-6">
                    <template v-for="link in navLinks" :key="link.path">
                        <!-- 有下拉菜单的导航项 -->
                        <div v-if="link.children" class="relative group" @mouseenter="openDropdown(link.path)"
                            @mouseleave="closeDropdown(link.path)">
                            <div class="flex items-center">
                                <!-- 主链接 - 点击跳转到默认路由 -->
                                <NuxtLink :to="link.defaultPath || link.path" class="nav-link"
                                    :class="{ 'active-link': isActive(link) }" @click.stop.prevent="() => { }">
                                    <span class="relative">
                                        {{ link.label }}
                                        <span v-if="isActive(link)"
                                            :class="`absolute -top-2 -right-3 text-${link.color}-400 text-xs`">{{ link.icon }}</span>
                                    </span>
                                </NuxtLink>

                                <!-- 下拉菜单触发按钮 -->
                                <button @click="toggleDropdown(link.path)"
                                    class="ml-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    :class="{ 'rotate-180': dropdownStates[link.path] }" type="button">
                                    <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>

                            <div class="absolute top-full left-0 w-full h-2"
                                :class="{ 'invisible': !dropdownStates[link.path] }"></div>

                            <!-- 下拉菜单内容 -->
                            <transition enter-active-class="transition duration-200 ease-out"
                                enter-from-class="transform translate-y-2 opacity-0"
                                enter-to-class="transform translate-y-0 opacity-100"
                                leave-active-class="transition duration-150 ease-in"
                                leave-from-class="transform translate-y-0 opacity-100"
                                leave-to-class="transform translate-y-2 opacity-0">
                                <div v-if="dropdownStates[link.path]"
                                    class="absolute top-full left-0 mt-2 w-48 rounded shadow-lg bg-white dark:bg-gray-800 ring-1 ring-zinc-900/5 dark:ring-zinc-100/10 ring-opacity-5 z-50 overflow-hidden">
                                    <NuxtLink v-for="child in link.children" :key="child.path" :to="child.path"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                                        :class="{
                                            'bg-gray-100 dark:bg-gray-700 font-medium': route.path === child.path,
                                            'text-primary-500 dark:text-primary-400': route.path === child.path
                                        }" @click="closeDropdown(link.path)">
                                        {{ child.label }}
                                    </NuxtLink>
                                </div>
                            </transition>
                        </div>

                        <!-- 普通导航项 -->
                        <NuxtLink v-else :to="link.path" class="nav-link"
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
                <button class="md:hidden rounded-md text-gray-700 hover:text-primary-500 focus:outline-none relative"
                    aria-label="打开菜单" @click.stop="toggleMenu">
                    <Bars3Icon v-if="!isMenuOpen" class="w-7 h-7"></Bars3Icon>
                    <XMarkIcon v-else class="w-7 h-7"></XMarkIcon>
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
                        <!-- 移动端有子菜单的项 -->
                        <div v-if="link.children" class="mb-1">
                            <div class="mobile-nav-link flex items-center justify-between w-full"
                                :class="{ 'mobile-active-link': isActive(link) }">
                                <!-- 文本部分单独使用NuxtLink -->
                                <NuxtLink :to="link.defaultPath || link.path" class="flex-1" @click="closeMenu">
                                    <span>
                                        {{ link.label }}
                                        <span v-if="isActive(link)"
                                            :class="`ml-2 text-${link.color}-400 text-sm`">{{ link.icon }}</span>
                                    </span>
                                </NuxtLink>

                                <!-- 展开按钮独立出来 -->
                                <button @click.stop="toggleMobileSubmenu(link.path)"
                                    class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg class="w-4 h-4 transition-transform"
                                        :class="{ 'rotate-180': mobileDropdownStates[link.path] }" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>

                            <!-- 移动端子菜单 -->
                            <div v-if="mobileDropdownStates[link.path]" class="pl-4 mt-1 space-y-1">
                                <NuxtLink v-for="child in link.children" :key="child.path" :to="child.path"
                                    class="block px-3 py-2 text-sm rounded-md mobile-nav-link" :class="{
                                        'mobile-active-link': route.path === child.path,
                                        'bg-gray-100 dark:bg-gray-700': route.path === child.path
                                    }" @click="closeMenu">
                                    {{ child.label }}
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- 移动端普通项 -->
                        <NuxtLink v-else :to="link.path" class="mobile-nav-link"
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
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import ToggleTheme from './ToggleTheme.vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const route = useRoute()
const navArticleInfo = useState('navArticleInfo', () => ({
    title: '',
    updatedAt: '',
    publisher: ''
}))


const navLinks = [
    { path: '/', label: '首页', icon: '✧', color: 'pink' },
    { path: '/archive', label: '归档', icon: '✦', color: 'blue' },
    {
        path: '/about',
        defaultPath: '/about',
        label: '关于协会',
        icon: '✧',
        color: 'purple',
        children: [
            { path: '/about', label: '协会简介' },
            { path: '/about/leaders', label: '历届负责人' },
            { path: '/about/members', label: '历届成员' },
            { path: '/about/excellent', label: '优秀成员' }
        ]
    },
    { path: '/links', label: '相关链接', icon: '✦', color: 'yellow' }
]

const isActive = (link: any) => {
    if (link.children) {
        return link.children.some((child: any) => route.path === child.path);
    }
    return route.path === link.path;
};

// 下拉菜单状态
const dropdownStates = reactive<Record<string, boolean>>({});
const mobileDropdownStates = reactive<Record<string, boolean>>({});

// 打开下拉菜单
const openDropdown = (path: string) => {
    dropdownStates[path] = true;
};

// 关闭下拉菜单
const closeDropdown = (path: string) => {
    dropdownStates[path] = false;
};

// 切换下拉菜单
const toggleDropdown = (path: string) => {
    dropdownStates[path] = !dropdownStates[path];
};

// 切换移动端子菜单
const toggleMobileSubmenu = (path: string) => {
    mobileDropdownStates[path] = !mobileDropdownStates[path];
};

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

        // 关闭所有下拉菜单
        Object.keys(dropdownStates).forEach(key => {
            dropdownStates[key] = false;
        });
    }
}

onMounted(() => {
    document.documentElement.style.setProperty('--nav-bg-rgb', '255, 255, 255')
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClickOutside)
    handleScroll()

    // 初始化下拉菜单状态
    navLinks.forEach(link => {
        if (link.children) {
            dropdownStates[link.path] = false;
            mobileDropdownStates[link.path] = false;
        }
    });

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
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    display: inline-block;
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

.group:hover .absolute.top-full {
    pointer-events: auto;
}

.group:hover::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 10px;
    background: transparent;
    z-index: 60;
}

.dark .pl-4 a.mobile-active-link {
    color: var(--color-primary-400);
}
</style>
