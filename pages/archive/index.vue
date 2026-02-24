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
                @page-change="handlePageChange"
            >
            </AnzuPagination>
        </div>
    </main>
</template>

<script setup lang="ts">
import AnzuPagination from "~/components/AnzuPagination.vue";
import ArticleBlock from "~/components/ArticleBlock.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "#imports";
import { useApi } from "~/composables/useapi";
import type { Archive } from "~/types/archives";
import { usePageTitle } from "@/composables/usePageTitle";
const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.archive.title");

useHead(() => ({
    title: t("pages.archive.meta.title"),
    meta: [
        { name: "description", content: t("pages.archive.meta.description") },
        { name: "keywords", content: t("pages.archive.meta.keywords") },
    ],
}));

const route = useRoute();
const router = useRouter();
const {
    data: archives,
    meta,
    loading,
    error,
    get: getArchives,
} = useApi<Archive[]>();
const { data: topArchives, get: getTopArchives } = useApi<Archive[]>();
const currentPage = ref(1);
const totalPages = ref(1);

const loadArchives = async (page: number = 1) => {
    await getArchives(
        `/v1/contents?type_slug=archive&fields=publish_time&sort_order=desc&page=${page}`,
    );
    if (archives.value) {
        if (meta.value) {
            totalPages.value = meta.value.total_pages;
            currentPage.value = meta.value.current_page;
        }
    } else {
        console.error("加载失败", error.value);
    }
};

const loadTopArchives = async () => {
    getTopArchives(
        "/v1/contents?type_slug=archive&fields=publish_time&filter[is_top][eq]=true",
    );
};
loadTopArchives();
watch(
    () => route.query.page,
    (newPage) => {
        const pageNum = parseInt(newPage as string) || 1;
        currentPage.value = pageNum;
        loadArchives(pageNum);
    },
    { immediate: true },
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
</script>
