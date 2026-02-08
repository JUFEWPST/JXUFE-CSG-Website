<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-2"
    >
        <div class="box-border min-h-1/2">
            <div v-if="loading" class="flex h-1/2 items-center justify-center">
                <AnzuProgressRing :size="80" status="loading" />
            </div>
            <div v-if="error" class="m-2 flex justify-center">
                <ErrorDisplay :error-data="error"></ErrorDisplay>
            </div>
            <article v-if="archive" class="mb-2 box-border max-w-screen p-2">
                <header class="mb-8">
                    <h1
                        class="mb-2 text-2xl leading-tight font-bold sm:text-3xl"
                    >
                        {{ archive?.data?.title || archive?.title }}
                    </h1>
                    <div
                        class="mb-2 flex items-center gap-2 text-xs text-(--md-sys-color-on-surface-variant) sm:text-sm"
                    >
                        <div
                            v-if="archive.data.publisher"
                            class="flex items-center"
                        >
                            {{ archive.data.publisher }}
                        </div>
                        <div class="flex items-center">
                            {{
                                new Date(
                                    archive.data.publish_time,
                                ).toLocaleString()
                            }}
                        </div>
                    </div>
                    <div
                        v-if="archive.tags?.length"
                        class="mb-6 flex flex-wrap justify-center gap-2"
                    >
                        <TagList
                            :tags="archive.tags.map((t) => t.name)"
                        ></TagList>
                    </div>
                    <hr class="mb-6 border-(--md-sys-color-outline-variant)" />
                </header>
                <div
                    class="mt-1 box-border flex max-w-screen flex-col lg:flex-row"
                >
                    <!-- 文章内容 -->
                    <MarkdownRender
                        ref="markdownRender"
                        :content="archive.data.body ?? ''"
                        @toc-updated="handleTocUpdate"
                        class="box-border flex-1 overflow-hidden"
                    >
                    </MarkdownRender>
                </div>

                <AnzuPrevNextNav
                    v-if="archivePrev || archiveNext"
                    :prev="archivePrev"
                    :next="archiveNext"
                />
            </article>
        </div>
    </main>
</template>

<script lang="ts" setup>
import MarkdownRender from "~/components/MarkdownRender.vue";
import MarkdownTOC from "~/components/MarkdownTOC.vue";
import AnzuPrevNextNav from "~/components/AnzuPrevNextNav.vue";
import { computed, onMounted, ref, onUnmounted, watch } from "vue";
import { useRoute } from "#imports";
import type { ArchiveData } from "~/types/archives";
import type { TocItem } from "~/types/tocitems";
import { useApi } from "#imports";
import { useArchivePrevNext } from "~/composables/useArchivePrevNext";
import { useRightSidebar } from "@/composables/useRightSidebar";
import { usePageTitle } from "@/composables/usePageTitle";
import { useNavTitle } from "@/composables/useNavTitle";
import { useSidebarLayout } from "@/composables/useSidebarLayout";

const route = useRoute();
const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);

const { setHasContent, clearRightSidebar } = useRightSidebar();
const { registerCard, setCardOptions } = useSidebarLayout();
const { setTitle, setScrollReveal, reset: resetNavTitle } = useNavTitle();

const para = computed(() => route.params.para);
const { data: archive, loading, error, get } = useApi<ArchiveData>();

const currentSlug = computed(() => String(para.value ?? ""));
const { prev: archivePrev, next: archiveNext } = useArchivePrevNext(currentSlug);

const pageTitle = computed(() => {
    const title = archive.value?.data?.title || archive.value?.title;
    return title
        ? `${title} - 江西财经大学网络安全协会
  `
        : "加载中...";
});
function handleTocUpdate(items: TocItem[]) {
    tocItems.value = items;
    setHasContent(items.length > 0);

    // 更新 TOC 侧边卡片的 props，保证目录跟随最新内容
    setCardOptions("archive-toc", {
        props: {
            items,
            markdownRenderRef: markdownRender.value,
        },
    });
}
useHead({
    title: pageTitle,
});
const { setPageTitle } = usePageTitle();
setPageTitle("");

onMounted(() => {
    get(`/v1/contents/by-path/archive/${para.value}`);
    setScrollReveal(true);
});

const registerArchiveToc = () => {
    registerCard({
        id: "archive-toc",
        side: "right",
        order: 50,
        sticky: true,
        showOnMobileBottom: false,
        showOnMobileDrawer: true,
        scope: "page",
        mutualGroup: "right-context",
        priority: 100,
        component: MarkdownTOC,
        props: {
            items: tocItems.value,
            markdownRenderRef: markdownRender.value,
        },
    });
};

watch(
    () => route.fullPath,
    () => {
        registerArchiveToc();
    },
    { immediate: true },
);
watch(
    archive,
    (newVal) => {
        if (newVal) {
            setTitle(
                newVal.data?.title || newVal.title,
                `${newVal.data.publisher || ""}   ${new Date(newVal.data.publish_time).toLocaleString()}`,
            );
        }
    },
    { immediate: true },
);
// 离开页面时清除数据
onUnmounted(() => {
    clearRightSidebar();
    resetNavTitle();
});
</script>

<style scoped></style>
