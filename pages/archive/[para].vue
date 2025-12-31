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
                        {{ archive?.title }}
                    </h1>
                    <div
                        class="mb-2 flex items-center gap-2 text-xs text-(--md-sys-color-on-surface-variant) sm:text-sm"
                    >
                        <div v-if="archive.publisher" class="flex items-center">
                            {{ archive.publisher }}
                        </div>
                        <div class="flex items-center">
                            {{ new Date(archive.createdAt).toLocaleString() }}
                        </div>
                    </div>
                    <div
                        v-if="archive.tags?.tags?.length"
                        class="mb-6 flex flex-wrap justify-center gap-2"
                    >
                        <TagList :tags="archive.tags.tags"></TagList>
                    </div>
                    <hr class="mb-6 border-(--md-sys-color-outline-variant)" />
                </header>
                <div
                    class="mt-1 box-border flex max-w-screen flex-col lg:flex-row"
                >
                    <!-- 文章内容 -->
                    <MarkdownRender
                        ref="markdownRender"
                        :content="archive.content"
                        @toc-updated="handleTocUpdate"
                        class="box-border flex-1 overflow-hidden"
                    >
                    </MarkdownRender>
                </div>
            </article>
        </div>
    </main>
</template>

<script lang="ts" setup>
import MarkdownRender from "~/components/MarkdownRender.vue";
import MarkdownTOC from "~/components/MarkdownTOC.vue";
import { computed, onMounted, ref, onUnmounted, watch } from "vue";
import { useRoute } from "#imports";
import type { ArchiveData } from "~/types/archives";
import type { TocItem } from "~/types/tocitems";
import { useApi } from "#imports";
import { useRightSidebar } from "@/composables/useRightSidebar";
import { usePageTitle } from "@/composables/usePageTitle";
import { useSidebarLayout } from "@/composables/useSidebarLayout";

const route = useRoute();
const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);

const { setHasContent, clearRightSidebar } = useRightSidebar();
const { registerCard, unregisterCard, setCardOptions } = useSidebarLayout();

const para = computed(() => route.params.para);
const { data: archive, loading, error, get } = useApi<ArchiveData>();
const pageTitle = computed(() => {
    return archive.value?.title
        ? `${archive.value.title} - 江西财经大学网络安全协会
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
const navTitleBox = useState("navTitleBox", () => ({
    title: "",
    subtitle: "",
}));
const { setPageTitle } = usePageTitle();
setPageTitle("");

onMounted(() => {
    get(`/archives/${para.value}`);

    // 注册归档阅读页右侧 TOC 卡片
    registerCard({
        id: "archive-toc",
        side: "right",
        order: 50,
        sticky: true,
        showOnMobileBottom: false,
        component: MarkdownTOC,
        props: {
            items: tocItems.value,
            markdownRenderRef: markdownRender.value,
        },
    });
});
watch(
    archive,
    (newVal) => {
        if (newVal) {
            navTitleBox.value = {
                title: newVal.title,
                subtitle: `${newVal.publisher || ""}   ${new Date(newVal.publishedAt).toLocaleString()}`,
            };
        }
    },
    { immediate: true },
);
// 离开页面时清除数据
onUnmounted(() => {
    clearRightSidebar();
    unregisterCard("archive-toc");
    navTitleBox.value = { title: "", subtitle: "" };
});
</script>

<style scoped></style>
