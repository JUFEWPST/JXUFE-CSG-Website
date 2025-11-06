<template>
    <div class="w-full flex-shrink-0 px-4 py-6 md:px-8 md:py-8">
        <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div class="relative">
                    <div
                        class="w-55 h-55 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                        <img :src="leader.avatar" :alt="leader.name + '的头像'"
                            class="w-full h-full object-cover"
                            v-if="leader.avatar" />
                        <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <div class="text-4xl font-bold text-gray-500 dark:text-gray-400">
                                {{ leader.name.charAt(0) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-2/3 md:pl-8">
                <div class="mb-4">
                    <h3 class="text-2xl font-bold mb-1">
                        {{ leader.name }}
                        <span class="text-lg text-gray-600 dark:text-gray-300 ml-1"
                            v-if="leader.class">({{ leader.class }})</span>
                    </h3>
                    <div
                        class="inline-block bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {{ leader.year }} 届会长
                    </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 w-full p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600"
                    v-if="leader.message">
                    <p class="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{{ leader.message }}"
                    </p>
                </div>
                <div v-if="leader.achievements && leader.achievements.length > 0">
                    <h4 class="text-lg font-semibold mb-3">
                        个人成就
                    </h4>
                    <ul
                        class="space-y-2 bg-white/50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600 max-h-50 overflow-scroll">
                        <li v-for="(achievement, i) in leader.achievements" :key="i" class="flex items-start">
                            <span class="inline-block w-2 h-2 rounded-full bg-blue-300 mt-2 mr-3 flex-shrink-0"></span>
                            <span class="text-gray-700 dark:text-gray-300">{{ achievement }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Leader } from '~/types/leader';
defineProps<{
    leader: Leader
}>()
</script>
