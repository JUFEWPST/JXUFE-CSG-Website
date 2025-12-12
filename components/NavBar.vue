<template>
    <header ref="headerRef" class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out"
        :style="headerStyles">
        <div class="mx-3 sm:mx-6 my-4 relative z-10 text-(--md-sys-color-on-surface)">
            <nav class="flex flex-nowrap items-center justify-between relative" role="navigation" aria-label="主导航">
                <div class="flex items-center min-w-0 shrink-0">
                    <NuxtLink to="/"
                        class="nav-link-block py-1! flex items-center min-w-0 shrink-0 text-md sm:text-lg font-bold hover:text-(--md-sys-color-primary) transition-colors mr-2 cursor-pointer">
                        <img src="/favicon.svg" class="h-9 mr-2 shrink-0" alt="江财网安协会logo">
                        <span class="block min-w-0 max-w-56 lg:max-w-[20rem] truncate">
                            {{ t("meta.fullName") }}
                        </span>
                    </NuxtLink>
                </div>

                <div ref="centerColRef"
                    class="hidden md:flex flex-1 min-w-0 items-center justify-center mx-2 relative h-10">
                    <div ref="measureRowRef"
                        class="absolute left-0 top-0 flex items-center gap-2 md:gap-4 whitespace-nowrap invisible pointer-events-none">
                        <template v-for="(link, index) in navLinks" :key="`measure-${link.path}`">
                            <div :ref="(el) => setMeasureItemRef(el as HTMLElement | null, index)" class="shrink-0">
                                <div v-if="'children' in link" class="flex items-center">
                                    <div class="nav-link-block" :class="[
                                        isActive(link) ? 'active-link' : 'text-(--md-sys-color-on-surface-variant)'
                                    ]">
                                        <span class="relative z-10 flex items-center font-bold">
                                            <component :is="iconMap[link.path]" v-if="iconMap[link.path]"
                                                class="w-5 h-5 mr-1.5" />
                                            {{ t(link.label) }}
                                        </span>
                                    </div>
                                    <button type="button"
                                        class="ml-0.5 p-0.5 rounded-full hover:bg-(--md-sys-color-surface-container-high) transition-colors">
                                        <svg class="w-3.5 h-3.5 transition-transform text-(--md-sys-color-on-surface-variant)"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div v-else class="nav-link-block" :class="[
                                    isActive(link) ? 'active-link' : 'text-(--md-sys-color-on-surface-variant)'
                                ]">
                                    <span class="relative z-10 flex items-center font-bold">
                                        <component :is="iconMap[link.path]" v-if="iconMap[link.path]"
                                            class="w-5 h-5 mr-1.5" />
                                        {{ t(link.label) }}
                                    </span>
                                </div>
                            </div>
                        </template>

                        <div ref="moreMeasureRef" class="shrink-0">
                            <div class="nav-link-block text-(--md-sys-color-on-surface-variant)">
                                <span class="relative z-10 flex items-center font-bold">
                                    <EllipsisHorizontalIcon class="w-5 h-5 mr-1.5" />
                                    {{ t("common.actions.more") }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center gap-2 md:gap-4 whitespace-nowrap min-w-0 transition-all duration-300"
                        :class="{ 'opacity-0 invisible scale-95': showArticleTitle && scrollDirection === 'down' }">
                        <template v-for="link in visibleLinks" :key="link.path">
                            <div v-if="'children' in link" class="relative group"
                                @mouseenter="moreOpen = false; openDropdown(link.path)"
                                @mouseleave="closeDropdown(link.path)">
                                <div class="flex items-center">
                                    <NuxtLink :to="link.defaultPath || link.path" class="nav-link-block" :class="[
                                        isActive(link) ? 'active-link' : 'text-(--md-sys-color-on-surface-variant)'
                                    ]">
                                        <span class="relative z-10 flex items-center font-bold">
                                            <component :is="iconMap[link.path]" v-if="iconMap[link.path]"
                                                class="w-5 h-5 mr-1.5" />
                                            {{ t(link.label) }}
                                        </span>
                                    </NuxtLink>

                                    <button @click.stop="moreOpen = false; toggleDropdown(link.path)"
                                        class="ml-0.5 p-0.5 rounded-full hover:bg-(--md-sys-color-surface-container-high) transition-colors"
                                        :class="{ 'rotate-180': dropdownStates[link.path] }" type="button"
                                        aria-label="子菜单">
                                        <svg class="w-3.5 h-3.5 transition-transform text-(--md-sys-color-on-surface-variant)"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        class="absolute top-full right-0 mt-2 w-48 rounded-xl shadow-lg bg-(--md-sys-color-surface-container) ring-1 ring-black/5 overflow-hidden p-1.5 z-50">
                                        <NuxtLink v-for="child in (link as NavLinkWithChildren).children"
                                            :key="child.path" :to="child.path"
                                            class="block px-3 py-2 text-sm rounded-lg transition-colors duration-200"
                                            :class="[
                                                route.path === child.path
                                                    ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container) font-medium'
                                                    : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)'
                                            ]" @click="closeDropdown(link.path)">
                                            {{ t(child.label) }}
                                        </NuxtLink>
                                    </div>
                                </transition>
                            </div>

                            <NuxtLink v-else :to="link.path" class="nav-link-block" :class="[
                                isActive(link) ? 'active-link' : 'text-(--md-sys-color-on-surface-variant)'
                            ]" @mouseenter="moreOpen = false">
                                <span class="relative z-10 flex items-center font-bold">
                                    <component :is="iconMap[link.path]" v-if="iconMap[link.path]"
                                        class="w-5 h-5 mr-1.5" />
                                    {{ t(link.label) }}
                                </span>
                            </NuxtLink>
                        </template>
                        <div v-if="overflowLinks.length" class="relative" @mouseenter="closeAllDropdowns()">
                            <button type="button" class="nav-link-block"
                                :class="moreOpen ? 'active-link' : 'text-(--md-sys-color-on-surface-variant)'"
                                @click.stop="moreOpen = !moreOpen" aria-label="更多菜单">
                                <span class="relative z-10 flex items-center font-bold">
                                    <EllipsisHorizontalIcon class="w-5 h-5 mr-1.5" />
                                    {{ t("common.actions.more") }}
                                </span>
                            </button>

                            <transition enter-active-class="transition duration-200 ease-out"
                                enter-from-class="transform translate-y-2 opacity-0"
                                enter-to-class="transform translate-y-0 opacity-100"
                                leave-active-class="transition duration-150 ease-in"
                                leave-from-class="transform translate-y-0 opacity-100"
                                leave-to-class="transform translate-y-2 opacity-0">
                                <div v-if="moreOpen"
                                    class="absolute top-full right-0 mt-2 w-56 rounded-xl shadow-lg bg-(--md-sys-color-surface-container) ring-1 ring-black/5 overflow-hidden p-1.5 z-50">
                                    <template v-for="link in overflowLinks" :key="`more-${link.path}`">
                                        <div v-if="'children' in link" class="p-1">
                                            <NuxtLink :to="link.defaultPath || link.path"
                                                class="block px-3 py-2 text-sm rounded-lg transition-colors duration-200 font-medium"
                                                :class="[
                                                    isActive(link)
                                                        ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                                                        : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)'
                                                ]" @click="moreOpen = false">
                                                <span class="flex items-center">
                                                    <component :is="iconMap[link.path]" v-if="iconMap[link.path]"
                                                        class="w-5 h-5 mr-2" />
                                                    {{ t(link.label) }}
                                                </span>
                                            </NuxtLink>

                                            <div class="mt-1 pl-2 border-l border-(--md-sys-color-outline-variant)/50">
                                                <NuxtLink v-for="child in (link as NavLinkWithChildren).children"
                                                    :key="child.path" :to="child.path"
                                                    class="block px-3 py-2 text-sm rounded-lg transition-colors duration-200"
                                                    :class="[
                                                        route.path === child.path
                                                            ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container) font-medium'
                                                            : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)'
                                                    ]" @click="moreOpen = false">
                                                    {{ t(child.label) }}
                                                </NuxtLink>
                                            </div>
                                        </div>

                                        <NuxtLink v-else :to="link.path"
                                            class="block px-3 py-2 text-sm rounded-lg transition-colors duration-200"
                                            :class="[
                                                isActive(link)
                                                    ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container) font-medium'
                                                    : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)'
                                            ]" @click="moreOpen = false">
                                            <span class="flex items-center">
                                                <component :is="iconMap[link.path]" v-if="iconMap[link.path]"
                                                    class="w-5 h-5 mr-2" />
                                                {{ t(link.label) }}
                                            </span>
                                        </NuxtLink>
                                    </template>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <div v-if="route.path.startsWith('/archive/') && navTitleBox.title"
                        class="absolute top-0 left-0 w-full px-4 h-full flex flex-col justify-center items-start text-left transition-all duration-300 pointer-events-none"
                        :class="{ 'opacity-0 invisible': !showArticleTitle || scrollDirection === 'up' }">
                        <div
                            class="text-sm md:text-base font-bold leading-tight transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis text-(--md-sys-color-on-surface) w-full">
                            {{ navTitleBox.title }}
                        </div>
                        <div
                            class="text-xs text-(--md-sys-color-on-surface-variant) transition-all duration-500 opacity-70">
                            <span v-if="navTitleBox.subtitle">{{ navTitleBox.subtitle }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center min-w-0 ml-2 sm:ml-4 gap-1 sm:gap-2">
                    <ThemeColorPicker class="shrink-0" />
                    <ToggleTheme class="shrink-0"></ToggleTheme>
                    <ToggleLocale class="shrink-0"></ToggleLocale>
                    <button
                        class="md:hidden shrink-0 rounded-full p-2 text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high) transition-colors focus:outline-none relative ml-1"
                        aria-label="打开菜单" @click.stop="toggleMenu">
                        <Bars3Icon v-if="!isMenuOpen" class="w-6 h-6"></Bars3Icon>
                        <XMarkIcon v-else class="w-6 h-6"></XMarkIcon>
                    </button>
                </div>
            </nav>
            <transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-show="isMenuOpen"
                    class="md:hidden absolute top-full right-0 w-64 origin-top-right mt-2 bg-(--md-sys-color-surface-container) rounded-xl p-3 shadow-lg border border-(--md-sys-color-outline-variant)/50 max-h-[calc(100vh-5rem)] overflow-y-auto z-60">
                    <template v-for="link in navLinks" :key="`mobile-${link.path}`">
                        <div v-if="'children' in link" class="mb-1">
                            <div class="mobile-nav-link flex items-center justify-between w-full rounded-lg transition-colors p-2"
                                :class="isActive(link) ? 'bg-(--md-sys-color-surface-container-high) font-medium' : 'hover:bg-(--md-sys-color-surface-container-high)/50'">
                                <NuxtLink :to="link.defaultPath || link.path" class="flex-1 flex items-center"
                                    :class="isActive(link) ? 'text-(--md-sys-color-primary) font-medium' : 'text-(--md-sys-color-on-surface)'"
                                    @click="closeMenu">
                                    <component :is="iconMap[link.path]" v-if="iconMap[link.path]"
                                        class="w-5 h-5 mr-2" />
                                    {{ t(link.label) }}
                                </NuxtLink>

                                <button @click.stop="toggleMobileSubmenu(link.path)"
                                    class="p-1 rounded-full hover:bg-(--md-sys-color-surface-container-highest)"
                                    aria-label="子菜单">
                                    <svg class="w-4 h-4 transition-transform text-(--md-sys-color-on-surface-variant)"
                                        :class="{ 'rotate-180': mobileDropdownStates[link.path] }" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>

                            <div v-if="mobileDropdownStates[link.path]" class="pl-4 mt-1 space-y-1 mb-2">
                                <NuxtLink v-for="child in (link as NavLinkWithChildren).children" :key="child.path"
                                    :to="child.path" class="block px-3 py-2 text-sm rounded-lg transition-colors"
                                    :class="{
                                        'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container) font-medium': route.path === child.path,
                                        'text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)': route.path !== child.path
                                    }" @click="closeMenu">
                                    {{ t(child.label) }}
                                </NuxtLink>
                            </div>
                        </div>

                        <NuxtLink v-else :to="link.path"
                            class="mobile-nav-link block p-2 mb-1 rounded-lg transition-colors" :class="[
                                isActive(link) ? 'bg-(--md-sys-color-surface-container-high) font-medium' : 'hover:bg-(--md-sys-color-surface-container-high)/50'
                            ]" @click="closeMenu">
                            <span class="flex items-center"
                                :class="isActive(link) ? 'text-(--md-sys-color-primary) font-medium' : 'text-(--md-sys-color-on-surface)'">
                                <component :is="iconMap[link.path]" v-if="iconMap[link.path]" class="w-5 h-5 mr-2" />
                                {{ t(link.label) }}
                            </span>
                        </NuxtLink>
                    </template>
                </div>
            </transition>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import ToggleTheme from './ToggleTheme.vue'
import ThemeColorPicker from './ThemeColorPicker.vue'
import { Bars3Icon, XMarkIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'
import { useNavLinks, type NavLink, type NavLinkWithChildren } from '~/composables/useNavLinks'
import { HomeIcon, ArchiveBoxIcon, UserGroupIcon, LinkIcon } from '@heroicons/vue/24/outline'
import { useDropdownController } from '~/composables/useDropdownController'
import ToggleLocale from './ToggleLocale.vue'
import { useColorPalette } from '@/composables/useColorPalette'

const { t } = useI18n()
const route = useRoute()
const navTitleBox = useState('navTitleBox', () => ({
    title: '',
    subtitle: ''
}))
const { currentTheme } = useColorPalette()

const navLinks = useNavLinks()

const iconMap: Record<string, any> = {
    '/': HomeIcon,
    '/archive': ArchiveBoxIcon,
    '/about': UserGroupIcon,
    '/links': LinkIcon
}

const dropdownLinks = navLinks.filter((link): link is NavLinkWithChildren => 'children' in link)
const desktopDropdown = useDropdownController(dropdownLinks)
const mobileDropdown = useDropdownController(dropdownLinks)

const centerColRef = ref<HTMLElement | null>(null)
const measureRowRef = ref<HTMLElement | null>(null)
const moreMeasureRef = ref<HTMLElement | null>(null)
const measureItemRefs = ref<Array<HTMLElement | null>>([])

const visibleCount = ref(navLinks.length)
const moreOpen = ref(false)

const visibleLinks = computed(() => navLinks.slice(0, visibleCount.value))
const overflowLinks = computed(() => navLinks.slice(visibleCount.value))

const setMeasureItemRef = (el: HTMLElement | null, index: number) => {
    measureItemRefs.value[index] = el
}

let ro: ResizeObserver | null = null
const scheduleRecompute = () => window.requestAnimationFrame(recomputeOverflow)

const recomputeOverflow = async () => {
    await nextTick()

    const center = centerColRef.value
    const row = measureRowRef.value
    if (!center || !row) return

    const availableWidth = center.clientWidth
    if (!availableWidth) return

    const itemEls = measureItemRefs.value.filter(Boolean) as HTMLElement[]
    if (!itemEls.length) return

    const styles = window.getComputedStyle(row)
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0

    const widths = itemEls.map((el) => el.getBoundingClientRect().width)
    const moreWidth = moreMeasureRef.value?.getBoundingClientRect().width ?? 0

    const totalWidth = (count: number) => {
        if (count <= 0) return 0
        return widths.slice(0, count).reduce((a, b) => a + b, 0) + gap * (count - 1)
    }

    let count = itemEls.length
    while (count > 0 && totalWidth(count) > availableWidth) {
        count--
    }
    if (count === itemEls.length) {
        visibleCount.value = itemEls.length
        moreOpen.value = false
        return
    }

    const reserved = moreWidth + gap
    const limit = Math.max(0, availableWidth - reserved)
    count = itemEls.length
    while (count > 0 && totalWidth(count) > limit) {
        count--
    }
    visibleCount.value = Math.max(0, count)
}

const opacity = ref(0)
const headerRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)
const showArticleTitle = ref(false)
const lastScrollY = ref(0)
const scrollDirection = ref<'up' | 'down'>('up')

const headerStyles = computed(() => {
    const bgEffect = isMenuOpen.value || opacity.value > 0.2
    const alphaValue = isMenuOpen.value ? 0.95 : Math.min(opacity.value, 0.8);

    return {
        backgroundColor: `color-mix(in srgb, var(--md-sys-color-surface) ${alphaValue * 100}%, transparent)`,
        backdropFilter: bgEffect ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: bgEffect ? 'blur(10px)' : 'none',
        borderBottom: bgEffect ? '1px solid color-mix(in srgb, var(--md-sys-color-outline-variant), transparent 80%)' : '1px solid transparent',
        boxShadow: bgEffect ? '0 4px 16px color-mix(in srgb, var(--md-sys-color-shadow), transparent 94%)' : 'none',
    }
})

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

const isActive = (link: NavLink) => {
    if ('children' in link) {
        return link.children.some((child) => route.path === child.path) || route.path === link.defaultPath
    }
    if (link.path === '/') {
        return route.path === '/'
    }
    return route.path === link.path || route.path.startsWith(link.path + '/')
}

const { states: dropdownStates, open: openDropdown, close: closeDropdown, toggle: toggleDropdown, closeAll: closeAllDropdowns } = desktopDropdown

const { states: mobileDropdownStates, toggle: toggleMobileSubmenu, closeAll: closeAllMobileDropdowns } = mobileDropdown

const handleScroll = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop

    scrollDirection.value = scrollPosition > lastScrollY.value ? 'down' : 'up'
    lastScrollY.value = scrollPosition

    const rawOpacity = Math.min(scrollPosition / 100, 1)
    opacity.value = easeOutCubic(rawOpacity)

    if (route.path.startsWith('/archive/')) {
        if (scrollPosition > 120) {
            showArticleTitle.value = true
        } else {
            showArticleTitle.value = false
        }
    } else {
        showArticleTitle.value = false
    }
}

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
const closeMenu = () => {
    isMenuOpen.value = false
    closeAllMobileDropdowns()
}

const handleClickOutside = (event: MouseEvent) => {
    if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
        isMenuOpen.value = false
        moreOpen.value = false

        closeAllDropdowns()
        closeAllMobileDropdowns()
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClickOutside)

    window.addEventListener('resize', scheduleRecompute)

    if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(scheduleRecompute)
        if (centerColRef.value) ro.observe(centerColRef.value)
    }

    watch(
        () => route.path,
        () => {
            moreOpen.value = false
            scheduleRecompute()
        },
        { immediate: true },
    )

    handleScroll()
    scheduleRecompute()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleClickOutside)

    window.removeEventListener('resize', scheduleRecompute)
    ro?.disconnect()
    ro = null
})
</script>

<style scoped>
@reference "tailwindcss";

header {
    will-change: background-color, backdrop-filter, border-bottom;
}

.nav-link-block {
    @apply relative transition-all duration-200 ease-out flex items-center px-2 lg:px-4 py-2 rounded-lg cursor-pointer overflow-hidden transform will-change-transform whitespace-nowrap text-sm lg:text-base;
    @apply before:absolute before:inset-0 before:z-[-1] before:scale-[0.8] before:rounded-lg before:opacity-0 before:backdrop-blur before:transition-all before:duration-300 before:ease-out;
    @apply before:origin-center;
    @apply hover:before:scale-100 hover:before:opacity-100;
    @apply before:bg-(--md-sys-color-primary-container)/40 dark:before:bg-[var(--md-sys-color-primary-container)]/70;
    @apply hover:text-[var(--md-sys-color-primary)];
}

.active-link {
    @apply text-(--md-sys-color-primary) font-semibold bg-[var(--md-sys-color-secondary-container)]/50;
}

.nav-link-block span {
    position: relative;
    z-index: 1;
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
    z-index: 40;
}
</style>
