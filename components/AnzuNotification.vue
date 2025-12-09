<script setup lang="ts">
import { NotificationType, NotificationPosition, type Notification } from '@/types/notification'
import { ref } from 'vue'
import {
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline'

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

const typeIconColors = {
    success: 'text-emerald-500',
    info: 'text-sky-500',
    warning: 'text-amber-500',
    error: 'text-rose-500'
} as const

const getTypeIcon = (type: string | undefined) => {
    const map: Record<string, any> = {
        [NotificationType.SUCCESS]: CheckCircleIcon,
        [NotificationType.INFO]: InformationCircleIcon,
        [NotificationType.WARNING]: ExclamationTriangleIcon,
        [NotificationType.ERROR]: XCircleIcon
    }
    return map[type || NotificationType.INFO] || InformationCircleIcon
}

const getTypeIconColor = (type: string | undefined) => {
    const map: Record<string, string> = {
        success: typeIconColors.success,
        info: typeIconColors.info,
        warning: typeIconColors.warning,
        error: typeIconColors.error
    }
    return map[type || NotificationType.INFO] || typeIconColors.info
}

const timerIds = new Map<number, number>()

const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    notifications.value.push({ ...notification, id })
    const timeout = notification.timeout ?? 5000;
    if (timeout > 0) {
        const timerId = window.setTimeout(() => {
            removeNotification(id);
        }, timeout);
        timerIds.set(id, timerId);
    }
}

const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
        notifications.value.splice(index, 1)
        const timerId = timerIds.get(id)
        if (timerId) {
            window.clearTimeout(timerId)
            timerIds.delete(id)
        }
    }
}

const handleAction = (action: any) => {
    if (action.route) {
        navigateTo(action.route)
    } else if (action.handler) {
        action.handler()
    }
    if (action.notificationId) removeNotification(action.notificationId)
}

onUnmounted(() => {
    timerIds.forEach(timerId => window.clearTimeout(timerId))
    timerIds.clear()
})

defineExpose({
    addNotification,
    removeNotification
})
</script>

<template>
    <div
        class="fixed z-50"
        :class="{
            'bottom-4 right-4': position === NotificationPosition.BOTTOM_RIGHT,
            'top-4 right-4': position === NotificationPosition.TOP_RIGHT,
            'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2': position === NotificationPosition.CENTER
        }"
    >
        <TransitionGroup name="notification">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                class="mb-3 w-80 relative overflow-hidden rounded-xl shadow-center-md bg-(--md-sys-color-surface-container-highest) text-(--md-sys-color-on-surface) border border-(--md-sys-color-outline-variant)"
                :class="{
                    'min-h-16': !notification.actions,
                    'min-h-24': notification.actions
                }"
            >
                <div class="p-4 pb-3 pr-10 flex items-start gap-3">
                    <div class="mt-0.5 flex-shrink-0">
                        <component
                            :is="getTypeIcon(notification.type)"
                            class="w-5 h-5"
                            :class="getTypeIconColor(notification.type)"
                        />
                    </div>

                    <div class="flex-1">
                        <button
                            @click="removeNotification(notification.id)"
                            class="absolute top-3 right-3 text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-variant) hover:text-(--md-sys-color-on-surface) rounded-full transition-colors text-base leading-none w-7 h-7 flex items-center justify-center"
                            aria-label="关闭通知"
                        >
                            &times;
                        </button>

                        <div>
                            <span class="text-sm leading-snug text-(--md-sys-color-on-surface)">
                                {{ notification.message }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="px-4 pb-3 flex justify-end space-x-2">
                    <template v-if="notification.actions">
                        <button
                            v-for="(action, index) in notification.actions"
                            :key="index"
                            @click="handleAction({ ...action, notificationId: notification.id })"
                            class="px-3 py-1.5 text-xs rounded-full border transition-colors"
                            :class="{
                                'text-(--md-sys-color-on-surface-variant) border-(--md-sys-color-outline) hover:bg-(--md-sys-color-surface-variant)': !action.primary,
                                'bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) border-transparent hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container)': action.primary
                            }"
                        >
                            {{ action.text }}
                        </button>
                    </template>
                </div>

                <!-- 底部进度条：使用 MD3 颜色系统 -->
                <div
                    class="h-1 w-full absolute bottom-0 overflow-hidden bg-(--md-sys-color-primary)"
                >
                    <div
                        v-if="notification.timeout !== 0"
                        class="h-full bg-white bg-opacity-30 absolute top-0 right-0"
                        :style="{
                            animation: `progress ${notification.timeout ?? 5000}ms linear forwards`
                        }"
                    ></div>
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
