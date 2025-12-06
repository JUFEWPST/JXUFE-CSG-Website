<script setup lang="ts">
import { computed, ref, onMounted, useSlots } from "vue"
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

const { t } = useI18n()
const { notificationRef } = useNotification()
const { titleKey } = usePageTitle()

useColorPalette()

if (import.meta.client) {
    useOncePerSession("init-notice", () => {
        useFetchNotice()
    })
}

const route = useRoute()
const slots = useSlots()
const isHome = computed(() => route.path === "/")
const showLeft = computed(() => {
    if (route.meta?.showLeftSidebar !== undefined) return route.meta.showLeftSidebar
    return !isHome.value
})
const showRight = computed(() => {
    if (route.meta?.showRightSidebar !== undefined) {
        return route.meta.showRightSidebar && !!slots['right-sidebar']
    }
    return !isHome.value && !!slots['right-sidebar']
})

const mainColumnClass = computed(() => {
    if (showLeft.value && showRight.value) return "lg:col-span-6"
    if (showLeft.value || showRight.value) return "lg:col-span-9"
    return "lg:col-span-12"
})

</script>

<template>
    <div
        class="min-h-screen transition-colors duration-300 bg-(--md-sys-color-background) text-(--md-sys-color-on-background)">
        <NavBar class="fixed top-0 left-0 right-0 z-50 transition-colors duration-300" />
        <header
            class="relative w-full overflow-hidden flex flex-col justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] text-(--md-sys-color-on-surface)"
            :class="[
                isHome ? 'h-[65vh] sm:h-[75vh]' : 'h-[35vh] sm:h-[40vh]'
            ]" style="padding-top: 64px;">
            <div
                class="absolute inset-0 z-0 bg-linear-to-b from-(--md-sys-color-primary-container) via-(--md-sys-color-surface-container-low) to-(--md-sys-color-background) dark:via-(--md-sys-color-background) dark:to-(--md-sys-color-background)">
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
                            <h2
                                class="text-3xl sm:text-4xl md:text-5xl font-semibold text-(--md-sys-color-primary)">
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

        <div class="grow w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <aside v-if="showLeft" class="hidden lg:block lg:col-span-3 space-y-6">
                    <div class="sticky top-24 space-y-6">
                        <div
                            class="rounded-xl p-6 bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
                            <slot name="left-sidebar">
                                <h3 class="font-bold text-lg mb-3 text-(--md-sys-color-primary)">介绍信息</h3>
                                <p class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant)">
                                    欢迎来到江财网络安全协会。
                                </p>
                            </slot>
                        </div>
                    </div>
                </aside>

                <!-- Page Content -->
                <main
                    :class="[mainColumnClass, !isHome ? 'bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-center-sm p-4 sm:p-6' : '']"
                    class="min-w-0">
                    <slot />
                </main>

                <!-- Right Sidebar-->
                <aside v-if="showRight" class="hidden lg:block lg:col-span-3 space-y-6">
                    <div class="sticky top-24 space-y-6">
                        <div
                            class="rounded-xl p-6 bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
                            <slot name="right-sidebar">
                            </slot>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
        <AnzuNotification ref="notificationRef" />
        <PageFooter />
    </div>
</template>

<style scoped></style>
