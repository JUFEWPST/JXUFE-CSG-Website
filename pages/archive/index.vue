<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-2"
    >
        <div class="flex flex-col items-center justify-center">
            <div v-if="loading" class="py-8 text-center">
                <AnzuProgressRing :size="80" status="loading" />
            </div>
            <div v-else-if="error">
                <ErrorDisplay :errorData="error"></ErrorDisplay>
            </div>
            <template v-else>
                <ul class="box-border w-full p-2">
                    <ArticleBlock
                        v-for="archive in topArchives"
                        :key="archive.id"
                        :title="archive.title"
                        :linkto="`/archive/${archive.slug}`"
                        :datetime="
                            new Date(archive.data.publish_time).toLocaleString()
                        "
                        :tags="archive.tags?.map((t) => t.name) || []"
                        :istop="true"
                    >
                    </ArticleBlock>
                </ul>
                <hr
                    class="mx-auto box-border w-4/5 border-t-2 border-(--md-sys-color-secondary-container) p-2 transition-colors duration-300 hover:border-(--md-sys-color-primary) md:w-2/5"
                />
                <ul class="box-border w-full p-2">
                    <ArticleBlock
                        v-for="archive in archives"
                        :key="archive.id"
                        :title="archive.title"
                        :linkto="`/archive/${archive.slug}`"
                        :datetime="
                            new Date(archive.data.publish_time).toLocaleString()
                        "
                        :tags="archive.tags?.map((t) => t.name) || []"
                    >
                    </ArticleBlock>
                </ul>
            </template>
            <AnzuPagination
                v-if="totalPages >= 1"
                :totalPages="totalPages"
                :currentPage="currentPage"
                :loading="loading"
                @page-change="handlePageChange"
            />
        </div>
    </main>
</template>

<script setup lang="ts">
import AnzuPagination from "~/components/AnzuPagination.vue";
import ArticleBlock from "~/components/ArticleBlock.vue";
import { computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "#imports";
import { fetchCmsData, normalizeApiError } from "~/composables/useapi";
import type { Archive } from "~/types/archives";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

await useBotMeta(
    () => {
        const page = route.query.page || 1;
        return `/v1/contents?type_slug=archive&fields=publish_time&sort_order=desc&page=${page}`;
    },
    {
        schema: "CollectionPage",
        type: "website",
        locale: locale.value,
        titleFormatter: (title) =>
            `${t("pages.archive.title")} - ${t("meta.fullName")}`,
    },
);

usePageMeta({
    titleKey: "pages.archive.title",
    descriptionKey: "pages.archive.meta.description",
    suffixKey: "nav.archive",
    keywords: t("pages.archive.meta.keywords"),
    canonicalPath: "/archive",
});

const pageFromRoute = computed(() => {
    const raw = route.query.page;
    const pageNum = parseInt(String(Array.isArray(raw) ? raw[0] : raw) || "1", 10);
    return Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
});

const {
    data: listPayload,
    pending: loading,
    error: asyncError,
} = await useAsyncData(
    "archive-list",
    async () => {
        const page = pageFromRoute.value;
        const [list, top] = await Promise.all([
            fetchCmsData<Archive[]>(
                `/v1/contents?type_slug=archive&fields=publish_time&sort_order=desc&page=${page}`,
            ),
            fetchCmsData<Archive[]>(
                "/v1/contents?type_slug=archive&fields=publish_time&filter[is_top][eq]=true",
            ),
        ]);
        return {
            archives: list.data,
            meta: list.meta,
            topArchives: top.data,
        };
    },
    {
        watch: [pageFromRoute],
    },
);

const archives = computed(() => listPayload.value?.archives ?? null);
const topArchives = computed(() => listPayload.value?.topArchives ?? null);
const currentPage = computed(
    () => listPayload.value?.meta?.current_page || pageFromRoute.value,
);
const totalPages = computed(() => listPayload.value?.meta?.total_pages || 1);
const error = computed(() =>
    asyncError.value ? normalizeApiError(asyncError.value) : null,
);

const handlePageChange = (page: number) => {
    if (page === currentPage.value) return;
    router.push({
        query: {
            ...route.query,
            page: page > 1 ? page : undefined,
        },
    });
};

// 分页切换后滚到顶部（仅客户端）
watch(pageFromRoute, () => {
    if (!import.meta.client) return;
    nextTick(() => {
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
});
</script>
