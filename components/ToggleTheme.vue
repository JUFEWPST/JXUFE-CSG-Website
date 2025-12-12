<template>
    <button
        class="flex h-[30px] w-[30px] items-center justify-center rounded-full text-(--md-sys-color-on-surface) transition-colors duration-200 hover:bg-(--md-sys-color-surface-container-high)"
        @click="toggleTheme"
        aria-label="Toggle dark mode"
    >
        <MoonIcon v-if="isDark" class="box-border p-1" />
        <SunIcon v-else class="box-border p-1" />
    </button>
</template>

<script lang="ts" setup>
import { SunIcon } from "@heroicons/vue/24/outline";
import { MoonIcon } from "@heroicons/vue/24/outline";
const { isDark, toggleTheme } = useTheme();
</script>
