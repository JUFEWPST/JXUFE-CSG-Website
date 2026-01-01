<template>
    <div
        class="flex w-full min-w-75 flex-row items-start gap-4 rounded-xl p-3 transition-colors hover:bg-(--md-sys-color-surface-container-highest)/50"
        :title="person.honors?.join(' | ')"
    >
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-(--md-sys-color-surface-container-highest)">
            <img
                v-if="person.avatar"
                :src="person.avatar"
                :alt="person.name"
                class="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
            />
            <div
                v-else
                class="flex h-full w-full items-center justify-center"
            >
                <span class="text-xl font-bold text-(--md-sys-color-on-surface-variant)">
                    {{ nameInitial }}
                </span>
            </div>
        </div>
        <div class="flex flex-1 flex-col min-w-0">
            <div class="mb-1 flex flex-wrap items-center gap-2 min-w-0">
                <h3
                    class="text-lg font-bold text-(--md-sys-color-on-surface) truncate"
                    :title="person.name"
                >
                    {{ person.name }}
                </h3>
                <span
                    v-if="person.className"
                    class="inline-flex items-center rounded-md bg-(--md-sys-color-secondary-container) px-2 py-0.5 text-xs font-bold text-(--md-sys-color-primary)"
                    :title="person.className"
                >
                    {{ person.className }}
                </span>
            </div>
            <ul
                v-if="person.honors?.length"
                class="space-y-1.5"
            >
                <li
                    v-for="(honor, index) in person.honors"
                    :key="index"
                    class="flex min-w-0 items-start gap-2 text-sm leading-relaxed text-(--md-sys-color-on-surface-variant)/80"
                    :title="honor"
                >
                    <span
                        class="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--md-sys-color-outline)"
                        aria-hidden="true"
                    ></span>
                    <span class="min-w-0 wrap-break-word">{{ honor }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { person } from "~/data/excellentData";

const props = defineProps<{ person: person }>();

const nameInitial = computed(() => {
    if (!props.person.name) {
        return "○";
    }
    return props.person.name.charAt(0).toUpperCase() || "";
});
</script>
