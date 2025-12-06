<template>
    <footer
        class="bg-(--md-sys-color-background) dark:bg-(--md-sys-color-surface-container) border-t border-(--md-sys-color-outline-variant)/10 py-8 relative overflow-hidden text-(--md-sys-color-on-surface) transition-colors duration-300">
        <div class="container mx-auto px-4 relative">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="col-span-1">
                    <div class="flex items-center mb-4 group">
                        <h3 class="text-2xl font-bold">
                            {{ t("meta.fullName") }}
                        </h3>
                        <span class="ml-2 text-(--md-sys-color-tertiary) opacity-0 group-hover:opacity-100 transition-opacity">✧</span>
                    </div>
                    <p class="text-(--md-sys-color-on-surface-variant) mb-4 leading-relaxed relative">
                        {{ t("pages.home.slogan") }}
                    </p>
                </div>
                <div>
                    <h4 class="text-(--md-sys-color-on-surface) font-bold mb-4 flex items-center">
                        {{ t("footer.quickNav") }}
                    </h4>
                    <ul class="space-y-3">
                        <li v-for="link in navLinks" :key="link.name">
                            <a :href="link.url"
                                class="text-(--md-sys-color-on-surface-variant) hover:text-(--md-sys-color-primary) transition-colors wrap-break-word max-w-full"
                                target="_blank">
                                {{ link.name }}
                            </a>
                        </li>
                        <li>
                            <NuxtLink to="/links"
                                class="font-medium text-(--md-sys-color-secondary) hover:text-(--md-sys-color-primary) transition-colors flex items-center wrap-break-word">
                                {{ t("common.actions.more") }}>>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-(--md-sys-color-on-surface) font-bold mb-4 flex items-center">
                        {{ t("footer.contact") }}</h4>
                    <ul class="space-y-4">
                        <li class="flex items-center group">
                            <div
                                class="w-8 h-8 rounded-full bg-(--md-sys-color-secondary-container) flex items-center justify-center mr-3 group-hover:bg-(--md-sys-color-primary-container) transition-colors shrink-0">
                                <MapPinIcon class="shrink-0 h-5 w-5 text-(--md-sys-color-on-secondary-container) group-hover:text-(--md-sys-color-on-primary-container)" />
                            </div>
                            <span
                                class="text-(--md-sys-color-on-surface-variant) wrap-break-word flex-1 min-w-0">{{ t("footer.address") }}</span>
                        </li>
                        <li class="flex items-center group">
                            <div
                                class="w-8 h-8 rounded-full bg-(--md-sys-color-secondary-container) flex items-center justify-center mr-3 group-hover:bg-(--md-sys-color-primary-container) transition-colors shrink-0">
                                <EnvelopeIcon class="shrink-0 h-5 w-5 text-(--md-sys-color-on-secondary-container) group-hover:text-(--md-sys-color-on-primary-container)" />
                            </div>
                            <span
                                class="text-(--md-sys-color-on-surface-variant) wrap-break-word flex-1 min-w-0">1834488130@qq.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                class="border-t border-(--md-sys-color-outline-variant) mt-8 pt-6 flex flex-col md:flex-row justify-between items-center relative">
                <div
                    class="absolute -left-4 top-1/2 transform -translate-y-1/2 text-(--md-sys-color-primary)/20 text-xl">
                    ✦</div>
                <div
                    class="absolute -right-4 top-1/2 transform -translate-y-1/2 text-(--md-sys-color-tertiary)/20 text-xl">
                    ✦</div>
                <p class="text-(--md-sys-color-on-surface-variant) text-sm mb-4 md:mb-0">
                    © {{ new Date().getFullYear() === 2025 ? `2025` : `2025-${new Date().getFullYear()}` }}
                    {{ t("meta.fullName") }} All Rights Reserved.
                </p>
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import {
    MapPinIcon,
    EnvelopeIcon,
} from '@heroicons/vue/24/outline'
const { t } = useI18n()
const navLinks = computed(() => [
    { name: t("pages.links.items.jxufe"), url: 'https://www.jxufe.edu.cn/' },
    { name: t("pages.links.items.college"), url: 'https://cai.jxufe.edu.cn/' },
    { name: t("pages.links.items.nic"), url: 'https://nic.jxufe.edu.cn/' },
])
</script>
