<template>
    <div class="w-full shrink-0 px-4 py-6 md:px-8 md:py-8">
        <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div class="relative">
                    <div
                        class="w-55 h-55 rounded-full overflow-hidden border-4 border-(--md-sys-color-surface) shadow-lg">
                        <img :src="leader.avatar" :alt="leader.name + '的头像'"
                            class="w-full h-full object-cover"
                            v-if="leader.avatar" />
                        <div v-else class="w-full h-full bg-(--md-sys-color-surface-container-highest) flex items-center justify-center">
                            <div class="text-4xl font-bold text-(--md-sys-color-on-surface-variant)">
                                {{ leader.name.charAt(0) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-2/3 md:pl-8">
                <div class="mb-4">
                    <h3 class="text-2xl font-bold mb-1 text-(--md-sys-color-on-surface)">
                        {{ leader.name }}
                        <span class="text-lg text-(--md-sys-color-on-surface-variant) ml-1"
                            v-if="leader.class">({{ leader.class }})</span>
                    </h3>
                    <div
                        class="inline-block bg-(--md-sys-color-surface-container-high) px-3 py-1 rounded-full text-sm font-medium text-(--md-sys-color-on-surface)">
                        {{ leader.year }} 届会长
                    </div>
                </div>
                <div class="bg-(--md-sys-color-surface-container-low) w-full p-4 rounded-lg mb-4 border border-(--md-sys-color-outline-variant)"
                    v-if="leader.message">
                    <p class="text-(--md-sys-color-on-surface-variant) italic leading-relaxed">
                        "{{ leader.message }}"
                    </p>
                </div>
                <div v-if="leader.achievements && leader.achievements.length > 0">
                    <h4 class="text-lg font-semibold mb-3 text-(--md-sys-color-on-surface)">
                        个人成就
                    </h4>
                    <ul
                        class="space-y-2 bg-(--md-sys-color-surface-container) p-4 rounded-lg border border-(--md-sys-color-outline-variant) max-h-50 overflow-scroll">
                        <li v-for="(achievement, i) in leader.achievements" :key="i" class="flex items-start">
                            <span class="inline-block w-2 h-2 rounded-full bg-(--md-sys-color-primary) mt-2 mr-3 shrink-0"></span>
                            <span class="text-(--md-sys-color-on-surface-variant)">{{ achievement }}</span>
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
