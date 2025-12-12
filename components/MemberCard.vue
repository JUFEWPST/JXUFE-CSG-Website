<template>
    <div
        class="member-card flex h-40 w-full min-w-[300px] flex-col items-center overflow-hidden rounded-xl bg-(--md-sys-color-surface-container-low) transition-all duration-300 dark:bg-(--md-sys-color-surface-container)"
        :title="member.message"
    >
        <div class="relative h-25 w-full">
            <img
                v-if="member.avatar"
                class="absolute top-0 left-0 z-1 h-full w-full object-cover opacity-30"
                :src="member.avatar"
                alt="背景图"
            />
            <div
                v-else
                class="absolute top-0 left-0 z-1 h-full w-full bg-(--md-sys-color-primary-container)/10"
            />
            <div
                class="absolute top-0 left-0 z-2 box-border flex h-full w-full gap-2 p-2"
            >
                <div
                    class="relative -bottom-10 h-20 w-20 overflow-hidden rounded-full shadow-sm"
                >
                    <img
                        v-if="member.avatar"
                        :src="member.avatar"
                        :alt="(member.display || 'fakename') + '的头像'"
                        class="h-full w-full object-cover"
                    />
                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center bg-(--md-sys-color-surface-container-highest)"
                    >
                        <span
                            class="text-2xl font-bold text-(--md-sys-color-on-surface-variant)"
                            >{{ nameInitial }}</span
                        >
                    </div>
                </div>
                <div class="relative flex-1">
                    <div class="absolute bottom-0 flex-1">
                        <h2
                            class="text-2xl font-bold text-(--md-sys-color-on-surface)"
                            :class="{ 'opacity-35 blur-sm': !member.display }"
                        >
                            {{ member.display || "fakename" }}
                        </h2>
                        <span
                            class="mt-1 truncate rounded-full bg-(--md-sys-color-primary) px-2 py-1 text-xs font-medium text-(--md-sys-color-on-primary) shadow-sm"
                        >
                            {{ member.position }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="member.message" class="mt-1 w-full flex-1">
            <p
                class="box-border w-full pl-22 text-sm text-(--md-sys-color-on-surface-variant)"
            >
                <span class="">「</span>{{ member.message
                }}<span class="">」</span>
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
        return "○";
    }
    return props.member.display.charAt(0).toUpperCase() || "";
});
</script>

<style scoped>
.member-card {
    box-shadow: 0px 0px 3px
        color-mix(in srgb, var(--md-sys-color-shadow), transparent 80%);
}
</style>
