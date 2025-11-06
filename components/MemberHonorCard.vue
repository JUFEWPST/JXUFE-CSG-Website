<template>
    <div
        class="flex flex-col items-center rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 w-90 h-100">
        <div class="relative h-35 w-full">
            <img class="absolute top-0 left-0 z-1 object-cover w-full h-full opacity-30" :src="person.avatar" alt="背景图"/>
            <div class="absolute top-0 left-0 z-2 w-full h-full p-2 box-border flex gap-2">
                <img class="relative -bottom-12 w-30 h-30 object-cover rounded-full shadow-sm" :src="person.avatar"
                    :alt="person.name + '的头像'">
                <div class="flex-1 relative">
                    <div class="flex-1 absolute bottom-0">
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mt-4">
                            {{ person.name }}
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ person.className }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full flex-1 rounded-lg px-4 pb-1 box-border mt-10">
            <div class="overflow-scroll">
                <ul class="mt-1 space-y-1">
                    <li v-for="(honor, index) in person.honors" :key="index"
                        class="flex items-start text-gray-600 dark:text-gray-300">
                        <div class="relative mr-2 mt-1.5">
                            <div class="absolute bg-blue-300 w-2 h-2 rounded-full"></div>
                            <div class="w-2 h-2"></div>
                        </div>
                        <div class="flex-1">
                            {{ honor }}
                        </div>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { person } from '~/data/excellentData'

const props = defineProps<{ person: person }>()
</script>

<style scoped></style>
