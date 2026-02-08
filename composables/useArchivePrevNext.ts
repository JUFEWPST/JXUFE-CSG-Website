import { computed, onMounted, type Ref } from "vue";
import { useApi } from "#imports";

type ArchiveIndexItem = {
    id: string;
    title: string;
    slug: string;
    path: string;
    data?: {
        publish_time?: string;
    };
};

export type PrevNextTarget = {
    to: string;
    title: string;
};

type ArchiveIndexState = {
    items: ArchiveIndexItem[] | null;
    loaded: boolean;
    loading: boolean;
    error: string | null;
};

const ARCHIVE_INDEX_STATE_KEY = "archive-index:publish-time-desc:v1";
const PAGE_SIZE = 100;

let inflight: Promise<void> | null = null;

const parsePublishTime = (value: unknown): number => {
    if (typeof value !== "string") return 0;
    const t = Date.parse(value);
    return Number.isFinite(t) ? t : 0;
};

const sortByPublishTimeDesc = (a: ArchiveIndexItem, b: ArchiveIndexItem) => {
    const tA = parsePublishTime(a.data?.publish_time);
    const tB = parsePublishTime(b.data?.publish_time);

    // publish_time desc
    if (tA !== tB) return tB - tA;

    // tie-breaker：slug asc（保证稳定）
    return String(a.slug || "").localeCompare(String(b.slug || ""));
};

export function useArchivePrevNext(currentSlug: Ref<string>) {
    const state = useState<ArchiveIndexState>(ARCHIVE_INDEX_STATE_KEY, () => ({
        items: null,
        loaded: false,
        loading: false,
        error: null,
    }));

    const { data, meta, get, error: apiError } = useApi<ArchiveIndexItem[]>();

    const loadIndex = async () => {
        if (state.value.loaded) return;
        if (state.value.loading && inflight) return inflight;

        inflight = (async () => {
            state.value.loading = true;
            state.value.error = null;

            try {
                const all: ArchiveIndexItem[] = [];

                await get(
                    `/v1/contents?type_slug=archive&fields=publish_time&page=1&page_size=${PAGE_SIZE}`,
                );

                if (apiError.value) {
                    const msg = (apiError.value as any)?.message;
                    throw new Error(typeof msg === "string" ? msg : "ApiError");
                }

                if (Array.isArray(data.value)) {
                    all.push(...data.value);
                }

                const totalPages = meta.value?.total_pages ?? 1;
                for (let page = 2; page <= totalPages; page += 1) {
                    await get(
                        `/v1/contents?type_slug=archive&fields=publish_time&page=${page}&page_size=${PAGE_SIZE}`,
                    );

                    if (apiError.value) {
                        const msg = (apiError.value as any)?.message;
                        throw new Error(typeof msg === "string" ? msg : "ApiError");
                    }
                    if (Array.isArray(data.value)) {
                        all.push(...data.value);
                    }
                }

                // 去重：按 slug
                const bySlug = new Map<string, ArchiveIndexItem>();
                for (const item of all) {
                    const slug = String(item?.slug ?? "");
                    if (!slug) continue;
                    const existing = bySlug.get(slug);
                    if (!existing) {
                        bySlug.set(slug, item);
                        continue;
                    }
                    // 如果重复，保留 publish_time 更晚的那条
                    const keep =
                        parsePublishTime(item.data?.publish_time) >=
                        parsePublishTime(existing.data?.publish_time);
                    if (keep) bySlug.set(slug, item);
                }

                const items = Array.from(bySlug.values()).sort(sortByPublishTimeDesc);
                state.value.items = items;
                state.value.loaded = true;
            } catch (e) {
                const msg =
                    (e instanceof Error && e.message) ||
                    ((apiError.value as any)?.message as string | undefined) ||
                    "Failed to load archive index";
                state.value.error = msg;
                state.value.items = null;
                state.value.loaded = false;
            } finally {
                state.value.loading = false;
            }
        })().finally(() => {
            inflight = null;
        });

        return inflight;
    };

    onMounted(() => {
        void loadIndex();
    });

    const items = computed(() => state.value.items ?? []);
    const currentIndex = computed(() =>
        items.value.findIndex((i) => String(i.slug) === String(currentSlug.value)),
    );

    const prev = computed<PrevNextTarget | null>(() => {
        const idx = currentIndex.value;
        if (idx <= 0) return null;
        const item = items.value[idx - 1];
        if (!item?.path) return null;
        return {
            to: `/${item.path}`,
            title: item.title || item.slug,
        };
    });

    const next = computed<PrevNextTarget | null>(() => {
        const idx = currentIndex.value;
        if (idx === -1 || idx >= items.value.length - 1) return null;
        const item = items.value[idx + 1];
        if (!item?.path) return null;
        return {
            to: `/${item.path}`,
            title: item.title || item.slug,
        };
    });

    return {
        prev,
        next,
        loading: computed(() => state.value.loading),
        error: computed(() => state.value.error),
        ensureLoaded: loadIndex,
    };
}

