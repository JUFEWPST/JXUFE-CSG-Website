import type { Notice } from "~/types/notice";
import { useApi } from '~/composables/useapi'
import { useNotification } from "~/composables/useNotification";
import type {
    NotificationType,
} from '@/types/notification'
const { data: notices, get } = useApi<Notice[]>()
const { notify } = useNotification()
export const useFetchNotice = async () => {
    const { t } = useI18n()
    try {
        await get('/notices')
        notices.value?.forEach(notice => {
            notify({
                message: notice.text,       
                type: notice.type as NotificationType,
                timeout: notice.timeout * 1000,
                actions: notice.route ? [{
                    text: t("common.actions.viewDetail"),
                    route: notice.route,
                    primary: true
                }] : undefined
            })
        })
    } catch (err) {
        console.error('Notices请求失败:', err)
    }
}