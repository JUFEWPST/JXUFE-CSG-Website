<template>
    <div
        class="flex w-full min-w-75 flex-row items-start gap-4 rounded-xl p-3 transition-colors hover:bg-(--md-sys-color-surface-container-highest)/50"
    >
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-(--md-sys-color-surface-container-highest)">
            <img
                :src="person.avatar"
                :alt="person.name"
                class="h-full w-full object-cover"
            />
        </div>
        <div class="flex flex-1 flex-col min-w-0">
            <div class="mb-2">
                <h3 class="text-lg font-bold text-(--md-sys-color-on-surface)">
                    {{ person.name }}
                </h3>
                <span class="text-sm font-medium text-(--md-sys-color-primary)">
                    {{ person.className }}
                </span>
            </div>

            <div v-if="person.honors?.length">
                <ul class="space-y-1">
                    <li
                        v-for="(honor, index) in person.honors"
                        :key="index"
                        class="text-sm leading-snug text-(--md-sys-color-on-surface-variant)"
                    >
                        • {{ honor }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { person } from "~/data/excellentData";

defineProps<{ person: person }>();
</script>
