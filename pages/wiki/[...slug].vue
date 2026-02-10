<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-2"
    >
        <div class="box-border min-h-1/2">
            <div class="px-2" v-if="breadcrumbItems.length">
                <AnzuBreadcrumbs :items="breadcrumbItems" />
            </div>
            <div v-if="loading" class="flex h-1/2 items-center justify-center">
                <AnzuProgressRing :size="80" status="loading" />
            </div>
            <div v-if="showError" class="m-2 flex justify-center">
                <ErrorDisplay :error-data="error"></ErrorDisplay>
            </div>

            <!-- Content View -->
            <article
                v-if="content && !isFolderView"
                class="mb-2 box-border max-w-screen p-2"
            >
                <header class="mb-8">
                    <h1
                        class="mb-2 text-2xl leading-tight font-bold sm:text-3xl"
                    >
                        {{ content.data.title }}
                    </h1>
                    <div
                        class="mb-2 flex items-center gap-2 text-xs text-(--md-sys-color-on-surface-variant) sm:text-sm"
                    >
                        <div
                            v-if="content.data.publisher"
                            class="flex items-center"
                        >
                            {{ content.data.publisher }}
                        </div>
                    </div>
                    <div
                        v-if="content.tags?.length"
                        class="mb-6 flex flex-wrap justify-center gap-2"
                    >
                        <TagList
                            :tags="content.tags.map((t: any) => t.name)"
                        ></TagList>
                    </div>
                    <hr class="mb-6 border-(--md-sys-color-outline-variant)" />
                </header>
                <div
                    class="mt-1 box-border flex max-w-screen flex-col lg:flex-row"
                >
                    <MarkdownRender
                        v-if="content.data.body || content.data.content"
                        ref="markdownRender"
                        :content="
                            content.data.body || content.data.content || ''
                        "
                        @toc-updated="handleTocUpdate"
                        class="box-border flex-1"
                    >
                    </MarkdownRender>
                    <div
                        v-else
                        class="flex-1 py-10 text-center text-(--md-sys-color-on-surface-variant) italic"
                    >
                        {{ t("pages.wiki.content.empty") }}
                    </div>
                </div>

                <AnzuPrevNextNav
                    v-if="wikiPrev || wikiNext"
                    :prev="wikiPrev"
                    :next="wikiNext"
                />
            </article>

            <!-- Folder View -->
            <div
                v-else-if="isFolderView"
                class="mb-2 box-border max-w-screen p-2"
            >
                <div
                    v-if="isRoot"
                    class="mb-4 rounded-xl bg-(--md-sys-color-surface-container-low) p-4 shadow-center-sm"
                >
                    <WikiTree />
                </div>
                <div class="w-full mb-4">
                    <h1 class="text-3xl font-bold mb-2">
                        {{ folderPageTitle }}
                    </h1>
                </div>

                <div v-if="loadingTree" class="flex justify-center p-4">
                    <AnzuProgressRing :size="40" status="loading" />
                </div>

                <ul
                    v-else-if="treeNode && treeNode.children"
                    class="box-border w-full grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <li
                        v-for="child in treeNode.children"
                        :key="child.id"
                        class="block p-4 rounded-xl bg-(--md-sys-color-surface-container-low) hover:bg-(--md-sys-color-surface-container-high) transition-colors cursor-pointer border border-(--md-sys-color-outline-variant)/20"
                        @click="router.push(`/${child.path}`)"
                    >
                        <h2
                            class="text-xl font-semibold mb-2 flex items-center gap-2"
                        >
                            <FolderIcon
                                v-if="child.is_container"
                                class="w-5 h-5 text-(--md-sys-color-secondary)"
                            />
                            <DocumentTextIcon
                                v-else
                                class="w-5 h-5 text-(--md-sys-color-primary)"
                            />
                            {{ child.title }}
                        </h2>
                    </li>
                </ul>
                <div
                    v-else
                    class="text-center py-10 text-(--md-sys-color-on-surface-variant)"
                >
                    {{ t("pages.wiki.content.emptyFolder") }}
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import MarkdownRender from "~/components/MarkdownRender.vue";
import MarkdownTOC from "~/components/MarkdownTOC.vue";
import ErrorDisplay from "~/components/ErrorDisplay.vue";
import TagList from "~/components/TagList.vue";
import AnzuProgressRing from "~/components/AnzuProgressRing.vue";
import AnzuBreadcrumbs from "~/components/AnzuBreadcrumbs.vue";
import AnzuPrevNextNav from "~/components/AnzuPrevNextNav.vue";
import WikiTree from "~/components/sidebars/WikiTree.vue";
import { FolderIcon, DocumentTextIcon } from "@heroicons/vue/24/outline";

import { computed, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useRoute, useRouter } from "#imports";
import type { TocItem } from "~/types/tocitems";
import type { WikiTreeNode } from "~/types/wiki";
import { useApi } from "#imports";
import { useSidebarLayout } from "@/composables/useSidebarLayout";
import { useNavTitle } from "@/composables/useNavTitle";
import { usePageTitle } from "@/composables/usePageTitle";
import { useI18n } from "vue-i18n";

interface WikiData {
    id: string;
    data: {
        title: string;
        body?: string;
        content?: string;
        publisher?: string;
        is_container?: boolean;
        [key: string]: any;
    };
    tags?: any[];
    [key: string]: any;
}

const route = useRoute();
const router = useRouter();
const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);

const { registerCard, setCardOptions } = useSidebarLayout();
const { setTitle, setScrollReveal, reset: resetNavTitle } = useNavTitle();
const { setPageTitle: setSitePageTitle } = usePageTitle();
const { t } = useI18n();

const slug = computed(() => {
    if (Array.isArray(route.params.slug)) {
        return route.params.slug.join("/");
    }
    return route.params.slug || "";
});

const slugSegments = computed(() => {
    if (Array.isArray(route.params.slug)) {
        return route.params.slug;
    }
    return route.params.slug ? [route.params.slug] : [];
});

const isRoot = computed(() => !slug.value);

const treeRootPath = computed(() => {
    if (!slugSegments.value.length) {
        return "wiki";
    }
    return `wiki.${slugSegments.value.join(".")}`;
});

const contentPath = computed(() => {
    if (!slugSegments.value.length) {
        return "wiki";
    }
    return `wiki/${slugSegments.value.join("/")}`;
});

const { data: content, loading, error, get } = useApi<WikiData>();
const {
    data: treeNode,
    loading: loadingTree,
    error: treeError,
    get: getTree,
} = useApi<any>();
const { data: breadcrumbTree, get: getBreadcrumbTree } = useApi<WikiTreeNode>();

const isFolder = computed(() => treeNode.value?.is_container === true);
const isFolderView = computed(() => isFolder.value);

const pageTitle = computed(() => {
    return (
        content.value?.data?.title ||
        treeNode.value?.title ||
        t("pages.wiki.title")
    );
});

const folderPageTitle = computed(() => {
    return (
        content.value?.data?.title ||
        treeNode.value?.title ||
        slugSegments.value[slugSegments.value.length - 1] ||
        t("pages.wiki.title")
    );
});

const breadcrumbItems = computed(() => {
    const items = [{ text: t("nav.wiki"), to: "/wiki" }];
    if (!slugSegments.value.length) return items;

    const resolveSegmentTitle = (segments: string[]) => {
        let node = breadcrumbTree.value;
        for (const segment of segments) {
            if (!node?.children) return undefined;
            const next = node.children.find(
                (child: any) => child.slug === segment,
            );
            if (!next) return undefined;
            node = next;
        }
        return node?.title;
    };

    let currentPath = "/wiki";
    slugSegments.value.forEach((seg, index) => {
        currentPath += `/${seg}`;
        const isLast = index === slugSegments.value.length - 1;
        const segmentTitle = resolveSegmentTitle(
            slugSegments.value.slice(0, index + 1),
        );
        items.push({
            text: isLast ? folderPageTitle.value : segmentTitle || seg,
            to: currentPath,
        });
    });
    return items;
});

type PrevNextTarget = { to: string; title: string };

const resolveNodeBySegments = (
    root: WikiTreeNode | null | undefined,
    segments: string[],
) => {
    let node: WikiTreeNode | null | undefined = root;
    for (const segment of segments) {
        if (!node?.children) return null;
        const next = node.children.find((child) => child.slug === segment);
        if (!next) return null;
        node = next;
    }
    return node ?? null;
};

const wikiSiblingArticles = computed(() => {
    if (!breadcrumbTree.value) return [] as WikiTreeNode[];
    if (!slugSegments.value.length) return [] as WikiTreeNode[];

    const parentSegments = slugSegments.value.slice(0, -1);
    const parentNode = resolveNodeBySegments(
        breadcrumbTree.value,
        parentSegments,
    );
    const children = parentNode?.children ?? [];

    return children
        .filter((n) => n && n.is_container === false)
        .slice()
        .sort((a, b) => {
            if (a.order !== b.order) return a.order - b.order;
            const t = a.title.localeCompare(b.title);
            if (t !== 0) return t;
            return a.path.localeCompare(b.path);
        });
});

const wikiCurrentSiblingIndex = computed(() => {
    const currentSlug = slugSegments.value[slugSegments.value.length - 1];
    return wikiSiblingArticles.value.findIndex((n) => n.slug === currentSlug);
});

const wikiPrev = computed<PrevNextTarget | null>(() => {
    if (isFolderView.value) return null;
    const idx = wikiCurrentSiblingIndex.value;
    if (idx <= 0) return null;
    const item = wikiSiblingArticles.value[idx - 1];
    return item?.path
        ? { to: `/${item.path}`, title: item.title || item.slug }
        : null;
});

const wikiNext = computed<PrevNextTarget | null>(() => {
    if (isFolderView.value) return null;
    const idx = wikiCurrentSiblingIndex.value;
    if (idx === -1 || idx >= wikiSiblingArticles.value.length - 1) return null;
    const item = wikiSiblingArticles.value[idx + 1];
    return item?.path
        ? { to: `/${item.path}`, title: item.title || item.slug }
        : null;
});

const showError = computed(() => {
    if (isFolderView.value) {
        return !!treeError.value;
    }
    return !!error.value;
});

useHead(() => ({
    title: content.value?.data?.title
        ? `${pageTitle.value} - ${t("nav.wiki")}`
        : t("pages.wiki.meta.title"),
}));

function handleTocUpdate(items: TocItem[]) {
    tocItems.value = items;
    setCardOptions("wiki-toc", {
        props: {
            items,
            markdownRenderRef: markdownRender.value,
        },
    });
}

const registerWikiToc = () => {
    registerCard({
        id: "wiki-toc",
        side: "right",
        order: 10,
        sticky: true,
        showOnMobileBottom: false,
        showOnMobileDrawer: true,
        scope: "page",
        mutualGroup: "right-context",
        priority: 100,
        when: () => !!content.value && !isFolderView.value,
        component: MarkdownTOC,
        props: {
            items: tocItems.value,
            markdownRenderRef: markdownRender.value,
        },
    });
};

const fetchContent = async () => {
    if (!slug.value) return;
    await getBreadcrumbTree(
        `/v1/tree?root=wiki&depth=${slugSegments.value.length + 1}`,
    );
    await getTree(`/v1/tree?root=${treeRootPath.value}&depth=2`);
    if (treeNode.value?.is_container === true) {
        return;
    }
    await get(`/v1/contents/by-path/${contentPath.value}`);
};

const updateLayout = () => {
    if (isFolderView.value) {
        // Re-enable page title for folder views
        setSitePageTitle("pages.wiki.title");
    } else {
        registerWikiToc();
        // Hide Main Page Title when reading content (User Request)
        setSitePageTitle("");
    }
};

onMounted(async () => {
    setScrollReveal(true);

    await fetchContent();
    updateLayout();
});

watch([content, treeNode], () => {
    if (content.value || treeNode.value) {
        setTitle(pageTitle.value, t("nav.wiki"));
        updateLayout();
    }
});

watch(treeRootPath, async () => {
    // Reset state on nav
    setSitePageTitle("pages.wiki.title");
    await fetchContent();
    updateLayout();
});

onBeforeRouteLeave((to, from, next) => {
    resetNavTitle();
    next();
});
</script>
