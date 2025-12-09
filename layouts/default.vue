<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue"
import { useRoute } from "#imports"
import NavBar from "@/components/NavBar.vue"
import PageFooter from "@/components/PageFooter.vue"
import AnzuNotification from "~/components/AnzuNotification.vue"
import { useNotification } from "@/composables/useNotification"
import { useFetchNotice } from "@/composables/useFetchNotice"
import { useOncePerSession } from "@/composables/useOncePerSession"
import { useI18n } from "vue-i18n"
import { useColorPalette } from "@/composables/useColorPalette"
import { usePageTitle } from "@/composables/usePageTitle"
import { useRightSidebar } from "@/composables/useRightSidebar"
import { useSidebarLayout } from '@/composables/useSidebarLayout'
import SiteInfoCard from '@/components/sidebars/SiteInfoCard.vue'
import CalendarCard from '@/components/sidebars/CalendarCard.vue'

const { t } = useI18n()
const { hasContent } = useRightSidebar()
const { notificationRef } = useNotification()
const { titleKey } = usePageTitle()

const hasPageTitle = computed(() => !!titleKey.value)

const { leftCards, rightCards, mobileBottomCards, registerCard, unregisterCard } = useSidebarLayout()

useColorPalette()

// 注册默认左侧卡片
registerCard({
    id: 'site-info',
    side: 'left',
    order: 10,
    sticky: false,
    showOnMobileBottom: true,
    component: SiteInfoCard,
})

const route = useRoute()

watch(
    () => route.path,
    (path) => {
        if (!path.startsWith('/archive/')) {
            registerCard({
                id: 'site-calendar',
                side: 'right',
                order: 10,
                sticky: false,
                showOnMobileBottom: true,
                component: CalendarCard,
            })
        } else {
            unregisterCard('site-calendar')
        }
    },
    { immediate: true },
)

if (import.meta.client) {
    useOncePerSession("init-notice", () => {
        useFetchNotice()
    })
}

const slots = useSlots()
const isHome = computed(() => route.path === "/")
const showLeft = computed(() => {
    if (route.meta?.showLeftSidebar !== undefined) return route.meta.showLeftSidebar
    return true
})
const showRight = computed(() => {
    if (route.meta?.showRightSidebar !== undefined) {
        return route.meta.showRightSidebar
    }
    return true
})

</script>

<template>
    <div
        class="min-h-screen transition-colors duration-300 bg-(--md-sys-color-background) text-(--md-sys-color-on-background)">
        <NavBar />
        <!-- banner -->
        <header
            class="relative w-full overflow-hidden flex flex-col justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] text-(--md-sys-color-on-surface) bg-(--md-sys-color-background)"
            :class="[
                isHome
                    ? 'h-[40vh] sm:h-[50vh]'
                    : hasPageTitle
                        ? 'h-[20vh]'
                        : 'h-[14vh] sm:h-[16vh]'
            ]" style="padding-top: 64px;">
            <div class="absolute bottom-0 w-full z-0 text-(--md-sys-color-surface-container)">
                <svg viewBox="0 0 1440 320" class="w-full h-12 sm:h-20 block" preserveAspectRatio="none">
                    <path fill="currentColor"
                        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                </svg>
            </div>
            <div class="relative z-10 w-full max-w-6xl px-4 text-center">
                <transition enter-active-class="transition duration-700 delay-300 ease-out"
                    enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-4">
                    <div v-if="isHome" class="flex flex-col items-center gap-6 sm:gap-8">
                        <div class="space-y-2 sm:space-y-4">
                            <h1
                                class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-(--md-sys-color-on-surface)">
                                {{ t('meta.school') }}
                            </h1>
                            <h2 class="text-3xl sm:text-4xl md:text-5xl font-semibold text-(--md-sys-color-primary)">
                                {{ t('meta.guild') }}
                            </h2>
                        </div>

                        <p
                            class="text-base sm:text-lg md:text-xl font-bold text-(--md-sys-color-on-surface-variant) max-w-3xl mx-auto">
                            {{ t("pages.home.slogan") }}
                        </p>
                    </div>

                    <div v-else class="flex flex-col items-center gap-4 text-center">
                        <h1
                            class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-(--md-sys-color-primary)">
                            {{ titleKey ? t(titleKey) : '' }}
                        </h1>
                    </div>
                </transition>
            </div>
        </header>
        <!-- 三列布局 -->
        <div class="grow w-full bg-(--md-sys-color-surface-container)">
            <div class="w-full max-w-[1600px] mx-auto px-2">
                <div class="grid grid-cols-1 lg:grid-cols-10 gap-4 items-start">
                    <!-- left -->
                    <aside v-if="showLeft"
                        class="hidden lg:block lg:col-span-2 lg:col-start-1 self-start">
                        <div v-for="card in leftCards" :key="card.id"
                            :class="['mt-0', 'rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)', card.sticky ? 'lg:sticky lg:top-24' : 'mt-4']">
                            <div class="p-6">
                                <component :is="card.component" v-bind="card.props || {}" />
                            </div>
                        </div>
                    </aside>

                    <!-- Page Content -->
                    <main
                        :class="['lg:col-span-6 lg:col-start-3', 'rounded-xl overflow-hidden', !isHome ? 'shadow-center-sm' : '']"
                        class="min-w-0 mb-2 md:mb-10">
                        <slot />
                    </main>

                    <!-- Right Sidebar-->
                    <aside v-if="showRight"
                        class="hidden lg:block lg:col-span-2 lg:col-start-9 self-start">
                        <div v-for="card in rightCards" :key="card.id"
                            :class="['mt-0', 'rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)', card.sticky ? 'lg:sticky lg:top-24' : 'mt-4']">
                            <div class="p-6">
                                <component :is="card.component" v-bind="card.props || {}" />
                            </div>
                        </div>

                        <div
                            class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
                            <div class="p-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
                                <div id="right-sidebar-target">
                                    <ClientOnly>
                                        <div v-show="!hasContent">
                                            Ciallo
                                        </div>
                                    </ClientOnly>
                                </div>
                                <slot name="right-sidebar">
                                </slot>
                            </div>
                        </div>
                    </aside>

                </div>

                <div class="mt-4 space-y-4 lg:hidden">
                    <div v-for="card in mobileBottomCards" :key="card.id"
                        class="rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
                        <div class="p-6">
                            <component :is="card.component" v-bind="card.props || {}" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AnzuNotification ref="notificationRef" />
        <PageFooter />
    </div>
</template>

<style scoped></style>
