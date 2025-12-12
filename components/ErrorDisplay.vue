<template>
    <div class="error-container w-full max-w-2xl" v-if="errorData">
        <div
            class="error-shadow overflow-hidden rounded-xl bg-white transition-all duration-500 hover:scale-[1.01]"
        >
            <div class="flex items-center bg-red-400 p-6 text-white">
                <i
                    class="fa fa-exclamation-triangle error-glow mr-4 text-4xl"
                ></i>
                <div>
                    <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold">
                        请求失败
                    </h1>
                    <p class="mt-1 opacity-90">服务器返回了一个错误</p>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="bg-error-light rounded-lg p-4">
                        <h3
                            class="text-error mb-2 flex items-center font-semibold"
                        >
                            状态码
                        </h3>
                        <p class="font-mono text-lg font-bold text-gray-800">
                            {{ errorData?.status || "未知" }}
                        </p>
                    </div>
                    <div class="bg-error-light rounded-lg p-4">
                        <h3
                            class="text-error mb-2 flex items-center font-semibold"
                        >
                            错误类型
                        </h3>
                        <p class="font-mono text-lg font-bold text-gray-800">
                            {{ errorData?.name || "未知" }}
                        </p>
                    </div>
                    <div class="bg-error-light rounded-lg p-4 md:col-span-2">
                        <h3
                            class="text-error mb-2 flex items-center font-semibold"
                        >
                            错误信息
                        </h3>
                        <p class="font-mono text-lg font-bold text-gray-800">
                            {{ errorData?.message || "未知错误" }}
                        </p>
                    </div>
                </div>

                <div class="mt-6 rounded-lg bg-gray-50 p-4">
                    <h3
                        class="mb-2 flex items-center font-semibold text-gray-700"
                    >
                        错误详情
                    </h3>
                    <pre
                        class="overflow-x-auto rounded bg-gray-100 p-3 font-mono text-sm text-gray-600"
                    >
  {{ formattedErrorData }}
            </pre
                    >
                </div>

                <div class="mt-6 flex items-center justify-between">
                    <button
                        class="flex items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-gray-300"
                        @click="retryRequest"
                    >
                        重试
                    </button>
                    <div class="text-sm text-gray-500">
                        错误发生时间: {{ errorTime }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="p-8 text-center text-gray-500">
        <i class="fa fa-check-circle mb-2 text-3xl text-green-500"></i>
        <p>请求成功，没有错误发生</p>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";

const props = defineProps({
    errorData: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(["retry"]);

const errorTime = ref("");

onMounted(() => {
    if (props.errorData) {
        errorTime.value = new Date().toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
});

const formattedErrorData = computed(() => {
    return props.errorData ? JSON.stringify(props.errorData, null, 2) : "{}";
});

const retryRequest = () => {
    emit("retry");
};
</script>

<style scoped>
.content-auto {
    content-visibility: auto;
}

.error-shadow {
    box-shadow: 0 4px 20px rgba(255, 77, 79, 0.15);
}

.error-glow {
    text-shadow: 0 0 10px rgba(255, 77, 79, 0.3);
}
</style>
