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
        await get('/v1/contents?type_slug=notice')
        const list = notices.value ?? []
        await Promise.all(
            list.map(async (notice) => {
                // 获取详细信息
                const { data: detailData, get: getDetail } = useApi<any>()
                await getDetail(`/v1/contents/${notice.id}`)
                const noticeDetail = detailData.value?.data

                if (noticeDetail) {
                    notify({
                        message: noticeDetail.title,
                        type: (noticeDetail.type as NotificationType) || 'info',
                        timeout: noticeDetail.timeout * 1000,
                        actions: noticeDetail.route ? [{
                            text: t("common.actions.viewDetail"),
                            route: noticeDetail.route,
                            primary: true
                        }] : undefined
                    })
                }
            }),
        )
    } catch (err) {
        console.error('Notices请求失败:', err)
    }
}