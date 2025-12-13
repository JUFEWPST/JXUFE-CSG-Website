<template>
    <AnzuDropdown v-model="isOpen" width-class="w-48" align="right">
        <template #trigger>
            <button
                class="flex h-7.5 w-7.5 items-center justify-center rounded-full text-(--md-sys-color-on-surface) transition-colors duration-200 hover:bg-(--md-sys-color-surface-container-high)"
                @click="isOpen = !isOpen"
                aria-label="Change language"
                :aria-expanded="isOpen"
                aria-haspopup="menu"
                type="button"
            >
                <LanguageIcon class="box-border p-1" />
            </button>
        </template>

        <template #menu>
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
        </template>
    </AnzuDropdown>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { LanguageIcon } from "@heroicons/vue/24/outline";
import AnzuDropdown from "~/components/AnzuDropdown.vue";

const { locale, locales, setLocale } = useI18n();

const isOpen = ref(false);

const localeList = computed(() => {
    return (locales.value ?? []).map((l: any) =>
        typeof l === "string" ? { code: l, name: l.toUpperCase() } : l,
    ) as Array<{ code: string; name?: string }>;
});

const selectLocale = (code: string) => {
    if (code !== locale.value) setLocale(code as any);
    isOpen.value = false;
};
</script>
