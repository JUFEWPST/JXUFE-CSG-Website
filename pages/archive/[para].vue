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
                        {{ archive?.data?.title || archive?.title }}
                    </h1>
                    <div
                        class="mb-2 flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-(--md-sys-color-on-surface-variant) sm:text-sm"
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
                                        value: lang,
                                        label: getLangName(lang),
                                    }))
                                "
                            />
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
                        class="box-border flex-1"
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
import {
    fetchCmsData,
    normalizeApiError,
    type ApiMeta,
} from "~/composables/useapi";
import { useArchivePrevNext } from "~/composables/useArchivePrevNext";
import { useRightSidebar } from "@/composables/useRightSidebar";
import { usePageTitle } from "@/composables/usePageTitle";
import { useNavTitle } from "@/composables/useNavTitle";
import { useSidebarLayout } from "@/composables/useSidebarLayout";
import { LanguageIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "vue-i18n";

const route = useRoute();
const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);

const { t, locale } = useI18n();

// Bot-only metadata SSR（结构化数据）；正文对所有用户走下方 useAsyncData。
await useBotMeta(
    () =>
        `/v1/contents/by-path/archive/${route.params.para}?i18n=${getApiLocale(locale.value)}`,
    {
        schema: "Article",
        type: "article",
        locale: locale.value,
        titleFormatter: (title) =>
            `${title} - ${t("meta.fullName")} ${t("nav.archive")}`,
    },
);

const { setHasContent, clearRightSidebar } = useRightSidebar();
const { registerCard, setCardOptions } = useSidebarLayout();
const { setTitle, setScrollReveal, reset: resetNavTitle } = useNavTitle();

const para = computed(() => route.params.para);
const currentContentLang = ref(getApiLocale(locale.value));

const {
    data: archivePayload,
    pending: loading,
    error: asyncError,
} = await useAsyncData(
    () =>
        `archive-detail-${String(para.value ?? "")}-${currentContentLang.value}`,
    async () => {
        const slug = para.value;
        if (!slug) return null;
        const result = await fetchCmsData<ArchiveData>(
            `/v1/contents/by-path/archive/${slug}?i18n=${currentContentLang.value}`,
        );
        return result;
    },
    {
        watch: [para, currentContentLang],
    },
);

const archive = computed(() => archivePayload.value?.data ?? null);
const meta = computed(() => archivePayload.value?.meta as ApiMeta | undefined);
const i18nFallback = computed(() => meta.value?.i18n);
const error = computed(() =>
    asyncError.value ? normalizeApiError(asyncError.value) : null,
);

const currentSlug = computed(() => String(para.value ?? ""));
const { prev: archivePrev, next: archiveNext } =
    useArchivePrevNext(currentSlug);

const { setPageTitle } = usePageTitle();

function handleTocUpdate(items: TocItem[]) {
    tocItems.value = items;
    setHasContent(items.length > 0);

    setCardOptions("archive-toc", {
        props: {
            items,
            markdownRenderRef: markdownRender.value,
        },
    });
}

watch(
    () => archive.value,
    (newArchive) => {
        if (newArchive) {
            const title = newArchive.data?.title || newArchive.title;
            if (title) {
                setPageTitle("", title, "nav.archive");
            }
        }
    },
    { immediate: true },
);

watch(locale, (newLocale) => {
    currentContentLang.value = getApiLocale(newLocale);
});

onMounted(() => {
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

onUnmounted(() => {
    clearRightSidebar();
    resetNavTitle();
});
</script>

<style scoped></style>
