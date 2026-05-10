<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-2"
    >
        <div class="box-border min-h-1/2">
            <div class="px-2" v-if="breadcrumbItems.length">
                <AnzuBreadcrumbs :items="breadcrumbItems" />
            </div>
            <div
                v-if="isPageLoading"
                class="flex h-1/2 items-center justify-center"
            >
                <AnzuProgressRing :size="80" status="loading" />
            </div>
            <div v-else-if="showError" class="m-2 flex justify-center">
                <ErrorDisplay :error-data="currentPageError"></ErrorDisplay>
            </div>

            <!-- Content View -->
            <article
                v-else-if="content && !isFolderView"
                class="mb-2 box-border max-w-screen p-2"
            >
                <header class="mb-8">
                    <div
                        v-if="
                            i18nFallback?.fallback && i18nFallback.fallback_to
                        "
                        class="mb-6 flex items-center rounded-xl bg-(--md-sys-color-error-container) px-4 py-3 text-sm text-(--md-sys-color-on-error-container)"
                    >
                        <LanguageIcon class="mr-2 h-5 w-5" aria-hidden="true" />
                        {{
                            t("pages.archive.fallback", {
                                lang: getLangName(i18nFallback.fallback_to),
                            })
                        }}
                    </div>
                    <h1
                        class="mb-2 text-2xl leading-tight font-bold sm:text-3xl"
                    >
                        {{ content.data.title }}
                    </h1>
                    <div
                        class="mb-2 flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-(--md-sys-color-on-surface-variant) sm:text-sm"
                    >
                        <div
                            v-if="content.data.publisher"
                            class="flex items-center"
                        >
                            {{ content.data.publisher }}
                        </div>
                        <div
                            v-if="
                                i18nFallback?.available &&
                                i18nFallback.available.length > 0
                            "
                            class="flex items-center gap-1.5"
                        >
                            <LanguageIcon
                                class="h-4 w-4 text-(--md-sys-color-primary)"
                                aria-hidden="true"
                            />
                            <AnzuSelector
                                v-model="currentContentLang"
                                :options="
                                    i18nFallback.available.map((lang) => ({
                                        label: getLangName(lang),
                                        value: lang,
                                    }))
                                "
                            />
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

                <ul
                    v-if="treeNode && treeNode.children"
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
                            <NuxtLink
                                :to="`/${child.path}`"
                                class="hover:underline"
                            >
                                {{ child.title }}
                            </NuxtLink>
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
import AnzuSelector from "~/components/AnzuSelector.vue";
import WikiTree from "~/components/sidebars/WikiTree.vue";
import {
    FolderIcon,
    DocumentTextIcon,
    LanguageIcon,
} from "@heroicons/vue/24/outline";

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
const pageLoading = ref(false);
let fetchSequence = 0;

const { registerCard, setCardOptions } = useSidebarLayout();
const { setTitle, setScrollReveal, reset: resetNavTitle } = useNavTitle();
const { setPageTitle: setSitePageTitle } = usePageTitle();
const { t, locale } = useI18n();

await useBotMeta(
    () => {
        const slugParam = route.params.slug;
        const segs = Array.isArray(slugParam)
            ? slugParam
            : slugParam
              ? [slugParam as string]
              : [];

        if (!segs.length) {
            return (
                "/v1/contents/by-path/wiki?i18n=" + getApiLocale(locale.value)
            );
        }

        return `/v1/contents/by-path/wiki/${segs.join("/")}?i18n=${getApiLocale(locale.value)}`;
    },
    {
        schema: "TechArticle",
        type: "article",
        locale: locale.value,
        titleFormatter: (title) =>
            title
                ? `${title} - ${t("meta.fullName")} ${t("nav.wiki")}`
                : `${t("nav.wiki")} - ${t("meta.fullName")}`,
    },
);

const slug = computed(() => {
    if (Array.isArray(route.params.slug)) {
        return route.params.slug.join("/");
    }
    return route.params.slug || "";
});

const currentContentLang = ref(getApiLocale(locale.value));

watch(locale, (newLocale) => {
    currentContentLang.value = getApiLocale(newLocale);
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

const firstLevelRootPath = computed(() => {
    const first = slugSegments.value[0];
    return first ? `wiki.${first}` : "wiki";
});

const currentWikiContentPath = computed(() => {
    if (!slugSegments.value.length) return "";
    return `wiki/${slugSegments.value.join("/")}`;
});

const contentPath = computed(() => {
    if (!slugSegments.value.length) {
        return "wiki";
    }
    return `wiki/${slugSegments.value.join("/")}`;
});

const { data: content, loading, error, get, meta } = useApi<WikiData>();
const i18nFallback = computed(() => meta.value?.i18n);
const {
    data: treeNode,
    loading: loadingTree,
    error: treeError,
    get: getTree,
} = useApi<any>();
const {
    data: breadcrumbTree,
    loading: loadingBreadcrumbTree,
    error: breadcrumbTreeError,
    get: getBreadcrumbTree,
} = useApi<WikiTreeNode>();
const {
    data: sectionTree,
    loading: loadingSectionTree,
    error: sectionTreeError,
    get: getSectionTree,
} = useApi<WikiTreeNode>();

const isFolder = computed(() => treeNode.value?.is_container === true);
const isFolderView = computed(() => isFolder.value);
const isResolvingWikiPage = computed(
    () =>
        loadingBreadcrumbTree.value ||
        loadingSectionTree.value ||
        loadingTree.value,
);
const isPageLoading = computed(
    () => pageLoading.value || isResolvingWikiPage.value,
);

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

const sortWikiNodes = (nodes: WikiTreeNode[]) => {
    return nodes.slice().sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        const t = a.title.localeCompare(b.title);
        if (t !== 0) return t;
        return a.path.localeCompare(b.path);
    });
};

const flattenArticleNodes = (node: WikiTreeNode | null | undefined) => {
    if (!node) return [] as WikiTreeNode[];

    const result: WikiTreeNode[] = [];
    const walk = (current: WikiTreeNode) => {
        if (!current.is_container) {
            result.push(current);
            return;
        }
        const children = sortWikiNodes(current.children ?? []);
        children.forEach((child) => walk(child));
    };

    walk(node);
    return result;
};

const wikiSectionArticles = computed(() => {
    if (!slugSegments.value.length) return [] as WikiTreeNode[];
    return flattenArticleNodes(sectionTree.value);
});

const wikiCurrentSectionIndex = computed(() => {
    const currentPath = currentWikiContentPath.value;
    if (!currentPath) return -1;
    return wikiSectionArticles.value.findIndex((n) => n.path === currentPath);
});

const wikiPrev = computed<PrevNextTarget | null>(() => {
    if (isFolderView.value) return null;
    const idx = wikiCurrentSectionIndex.value;
    if (idx <= 0) return null;
    const item = wikiSectionArticles.value[idx - 1];
    return item?.path
        ? { to: `/${item.path}`, title: item.title || item.slug }
        : null;
});

const wikiNext = computed<PrevNextTarget | null>(() => {
    if (isFolderView.value) return null;
    const idx = wikiCurrentSectionIndex.value;
    if (idx === -1 || idx >= wikiSectionArticles.value.length - 1) return null;
    const item = wikiSectionArticles.value[idx + 1];
    return item?.path
        ? { to: `/${item.path}`, title: item.title || item.slug }
        : null;
});

const currentPageError = computed(
    () =>
        breadcrumbTreeError.value ||
        sectionTreeError.value ||
        treeError.value ||
        error.value,
);
const showError = computed(
    () => !isPageLoading.value && !!currentPageError.value,
);

watch(
    [() => content.value, () => treeNode.value, () => locale.value],
    () => {
        const title =
            content.value?.data?.title ||
            treeNode.value?.title ||
            t("pages.wiki.title");
        setSitePageTitle("", title, "nav.wiki");
    },
    { immediate: true },
);

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
        scope: "route",
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

watch(
    () => route.fullPath,
    () => {
        registerWikiToc();
    },
    { immediate: true },
);

const fetchContent = async () => {
    if (!slug.value) return;
    fetchSequence += 1;
    const currentFetch = fetchSequence;
    pageLoading.value = true;

    try {
        await getBreadcrumbTree(
            `/v1/tree?root=wiki&depth=${slugSegments.value.length + 1}&i18n=${currentContentLang.value}`,
        );
        await getSectionTree(
            `/v1/tree?root=${firstLevelRootPath.value}&i18n=${currentContentLang.value}`,
        );
        await getTree(
            `/v1/tree?root=${treeRootPath.value}&depth=2&i18n=${currentContentLang.value}`,
        );
        if (treeNode.value?.is_container === true) {
            return;
        }
        await get(
            `/v1/contents/by-path/${contentPath.value}?i18n=${currentContentLang.value}`,
        );
    } finally {
        if (currentFetch === fetchSequence) {
            pageLoading.value = false;
        }
    }
};

const updateLayout = () => {
    if (isFolderView.value) {
        setSitePageTitle("", pageTitle.value, "nav.wiki");
    } else {
        registerWikiToc();
        setSitePageTitle("", pageTitle.value, "nav.wiki");
    }
};

onMounted(async () => {
    setScrollReveal(true);

    await fetchContent();
    updateLayout();
});

watch(currentContentLang, async () => {
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
