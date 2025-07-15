<script setup lang="ts">
import { NotificationType, NotificationPosition, type Notification } from '@/types/notification'
import { onMounted, ref } from 'vue'

const notifications = ref<Notification[]>([])

const props = defineProps({
    position: {
        type: String as () => NotificationPosition,
        default: NotificationPosition.BOTTOM_RIGHT,
        validator: (value: string) => {
            return Object.values(NotificationPosition).includes(value as NotificationPosition)
        }
    }
})

type NotificationTypeKey = keyof typeof typeColors

const typeColors = {
    success: {
        bg: 'bg-emerald-500',
        hover: 'hover:bg-emerald-600',
        progress: 'bg-emerald-600'
    },
    info: {
        bg: 'bg-sky-500',
        hover: 'hover:bg-sky-600',
        progress: 'bg-sky-500'
    },
    warning: {
        bg: 'bg-amber-500',
        hover: 'hover:bg-amber-600',
        progress: 'bg-amber-500'
    },
    error: {
        bg: 'bg-rose-500',
        hover: 'hover:bg-rose-600',
        progress: 'bg-rose-500'
    }
} as const

const getTypeColor = (type: string | undefined) => {
    if (!type || !(type in typeColors)) {
        return typeColors.info // 默认返回 info 类型的颜色
    }
    return typeColors[type as NotificationTypeKey]
}

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
        'bottom-4 right-4': props.position === NotificationPosition.BOTTOM_RIGHT,
        'top-4 right-4': props.position === NotificationPosition.TOP_RIGHT,
        'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2': props.position === NotificationPosition.CENTER
    }">
        <TransitionGroup name="notification">
            <div v-for="notification in notifications" :key="notification.id"
                class="mb-3 w-80 bg-white dark:bg-gray-800 shadow-md relative overflow-hidden rounded-t" :class="{
                    'min-h-16': !notification.actions,
                    'min-h-24': notification.actions
                }">
                <div class="p-4 pb-3">
                    <button @click="removeNotification(notification.id)"
                        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl leading-none w-6 h-6 flex items-center justify-center"
                        aria-label="关闭通知">
                        &times;
                    </button>

                    <div class="pr-6">
                        <span class="text-md text-gray-700 dark:text-gray-300">{{ notification.message }}</span>
                    </div>
                </div>
                <div class="px-4 pb-3 flex justify-end space-x-2">
                    <template v-if="notification.actions">
                        <button v-for="(action, index) in notification.actions" :key="index" @click="action.handler"
                            class="px-3 py-1 text-xs rounded transition-colors" :class="{
                                'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600': !action.primary,
                                [getTypeColor(notification.type).bg]: action.primary,
                                [getTypeColor(notification.type).hover]: action.primary,
                                'text-white': action.primary
                            }">
                            {{ action.text }}
                        </button>
                    </template>
                </div>
                <div class="h-1 w-full absolute bottom-0 overflow-hidden"
                    :class="getTypeColor(notification.type).progress">
                    <div v-if="notification.timeout" class="h-full bg-white bg-opacity-30 absolute top-0 right-0"
                        :style="{
                            animation: `progress ${notification.timeout}ms linear forwards`
                        }"></div>
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

@keyframes progress {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}
</style>
