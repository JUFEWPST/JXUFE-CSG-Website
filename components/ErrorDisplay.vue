<template>
    <div
        v-if="errorData"
        class="w-full max-w-2xl"
    >
        <div
            class="overflow-hidden rounded-xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-6 shadow-sm"
        >
            <!-- Header -->
            <div class="flex items-start gap-4">
                <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--md-sys-color-error-container) text-(--md-sys-color-on-error-container)"
                >
                    <ExclamationTriangleIcon class="h-6 w-6" />
                </div>
                <div class="min-w-0 flex-1">
                    <h1
                        class="text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold text-(--md-sys-color-on-surface)"
                    >
                        请求失败
                    </h1>
                    <p class="mt-1 text-sm text-(--md-sys-color-on-surface-variant)">
                        服务器返回了一个错误
                    </p>
                </div>
            </div>

            <!-- Summary blocks -->
            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                    class="rounded-lg bg-(--md-sys-color-surface-container-highest) p-4"
                >
                    <h3
                        class="text-sm font-semibold text-(--md-sys-color-on-surface-variant)"
                    >
                        状态码
                    </h3>
                    <p
                        class="mt-1 font-mono text-lg font-bold text-(--md-sys-color-on-surface)"
                    >
                        {{ errorData?.status || "未知" }}
                    </p>
                </div>

                <div
                    class="rounded-lg bg-(--md-sys-color-surface-container-highest) p-4"
                >
                    <h3
                        class="text-sm font-semibold text-(--md-sys-color-on-surface-variant)"
                    >
                        错误类型
                    </h3>
                    <p
                        class="mt-1 font-mono text-lg font-bold text-(--md-sys-color-on-surface)"
                    >
                        {{ errorData?.name || "未知" }}
                    </p>
                </div>

                <div
                    class="rounded-lg bg-(--md-sys-color-surface-container-highest) p-4 sm:col-span-2"
                >
                    <h3
                        class="text-sm font-semibold text-(--md-sys-color-on-surface-variant)"
                    >
                        错误信息
                    </h3>
                    <p
                        class="mt-1 font-mono text-sm font-semibold text-(--md-sys-color-on-surface) wrap-break-word"
                    >
                        {{ errorData?.message || "未知错误" }}
                    </p>
                </div>
            </div>

            <!-- Details -->
            <details
                class="mt-6 rounded-lg border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) p-4"
            >
                <summary
                    class="cursor-pointer select-none text-sm font-semibold text-(--md-sys-color-primary) outline-none"
                >
                    错误详情
                </summary>
                <pre
                    class="mt-3 overflow-x-auto rounded-lg bg-(--md-sys-color-surface-container-highest) p-3 font-mono text-xs text-(--md-sys-color-on-surface-variant)"
                >{{ formattedErrorData }}</pre
                >
            </details>

            <!-- Actions -->
            <div
                class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <AnzuButton
                    variant="tonal"
                    @click="retryRequest"
                >
                    重试
                </AnzuButton>
                <div class="text-xs text-(--md-sys-color-on-surface-variant)">
                    错误发生时间: {{ errorTime || "-" }}
                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        class="w-full max-w-2xl rounded-xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-6"
    >
        <div class="flex items-start gap-4">
            <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)"
            >
                <CheckCircleIcon class="h-6 w-6" />
            </div>
            <div class="min-w-0 flex-1">
                <h2 class="text-lg font-bold text-(--md-sys-color-on-surface)">
                    请求成功
                </h2>
                <p class="mt-1 text-sm text-(--md-sys-color-on-surface-variant)">
                    没有错误发生
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

import AnzuButton from "~/components/AnzuButton.vue";

type UnknownError = {
    status?: number | string;
    name?: string;
    message?: string;
    [key: string]: unknown;
};

const props = defineProps<{
    errorData: UnknownError | null;
}>();

const emit = defineEmits<{
    (e: "retry"): void;
}>();

const errorTime = ref<string>("");

watch(
    () => props.errorData,
    (val) => {
        if (val) {
            errorTime.value = new Date().toLocaleString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        } else {
            errorTime.value = "";
        }
    },
    { immediate: true },
);

const formattedErrorData = computed(() => {
    return props.errorData ? JSON.stringify(props.errorData, null, 2) : "{}";
});

function retryRequest() {
    emit("retry");
}
</script>
