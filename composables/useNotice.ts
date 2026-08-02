import { nextTick } from "vue";
import type { Notice, NoticeData } from "~/types/notice";
import { useApi } from "~/composables/useapi";
import { useNotification } from "~/composables/useNotification";
import { NotificationType } from "~/types/notification";

const NOTICE_TOASTED_KEY = "init-notice";

export const useNotice = () => {
    const notices = useState<NoticeData[]>("notice:list", () => []);
    const loaded = useState<boolean>("notice:loaded", () => false);
    const loading = useState<boolean>("notice:loading", () => false);
    const error = useState<string | null>("notice:error", () => null);

    const { notify } = useNotification();
    const { t } = useI18n();

    const fetch = async (force = false) => {
        if (loaded.value && !force) return;
        if (loading.value) return;

        loading.value = true;
        error.value = null;
        try {
            const { data: list, get } = useApi<Notice[]>();
            await get("/v1/contents?type_slug=notice");
            const raw = list.value ?? [];

            const details = await Promise.all(
                raw.map(async (notice) => {
                    const { data: detailData, get: getDetail } = useApi<any>();
                    await getDetail(`/v1/contents/${notice.id}`);
                    return (detailData.value?.data ??
                        null) as NoticeData | null;
                }),
            );

            notices.value = details.filter(Boolean) as NoticeData[];
            loaded.value = true;

            if (
                typeof window !== "undefined" &&
                !sessionStorage.getItem(NOTICE_TOASTED_KEY)
            ) {
                sessionStorage.setItem(NOTICE_TOASTED_KEY, "1");
                await nextTick();
                notices.value.forEach((notice) => {
                    notify({
                        message: notice.title,
                        type:
                            (notice.type as NotificationType) ||
                            NotificationType.INFO,
                        timeout: notice.timeout * 1000,
                        actions: notice.route
                            ? [
                                  {
                                      text: t("common.actions.viewDetail"),
                                      route: notice.route,
                                      primary: true,
                                  },
                              ]
                            : undefined,
                    });
                });
            }
        } catch (err) {
            error.value = (err as Error)?.message ?? "Failed to load notices";
            console.error("Notices请求失败:", err);
        } finally {
            loading.value = false;
        }
    };

    return { notices, loaded, loading, error, fetch };
};
