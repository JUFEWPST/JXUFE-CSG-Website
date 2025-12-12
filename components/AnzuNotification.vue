<script setup lang="ts">
import {
    NotificationType,
    NotificationPosition,
    type Notification,
} from "@/types/notification";
import { ref } from "vue";
import {
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from "@heroicons/vue/24/outline";

const notifications = ref<Notification[]>([]);

const props = defineProps({
    position: {
        type: String as () => NotificationPosition,
        default: NotificationPosition.BOTTOM_RIGHT,
        validator: (value: string) => {
            return Object.values(NotificationPosition).includes(
                value as NotificationPosition,
            );
        },
    },
});

const typeIconColors = {
    success: "text-emerald-500",
    info: "text-sky-500",
    warning: "text-amber-500",
    error: "text-rose-500",
} as const;

const getTypeIcon = (type: string | undefined) => {
    const map: Record<string, any> = {
        [NotificationType.SUCCESS]: CheckCircleIcon,
        [NotificationType.INFO]: InformationCircleIcon,
        [NotificationType.WARNING]: ExclamationTriangleIcon,
        [NotificationType.ERROR]: XCircleIcon,
    };
    return map[type || NotificationType.INFO] || InformationCircleIcon;
};

const getTypeIconColor = (type: string | undefined) => {
    const map: Record<string, string> = {
        success: typeIconColors.success,
        info: typeIconColors.info,
        warning: typeIconColors.warning,
        error: typeIconColors.error,
    };
    return map[type || NotificationType.INFO] || typeIconColors.info;
};

const timerIds = new Map<number, number>();

const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    notifications.value.push({ ...notification, id });
    const timeout = notification.timeout ?? 5000;
    if (timeout > 0) {
        const timerId = window.setTimeout(() => {
            removeNotification(id);
        }, timeout);
        timerIds.set(id, timerId);
    }
};

const removeNotification = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
        notifications.value.splice(index, 1);
        const timerId = timerIds.get(id);
        if (timerId) {
            window.clearTimeout(timerId);
            timerIds.delete(id);
        }
    }
};

const handleAction = (action: any) => {
    if (action.route) {
        navigateTo(action.route);
    } else if (action.handler) {
        action.handler();
    }
    if (action.notificationId) removeNotification(action.notificationId);
};

onUnmounted(() => {
    timerIds.forEach((timerId) => window.clearTimeout(timerId));
    timerIds.clear();
});

defineExpose({
    addNotification,
    removeNotification,
});
</script>

<template>
    <div
        class="fixed z-50"
        :class="{
            'right-4 bottom-4': position === NotificationPosition.BOTTOM_RIGHT,
            'top-4 right-4': position === NotificationPosition.TOP_RIGHT,
            'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2':
                position === NotificationPosition.CENTER,
        }"
    >
        <TransitionGroup name="notification">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                class="shadow-center-md relative mb-3 w-80 overflow-hidden rounded-xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-highest) text-(--md-sys-color-on-surface)"
                :class="{
                    'min-h-16': !notification.actions,
                    'min-h-24': notification.actions,
                }"
            >
                <div class="flex items-start gap-3 p-4 pr-10 pb-3">
                    <div class="mt-0.5 shrink-0">
                        <component
                            :is="getTypeIcon(notification.type)"
                            class="h-5 w-5"
                            :class="getTypeIconColor(notification.type)"
                        />
                    </div>

                    <div class="flex-1">
                        <button
                            @click="removeNotification(notification.id)"
                            class="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-base leading-none text-(--md-sys-color-on-surface-variant) transition-colors hover:bg-(--md-sys-color-surface-variant) hover:text-(--md-sys-color-on-surface)"
                            aria-label="关闭通知"
                        >
                            &times;
                        </button>

                        <div>
                            <span
                                class="text-sm leading-snug text-(--md-sys-color-on-surface)"
                            >
                                {{ notification.message }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 px-4 pb-3">
                    <template v-if="notification.actions">
                        <button
                            v-for="(action, index) in notification.actions"
                            :key="index"
                            @click="
                                handleAction({
                                    ...action,
                                    notificationId: notification.id,
                                })
                            "
                            class="rounded-full border px-3 py-1.5 text-xs transition-colors"
                            :class="{
                                'border-(--md-sys-color-outline) text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-variant)':
                                    !action.primary,
                                'border-transparent bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container)':
                                    action.primary,
                            }"
                        >
                            {{ action.text }}
                        </button>
                    </template>
                </div>

                <!-- 底部进度条：使用 MD3 颜色系统 -->
                <div
                    class="absolute bottom-0 h-1 w-full overflow-hidden bg-(--md-sys-color-primary)"
                >
                    <div
                        v-if="notification.timeout !== 0"
                        class="bg-opacity-30 absolute top-0 right-0 h-full bg-white"
                        :style="{
                            animation: `progress ${notification.timeout ?? 5000}ms linear forwards`,
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
