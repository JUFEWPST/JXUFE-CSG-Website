<template>
    <header ref="headerRef" class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out"
        :style="headerStyles">
        <div class="mx-3 sm:mx-6 my-4 relative z-10">
            <nav class="flex items-center justify-between" role="navigation" aria-label="主导航">
                <div class="text-md sm:text-xl font-bold hover:text-primary-500 items-center flex">
                    <img src="/favicon.svg" class="h-10 mr-2" alt="江财网安协会logo">
                    <span>
                        江西财经大学网络安全协会
                    </span>
                    <ToggleTheme class="ml-1"></ToggleTheme>
                </div>

                <div class="flex-1 hidden md:flex justify-end items-center mx-4 relative h-[2.5rem]">
                    <!-- 桌面导航菜单 -->
                    <div class="flex space-x-6 transition-all duration-300 items-center justify-end"
                        :class="{ 'opacity-0 invisible scale-95': showArticleTitle && scrollDirection === 'down' }">
                        <template v-for="link in navLinks" :key="link.path">
                            <div v-if="link.children" class="relative group" @mouseenter="openDropdown(link.path)"
                                @mouseleave="closeDropdown(link.path)">
                                <div class="flex items-center">
                                    <NuxtLink :to="link.defaultPath || link.path" class="nav-link"
                                        :class="{ 'active-link': isActive(link) }">
                                        <span class="relative">
                                            {{ link.label }}
                                            <span v-if="isActive(link)"
                                                :class="`absolute -top-2 -right-3 text-${link.color}-400 text-xs`">{{ link.icon }}</span>
                                        </span>
                                    </NuxtLink>

                                    <button @click="toggleDropdown(link.path)"
                                        class="ml-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        :class="{ 'rotate-180': dropdownStates[link.path] }" type="button"
                                        aria-label="关于协会栏子菜单">
                                        <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                </div>

                                <div class="absolute top-full left-0 w-full h-2"
                                    :class="{ 'invisible': !dropdownStates[link.path] }"></div>

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
                    <!-- 归档标题部分 -->
                    <div v-if="route.path.startsWith('/archive/') && navTitleBox.title"
                        class="absolute top-0 left-0 w-full transition-all duration-300"
                        :class="{ 'opacity-0 invisible': !showArticleTitle || scrollDirection === 'up' }">
                        <div class="text-lg font-semibold leading-tight transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
                            :class="{
                                'translate-y-2 opacity-0': !titleVisible,
                                'translate-y-0 opacity-100': titleVisible
                            }">
                            {{ navTitleBox.title }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-all duration-500" :class="{
                            'translate-y-2 opacity-0': !subtitleVisible,
                            'translate-y-0 opacity-70': subtitleVisible
                        }">
                            <span v-if="navTitleBox.subtitle" class="mr-2">{{ navTitleBox.subtitle }}</span>
                        </div>
                    </div>
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

            <!-- 移动导航菜单 -->
            <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
                :style="{ maxHeight: isMenuOpen ? '500px' : '0' }" :aria-hidden="!isMenuOpen">
                <div class="mt-4 pb-4 relative">
                    <div class="absolute -top-4 right-4 text-pink-300 text-xl opacity-70">✧</div>
                    <div class="absolute -bottom-4 left-4 text-blue-300 text-xl opacity-70">✦</div>
                    <template v-for="link in navLinks" :key="`mobile-${link.path}`">
                        <div v-if="link.children" class="mb-1">
                            <div class="mobile-nav-link flex items-center justify-between w-full"
                                :class="{ 'mobile-active-link': isActive(link) }">
                                <NuxtLink :to="link.defaultPath || link.path" class="flex-1" @click="closeMenu">
                                    <span>
                                        {{ link.label }}
                                        <span v-if="isActive(link)"
                                            :class="`ml-2 text-${link.color}-400 text-sm`">{{ link.icon }}</span>
                                    </span>
                                </NuxtLink>

                                <button @click.stop="toggleMobileSubmenu(link.path)"
                                    class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                    aria-label="关于协会栏子菜单">
                                    <svg class="w-4 h-4 transition-transform"
                                        :class="{ 'rotate-180': mobileDropdownStates[link.path] }" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>

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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ToggleTheme from './ToggleTheme.vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'
import { useNavLinks, type NavLink, type NavLinkWithChildren } from '~/composables/useNavLinks'
import { useDropdownController } from '~/composables/useDropdownController'

const route = useRoute()
const navTitleBox = useState('navTitleBox', () => ({
    title: '',
    subtitle: ''
}))

const navLinks = useNavLinks()
const dropdownLinks = navLinks.filter((link): link is NavLinkWithChildren => 'children' in link)
const desktopDropdown = useDropdownController(dropdownLinks)
const mobileDropdown = useDropdownController(dropdownLinks)

// 响应式状态
const titleVisible = ref(false)
const subtitleVisible = ref(false)
const opacity = ref(0)
const headerRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
const showArticleTitle = ref(false)
const lastScrollY = ref(0)
const scrollDirection = ref<'up' | 'down'>('up')

// 计算属性
const currentBgOpacity = computed(() => isMenuOpen.value ? 0.8 : opacity.value * 0.8)

const headerStyles = computed(() => {
    const showBlurEffect = (opacity.value > 0.1 || isMenuOpen.value)
    const blurAmount = isMenuOpen.value ? 12 : Math.min(opacity.value * 12, 12)
    return {
        backgroundColor: `rgba(var(--nav-bg-rgb), ${currentBgOpacity.value})`,
        backdropFilter: showBlurEffect && blurAmount > 0 ?
            `blur(${blurAmount}px) saturate(180%)` : 'none',
        boxShadow: showBlurEffect ? '0 1px 1px 0px rgba(0, 0, 0, 0.1)' : 'none',
    }
})

// 工具函数
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

const isActive = (link: NavLink) => {
    if ('children' in link) {
        return link.children.some((child) => route.path === child.path)
    }
    return route.path === link.path
}

// 下拉菜单操作
const { states: dropdownStates, open: openDropdown, close: closeDropdown, toggle: toggleDropdown, closeAll: closeAllDropdowns } = desktopDropdown

const { states: mobileDropdownStates, toggle: toggleMobileSubmenu, closeAll: closeAllMobileDropdowns } = mobileDropdown

// 滚动处理
const handleScroll = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop

    // 确定滚动方向
    scrollDirection.value = scrollPosition > lastScrollY.value ? 'down' : 'up'
    lastScrollY.value = scrollPosition

    // 计算透明度
    const rawOpacity = Math.min(scrollPosition / 150, 0.85)
    opacity.value = easeOutCubic(rawOpacity)

    // 控制文章标题显示逻辑
    if (route.path.startsWith('/archive/')) {
        // 下滑超过100px后，根据滚动方向切换显示
        if (scrollPosition > 100) {
            showArticleTitle.value = true
        } else {
            showArticleTitle.value = false
        }
    } else {
        showArticleTitle.value = false
    }
}

// 菜单操作
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
const closeMenu = () => {
    isMenuOpen.value = false
    closeAllMobileDropdowns()
}

const handleClickOutside = (event: MouseEvent) => {
    if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
        isMenuOpen.value = false

        // 关闭所有下拉菜单
        closeAllDropdowns()
        closeAllMobileDropdowns()
    }
}

// 生命周期
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
    color: var(--anzu-primary-pressed);
}

.active-link {
    color: var(--anzu-primary);
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
    color: var(--anzu-primary-pressed);
}

.mobile-active-link {
    color: var(--anzu-primary);
    font-weight: 500;
}

.dark header {
    --nav-bg-rgb: 15, 15, 15;
    border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}


.dark .mobile-nav-link:hover {
    background-color: rgba(31, 41, 55, 0.8);
}

.dark .nav-link:hover,
.dark .mobile-nav-link:hover {
    color: var(--anzu-primary-300);
}

.dark .active-link,
.dark .mobile-active-link {
    color: var(--anzu-primary-400);
}

.dark button {
    color: rgba(255, 255, 255, 0.8);
}

.dark button:hover {
    color: var(--anzu-primary-300);
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
    color: var(--anzu-primary);
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
