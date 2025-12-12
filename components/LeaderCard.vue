<template>
    <div class="w-full shrink-0 px-4 py-6 md:px-8 md:py-8">
        <div class="flex flex-col items-center md:flex-row">
            <div class="mb-6 flex justify-center md:mb-0 md:w-1/3">
                <div class="relative">
                    <div
                        class="h-55 w-55 overflow-hidden rounded-full border-4 border-(--md-sys-color-surface) shadow-lg"
                    >
                        <img
                            :src="leader.avatar"
                            :alt="leader.name + '的头像'"
                            class="h-full w-full object-cover"
                            v-if="leader.avatar"
                        />
                        <div
                            v-else
                            class="flex h-full w-full items-center justify-center bg-(--md-sys-color-surface-container-highest)"
                        >
                            <div
                                class="text-4xl font-bold text-(--md-sys-color-on-surface-variant)"
                            >
                                {{ leader.name.charAt(0) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-2/3 md:pl-8">
                <div class="mb-4">
                    <h3
                        class="mb-1 text-2xl font-bold text-(--md-sys-color-on-surface)"
                    >
                        {{ leader.name }}
                        <span
                            class="ml-1 text-lg text-(--md-sys-color-on-surface-variant)"
                            v-if="leader.class"
                            >({{ leader.class }})</span
                        >
                    </h3>
                    <div
                        class="inline-block rounded-full bg-(--md-sys-color-surface-container-high) px-3 py-1 text-sm font-medium text-(--md-sys-color-on-surface)"
                    >
                        {{ leader.year }} 届会长
                    </div>
                </div>
                <div
                    class="mb-4 w-full rounded-lg border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-4"
                    v-if="leader.message"
                >
                    <p
                        class="leading-relaxed text-(--md-sys-color-on-surface-variant) italic"
                    >
                        "{{ leader.message }}"
                    </p>
                </div>
                <div
                    v-if="leader.achievements && leader.achievements.length > 0"
                >
                    <h4
                        class="mb-3 text-lg font-semibold text-(--md-sys-color-on-surface)"
                    >
                        个人成就
                    </h4>
                    <ul
                        class="max-h-50 space-y-2 overflow-scroll rounded-lg border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-4"
                    >
                        <li
                            v-for="(achievement, i) in leader.achievements"
                            :key="i"
                            class="flex items-start"
                        >
                            <span
                                class="mt-2 mr-3 inline-block h-2 w-2 shrink-0 rounded-full bg-(--md-sys-color-primary)"
                            ></span>
                            <span
                                class="text-(--md-sys-color-on-surface-variant)"
                                >{{ achievement }}</span
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Leader } from "~/types/leader";
defineProps<{
    leader: Leader;
}>();
</script>
