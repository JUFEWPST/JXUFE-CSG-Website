<template>
    <div v-if="normalizedError" class="w-full max-w-2xl">
        <div
            class="overflow-hidden rounded-2xl border border-(--md-sys-color-outline-variant) p-6 shadow-sm"
        >
            <!-- Header -->
            <div class="flex items-start gap-4">
                <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-(--md-sys-color-error) ring-1 ring-(--md-sys-color-error)"
                >
                    <ExclamationTriangleIcon class="h-6 w-6" />
                </div>
                <div class="min-w-0 flex-1">
                    <h1
                        class="text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold text-(--md-sys-color-on-surface)"
                    >
                        请求失败
                    </h1>
                    <p
                        class="mt-1 text-sm text-(--md-sys-color-on-surface-variant)"
                    >
                        服务器返回了一个错误
                    </p>
                </div>
            </div>

            <!-- Summary blocks -->
            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                    class="rounded-lg border border-(--md-sys-color-outline-variant) p-4"
                >
                    <h3
                        class="text-sm font-semibold text-(--md-sys-color-on-surface-variant)"
                    >
                        状态码
                    </h3>
                    <p
                        class="mt-1 font-mono text-lg font-bold text-(--md-sys-color-on-surface)"
                    >
                        {{ normalizedError.status || "未知" }}
                    </p>
                </div>

                <div
                    class="rounded-lg border border-(--md-sys-color-outline-variant) p-4"
                >
                    <h3
                        class="text-sm font-semibold text-(--md-sys-color-on-surface-variant)"
                    >
                        错误类型
                    </h3>
                    <p
                        class="mt-1 font-mono text-lg font-bold text-(--md-sys-color-on-surface)"
                    >
                        {{ normalizedError.name || "未知" }}
                    </p>
                </div>

                <div
                    class="rounded-lg border border-(--md-sys-color-outline-variant) p-4 sm:col-span-2"
                >
                    <h3
                        class="text-sm font-semibold text-(--md-sys-color-on-surface-variant)"
                    >
                        错误信息
                    </h3>
                    <p
                        class="mt-1 wrap-break-word font-mono text-sm font-semibold text-(--md-sys-color-on-surface)"
                    >
                        {{ normalizedError.message || "未知错误" }}
                    </p>
                </div>
            </div>

            <!-- Details -->
            <details
                class="mt-6 rounded-lg border border-(--md-sys-color-outline-variant) p-4"
            >
                <summary
                    class="cursor-pointer select-none text-sm font-semibold text-(--md-sys-color-primary) outline-none"
                >
                    错误详情
                </summary>
                <pre
                    class="mt-3 overflow-x-auto rounded-lg border border-(--md-sys-color-outline-variant) p-3 font-mono text-xs text-(--md-sys-color-on-surface-variant)"
                    >{{ formattedErrorData }}</pre
                >
            </details>

            <!-- Actions -->
            <div
                class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="flex flex-wrap items-center gap-2">
                    <AnzuButton
                        v-if="canRetry"
                        variant="tonal"
                        @click="retryRequest"
                    >
                        重试
                    </AnzuButton>
                    <AnzuButton variant="text" @click="copyDetails">
                        {{ copied ? "已复制" : "复制详情" }}
                    </AnzuButton>
                </div>
                <div class="text-xs text-(--md-sys-color-on-surface-variant)">
                    错误发生时间: {{ errorTime || "-" }}
                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        class="w-full max-w-2xl rounded-2xl border border-(--md-sys-color-outline-variant) p-6"
    >
        <div class="flex items-start gap-4">
            <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-(--md-sys-color-primary) ring-1 ring-(--md-sys-color-primary)"
            >
                <CheckCircleIcon class="h-6 w-6" />
            </div>
            <div class="min-w-0 flex-1">
                <h2 class="text-lg font-bold text-(--md-sys-color-on-surface)">
                    请求成功
                </h2>
                <p
                    class="mt-1 text-sm text-(--md-sys-color-on-surface-variant)"
                >
                    没有错误发生
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance } from "vue";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

import AnzuButton from "~/components/AnzuButton.vue";

const props = defineProps<{
    errorData: unknown | null;
}>();

const emit = defineEmits<{
    (e: "retry"): void;
}>();

const errorTime = ref<string>("");
const copied = ref(false);

type NormalizedError = {
    status: number | string;
    name: string;
    message: string;
    details: Record<string, unknown>;
};

const toRecord = (value: unknown): Record<string, unknown> | null => {
    if (!value || typeof value !== "object") return null;
    return value as Record<string, unknown>;
};

const normalizedError = computed<NormalizedError | null>(() => {
    if (!props.errorData) return null;
    if (typeof props.errorData === "string") {
        return {
            status: "-",
            name: "Error",
            message: props.errorData,
            details: {},
        };
    }

    if (props.errorData instanceof Error) {
        return {
            status: (props.errorData as any).status ?? "-",
            name: props.errorData.name || "Error",
            message: props.errorData.message || "未知错误",
            details: (props.errorData as any).details ?? {},
        };
    }

    const record = toRecord(props.errorData) || {};
    const status =
        (record.status as number | string | undefined) ??
        (record.statusCode as number | string | undefined) ??
        (record.code as number | string | undefined) ??
        "-";

    return {
        status,
        name: (record.name as string | undefined) || "ApiError",
        message: (record.message as string | undefined) || "未知错误",
        details: (record.details as Record<string, unknown> | undefined) ?? {},
    };
});

const canRetry = computed(() => {
    const instance = getCurrentInstance();
    return Boolean(instance?.vnode.props?.onRetry);
});

watch(
    () => normalizedError.value,
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
    return normalizedError.value
        ? JSON.stringify(
              {
                  ...normalizedError.value,
                  raw: props.errorData,
              },
              null,
              2,
          )
        : "{}";
});

function retryRequest() {
    emit("retry");
}

async function copyDetails() {
    try {
        await navigator.clipboard?.writeText(formattedErrorData.value);
        copied.value = true;
        setTimeout(() => (copied.value = false), 1500);
    } catch {
        copied.value = false;
    }
}
</script>
