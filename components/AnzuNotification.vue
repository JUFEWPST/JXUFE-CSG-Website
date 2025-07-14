<script setup lang="ts">
interface Notification {
    id: number;
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    timeout?: number;
    position?: 'bottom-right' | 'top-right' | 'center'; // 添加 position 属性
}

const notifications = ref < Notification[] > ([])

const props = defineProps({
    position: {
        type: String as () => 'bottom-right' | 'top-right' | 'center',
        default: 'bottom-right',
        validator: (value: string) => {
            return ['bottom-right', 'top-right', 'center'].includes(value)
        }
    }
})

const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now()
    notifications.value.push({ ...notification, id })

    if (notification.timeout) {
        setTimeout(() => {
            removeNotification(id)
        }, notification.timeout)
    }
}

const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
}

defineExpose({
    addNotification,
    removeNotification
})
</script>

<template>
    <div class="fixed z-50" :class="{
        'bottom-4 right-4': props.position === 'bottom-right',
        'top-4 right-4': props.position === 'top-right',
        'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2': props.position === 'center'
    }">
        <TransitionGroup name="notification">
            <div v-for="notification in notifications" :key="notification.id" class="mb-2 p-4 rounded shadow-lg" :class="{
                'bg-green-100 text-green-800': notification.type === 'success',
                'bg-blue-100 text-blue-800': notification.type === 'info',
                'bg-yellow-100 text-yellow-800': notification.type === 'warning',
                'bg-red-100 text-red-800': notification.type === 'error'
            }">
                <div class="flex justify-between items-center">
                    <span>{{ notification.message }}</span>
                    <button @click="removeNotification(notification.id)" class="ml-4">
                        &times;
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<style>
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
