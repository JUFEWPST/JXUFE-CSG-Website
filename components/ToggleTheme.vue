<template>
    <button class=" rounded-full w-[40px] h-[40px]" @click="toggleTheme">
        <MoonIcon v-if="isDark"></MoonIcon>
        <SunIcon v-else></SunIcon>
    </button>
</template>

<script lang="ts" setup>
import { SunIcon } from '@heroicons/vue/24/outline';
import { MoonIcon } from '@heroicons/vue/24/outline';
const { isDark, toggleTheme } = useTheme();
</script>