export enum NotificationType {
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error'
}

export enum NotificationPosition {
    BOTTOM_RIGHT = 'bottom-right',
    TOP_RIGHT = 'top-right',
    CENTER = 'center'
}

export interface NotificationAction {
    text: string
    handler: () => void
    primary?: boolean
    route?: string
}

export interface NotificationOptions {
    message: string
    type?: NotificationType
    timeout?: number
    position?: NotificationPosition
    actions?: NotificationAction[]
}

export interface Notification extends NotificationOptions {
    id: number
}
