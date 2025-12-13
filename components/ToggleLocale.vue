<template>
    <div
        ref="root"
        class="relative inline-flex"
        @mouseenter="openMenu"
        @mouseleave="scheduleClose"
    >
        <button
            class="flex h-7.5 w-7.5 items-center justify-center rounded-full text-(--md-sys-color-on-surface) transition-colors duration-200 hover:bg-(--md-sys-color-surface-container-high)"
            @click="toggleMenu"
            aria-label="Change language"
            :aria-expanded="isOpen"
            aria-haspopup="menu"
            type="button"
        >
            <LanguageIcon class="box-border p-1" />
        </button>

        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-2 opacity-0"
        >
            <div
                v-if="isOpen"
                class="shadow-center-sm absolute top-full right-0 z-50 mt-2 w-48 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-(--md-sys-color-surface-container) ring-1 ring-black/5 sm:left-1/2 sm:mx-4 sm:-translate-x-1/2 sm:transform"
                role="menu"
                @mouseenter="openMenu"
                @mouseleave="scheduleClose"
            >
                <button
                    v-for="l in localeList"
                    :key="l.code"
                    type="button"
                    role="menuitem"
                    @click="selectLocale(l.code)"
                    class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium transition-colors"
                    :class="
                        l.code === locale
                            ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                            : 'text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)'
                    "
                >
                    <span
                        class="inline-block h-1.5 w-1.5 rounded-full"
                        :class="
                            l.code === locale
                                ? 'bg-(--md-sys-color-primary)'
                                : 'bg-transparent'
                        "
                    />
                    <span class="truncate">{{ l.name ?? l.code }}</span>
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { LanguageIcon } from "@heroicons/vue/24/outline";

const { locale, locales, setLocale } = useI18n();

const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);

const localeList = computed(() => {
    return (locales.value ?? []).map((l: any) =>
        typeof l === "string" ? { code: l, name: l.toUpperCase() } : l,
    ) as Array<{ code: string; name?: string }>;
});

const closeDelay = 120;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const clearCloseTimer = () => {
    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }
};

const openMenu = () => {
    clearCloseTimer();
    isOpen.value = true;
};

const scheduleClose = () => {
    clearCloseTimer();
    closeTimer = setTimeout(() => {
        isOpen.value = false;
        closeTimer = null;
    }, closeDelay);
};

const toggleMenu = () => {
    if (isOpen.value) {
        clearCloseTimer();
        isOpen.value = false;
    } else {
        openMenu();
    }
};

const selectLocale = (code: string) => {
    if (code !== locale.value) setLocale(code as any);
    clearCloseTimer();
    isOpen.value = false;
};

const onDocClick = (e: MouseEvent) => {
    if (!root.value) return;
    if (!root.value.contains(e.target as Node)) {
        clearCloseTimer();
        isOpen.value = false;
    }
};

onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => {
    document.removeEventListener("click", onDocClick);
    clearCloseTimer();
});
</script>
