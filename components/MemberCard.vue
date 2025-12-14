<template>
    <div
        class="flex w-full min-w-70 flex-row items-start gap-4 rounded-xl p-3 transition-colors hover:bg-(--md-sys-color-surface-container-highest)/50"
        :title="member.message"
    >
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-(--md-sys-color-surface-container-highest)">
            <img
                v-if="member.avatar"
                :src="member.avatar"
                :alt="member.display || 'User Avatar'"
                class="h-full w-full object-cover"
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

        <!-- Content -->
        <div class="flex flex-1 flex-col min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="text-lg font-bold text-(--md-sys-color-on-surface)">
                    {{ member.display || "" }}
                </h3>
                <span class="inline-flex items-center rounded-md bg-(--md-sys-color-primary-container) px-2 py-0.5 text-xs font-bold text-(--md-sys-color-primary)">
                    {{ member.position }}
                </span>
            </div>

            <p v-if="member.message" class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) line-clamp-2">
                {{ member.message }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Member } from "~/data/membersData";

const props = defineProps<{ member: Member }>();
const nameInitial = computed(() => {
    if (!props.member.display) {
        return "";
    }
    return props.member.display.charAt(0).toUpperCase() || "";
});
</script>
