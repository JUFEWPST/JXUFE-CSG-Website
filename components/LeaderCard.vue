<template>
    <div
        class="relative mx-auto w-full shrink-0 px-4 py-4 md:px-0 md:max-w-3xl"
    >
        <div class="flex flex-col gap-4 md:flex-row md:gap-8 md:items-start">
            <div class="flex shrink-0 items-start gap-4 md:flex-col md:items-center md:gap-3 md:w-32">
                <div class="relative h-24 w-24 overflow-hidden rounded-full md:h-32 md:w-32 bg-(--md-sys-color-surface-container-highest)">
                    <img
                        v-if="leader.avatar"
                        :src="leader.avatar"
                        :alt="leader.name"
                        class="h-full w-full object-cover"
                    />
                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center"
                    >
                        <span class="text-3xl font-bold text-(--md-sys-color-on-surface-variant)">
                            {{ leader.name.charAt(0) }}
                        </span>
                    </div>
                </div>
                <div class="md:text-center">
                    <span class="inline-block rounded-md bg-(--md-sys-color-primary-container) px-2 py-0.5 text-xs font-bold text-(--md-sys-color-primary)">
                        {{ $t('pages.about.leaders.leaderCardTitle', { year: leader.year }) }}
                    </span>
                </div>
            </div>
            <div class="flex flex-1 flex-col text-left min-w-0">
                <div class="mb-2 flex flex-wrap items-baseline gap-2">
                    <h2 class="text-2xl font-bold text-(--md-sys-color-on-surface)">
                        {{ leader.name }}
                    </h2>
                    <span class="text-sm font-medium text-(--md-sys-color-primary)">
                        {{ leader.class }}
                    </span>
                </div>

                <div v-if="leader.message" class="mb-3">
                    <p class="text-base leading-relaxed text-(--md-sys-color-on-surface-variant)">
                        {{ leader.message }}
                    </p>
                </div>

                <div v-if="leader.achievements?.length" class="space-y-1">
                    <div class="flex flex-wrap gap-x-4 gap-y-1">
                        <span
                            v-for="(achievement, i) in leader.achievements"
                            :key="i"
                            class="inline-flex items-center text-sm text-(--md-sys-color-on-surface-variant)/80"
                        >
                            <span class="mr-1.5 h-1 w-1 rounded-full bg-(--md-sys-color-outline)"></span>
                            {{ achievement }}
                        </span>
                    </div>
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
