<template>
    <div
        class="flex flex-col items-center p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl w-90 h-125">
        <div class="mb-3">
            <img class="w-45 h-45 object-cover rounded-full border-3 border-blue-300" :src="person.avatar"
                :alt="person.name + '的头像'">
        </div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {{ person.name }}
        </h2>
        <div class="w-full flex-1 rounded-lg p-1 overflow-scroll">
            <p class="text-gray-700 dark:text-gray-300">
                <span class="font-semibold">班级: </span>
                <span class="text-gray-600 dark:text-gray-300">{{ person.className }}</span>
            </p>
            <div class="mt-2">
                <p class="font-semibold">荣誉：</p>
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
