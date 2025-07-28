<template>
    <div class="error-container w-full max-w-2xl" v-if="errorData">
        <div class="bg-white rounded-xl overflow-hidden error-shadow transition-all duration-500 hover:scale-[1.01]">
            <div class=" bg-red-400 text-white p-6 flex items-center">
                <i class="fa fa-exclamation-triangle text-4xl mr-4 error-glow"></i>
                <div>
                    <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold">请求失败</h1>
                    <p class="opacity-90 mt-1">服务器返回了一个错误</p>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-error-light p-4 rounded-lg">
                        <h3 class="font-semibold text-error mb-2 flex items-center">
                            状态码
                        </h3>
                        <p class="text-lg font-mono font-bold text-gray-800">{{ errorData?.status || '未知' }}</p>
                    </div>
                    <div class="bg-error-light p-4 rounded-lg">
                        <h3 class="font-semibold text-error mb-2 flex items-center">
                            错误类型
                        </h3>
                        <p class="text-lg font-mono font-bold text-gray-800">{{ errorData?.name || '未知' }}</p>
                    </div>
                    <div class="bg-error-light p-4 rounded-lg md:col-span-2">
                        <h3 class="font-semibold text-error mb-2 flex items-center">
                            错误信息
                        </h3>
                        <p class="text-lg font-mono font-bold text-gray-800">{{ errorData?.message || '未知错误' }}</p>
                    </div>
                </div>

                <div class="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-700 mb-2 flex items-center">
                        错误详情
                    </h3>
                    <pre class="text-sm font-mono text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
  {{ formattedErrorData }}
            </pre>
                </div>

                <div class="mt-6 flex justify-between items-center">
                    <button
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-300 flex items-center"
                        @click="retryRequest">
                        重试
                    </button>
                    <div class="text-sm text-gray-500">
                        错误发生时间: {{ errorTime }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="text-center text-gray-500 p-8">
        <i class="fa fa-check-circle text-green-500 text-3xl mb-2"></i>
        <p>请求成功，没有错误发生</p>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
    errorData: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['retry']);

const errorTime = ref('');

onMounted(() => {
    if (props.errorData) {
        errorTime.value = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
});

const formattedErrorData = computed(() => {
    return props.errorData
        ? JSON.stringify(props.errorData, null, 2)
        : '{}';
});

const retryRequest = () => {
    emit('retry');
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