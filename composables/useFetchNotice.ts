import type { Notice } from "~/types/notice";
import { useApi } from '#imports'
import { useNotification } from "#imports";
import type {
    NotificationType,
} from '@/types/notification'
const { data: notices, get } = useApi<Notice[]>()
const { notify } = useNotification()
export const useFetchNotice = async () => {
    try {
        await get('/notices')
        notices.value?.forEach(notice => {
            notify({
                message: notice.text,       
                type: notice.type as NotificationType,
                timeout: notice.timeout * 1000,
                actions: notice.route ? [{
                    text: '查看详情',
                    route: notice.route,
                    primary: true
                }] : undefined
            })
        })
    } catch (err) {
        console.error('Notices请求失败:', err)
    }
}