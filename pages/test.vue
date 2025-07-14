<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'

const { notificationRef, notify } = useNotification()

// 测试不同类型的通知
const testNotifications = () => {
    notify({
        message: '这是一个成功通知',
        type: 'success',
        timeout: 3000
    })

    notify({
        message: '这是一个信息通知',
        type: 'info',
        timeout: 5000
    })

    notify({
        message: '这是一个警告通知',
        type: 'warning',
        position: 'top-right'
    })

    notify({
        message: '这是一个错误通知',
        type: 'error',
        position: 'center',
        timeout: 4000
    })
}
</script>

<template>
    <div class="p-8">
        <h1 class="text-2xl font-bold mb-6">通知系统测试</h1>

        <button @click="testNotifications" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            触发测试通知
        </button>

        <div class="mt-8 space-y-4">
            <h2 class="text-xl font-semibold">单独触发示例：</h2>
            <div class="flex gap-4">
                <button @click="notify({ message: '成功操作', type: 'success' })"
                    class="px-3 py-1 bg-green-500 text-white rounded">
                    成功通知
                </button>
                <button @click="notify({ message: '普通信息', type: 'info' })"
                    class="px-3 py-1 bg-blue-500 text-white rounded">
                    信息通知
                </button>
                <button @click="notify({ message: '警告内容', type: 'warning' })"
                    class="px-3 py-1 bg-yellow-500 text-white rounded">
                    警告通知
                </button>
                <button @click="notify({ message: '发生错误', type: 'error' })"
                    class="px-3 py-1 bg-red-500 text-white rounded">
                    错误通知
                </button>
            </div>
        </div>
    </div>
</template>
