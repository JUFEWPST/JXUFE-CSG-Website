import { ref } from 'vue'
import type { NotificationOptions } from '@/types/notification'

const notificationRef = ref<{
    addNotification: (notification: NotificationOptions) => void
    removeNotification: (id: number) => void
} | null>(null)

export const useNotification = () => {
    const notify = (options: NotificationOptions) => {
        if (notificationRef.value) {
            notificationRef.value.addNotification(options)
        } else {
            console.warn('通知组件未挂载')
        }
    }

    return {
        notificationRef,
        notify
    }
}
