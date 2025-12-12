<template>
    <div
        class="flex h-100 min-w-90 flex-col items-center overflow-hidden rounded-xl bg-(--md-sys-color-surface-container-low) shadow-lg transition-all duration-300 dark:bg-(--md-sys-color-surface-container)"
    >
        <div class="relative h-35 w-full">
            <img
                class="absolute top-0 left-0 z-1 h-full w-full object-cover opacity-30"
                :src="person.avatar"
                alt="背景图"
            />
            <div
                class="absolute top-0 left-0 z-2 box-border flex h-full w-full gap-2 p-2"
            >
                <img
                    class="relative -bottom-12 h-30 w-30 rounded-full object-cover shadow-sm"
                    :src="person.avatar"
                    :alt="person.name + '的头像'"
                />
                <div class="relative flex-1">
                    <div class="absolute bottom-0 flex-1">
                        <h2
                            class="mt-4 text-2xl font-bold text-(--md-sys-color-on-surface)"
                        >
                            {{ person.name }}
                        </h2>
                        <p
                            class="text-sm text-(--md-sys-color-on-surface-variant)"
                        >
                            {{ person.className }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-10 box-border w-full flex-1 rounded-lg px-4 pb-1">
            <div class="overflow-scroll">
                <ul class="mt-1 space-y-1">
                    <li
                        v-for="(honor, index) in person.honors"
                        :key="index"
                        class="flex items-start text-(--md-sys-color-on-surface-variant)"
                    >
                        <div class="relative mt-1.5 mr-2">
                            <div
                                class="absolute h-2 w-2 rounded-full bg-(--md-sys-color-primary)"
                            ></div>
                            <div class="h-2 w-2"></div>
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
import type { person } from "~/data/excellentData";

const props = defineProps<{ person: person }>();
</script>

<style scoped></style>
