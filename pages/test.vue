<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import { NotificationType, NotificationPosition } from '@/types/notification'

const { notificationRef, notify } = useNotification()

// 测试不同类型的通知
const testNotifications = () => {
    notify({
        message: '这是一个成功通知',
        type: NotificationType.SUCCESS,
        timeout: 3000
    })

    notify({
        message: '我们不会使用任何Cookie',
        type: NotificationType.INFO,
        timeout: 7000
    })

    notify({
        message: '这是一个警告通知',
        type: NotificationType.WARNING,
        position: NotificationPosition.TOP_RIGHT
    })

    notify({
        message: '确定要删除此项吗？',
        type: NotificationType.WARNING,
        actions: [
            { text: '取消', handler: () => console.log('取消') },
            { text: '确定', handler: () => console.log('确定'), primary: true }
        ]
    })
}

// 单独触发通知的函数
const triggerNotification = (type: NotificationType, message: string) => {
    notify({ message, type })
}
</script>

<template>
    <div class="p-8">
        <h1 class="text-2xl font-bold mb-6">通知系统测试</h1>

        <button @click="testNotifications"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            触发测试通知
        </button>

        <div class="mt-8 space-y-4">
            <h2 class="text-xl font-semibold">单独触发示例：</h2>
            <div class="flex gap-4 flex-wrap">
                <button @click="triggerNotification(NotificationType.SUCCESS, '成功操作')"
                    class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    成功通知
                </button>
                <button @click="notify({
                    message: '我们不会使用任何Cookie',
                    type: NotificationType.INFO,
                    timeout: 7000
                })"
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    我们不会使用Cookie
                </button>
                <button @click="triggerNotification(NotificationType.WARNING, '警告内容')"
                    class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                    警告通知
                </button>
                <button @click="triggerNotification(NotificationType.ERROR, '发生错误')"
                    class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    错误通知
                </button>
            </div>
        </div>
    </div>
</template>
