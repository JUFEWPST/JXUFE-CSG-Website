<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="space-y-10 sm:space-y-12">
            <section ref="aboutRef" class="space-y-5">
                <h3
                    class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                >
                    {{ t("pages.home.aboutUs.title") }}
                </h3>

                <div
                    class="space-y-3 text-pretty text-(--md-sys-color-on-surface)"
                >
                    <p class="text-sm leading-relaxed sm:text-base md:text-lg">
                        <i18n-t keypath="pages.about.index.intro.p1" tag="span">
                            <template #default>
                                <span
                                    class="font-bold text-(--md-sys-color-primary)"
                                >
                                    {{ t("meta.fullName") }}
                                </span>
                            </template>
                        </i18n-t>
                    </p>
                    <p class="text-sm leading-relaxed sm:text-base md:text-lg">
                        <i18n-t keypath="pages.about.index.intro.p2" tag="span">
                            <template #highlighted>
                                <span
                                    class="font-bold text-(--md-sys-color-primary)"
                                >
                                    {{
                                        t(
                                            "pages.about.index.intro.highlightedText",
                                        )
                                    }}
                                </span>
                            </template>
                        </i18n-t>
                    </p>
                    <div
                        class="mt-8 border-l-2 border-(--md-sys-color-outline-variant) pl-4"
                    >
                        <h4
                            class="mb-3 text-sm font-semibold tracking-wide text-(--md-sys-color-on-surface) sm:text-base"
                        >
                            {{ t("pages.home.participate.title") }}
                        </h4>
                        <div class="flex flex-wrap gap-2 sm:gap-3">
                            <span class="chip">ISCC</span>
                            <span class="chip">CISCN</span>
                            <span class="chip">联合比赛</span>
                            <span class="chip">校园挖洞活动</span>
                        </div>
                    </div>

                    <div class="mt-8 flex flex-wrap justify-center gap-5">
                        <NuxtLink
                            to="/about"
                            class="text-sm font-bold text-(--md-sys-color-primary) underline-offset-4 transition hover:underline sm:text-base"
                        >
                            {{ t("pages.home.aboutUs.more") }} →
                        </NuxtLink>
                    </div>
                </div>
            </section>

            <section ref="newsRef" class="space-y-6">
                <div class="flex items-end justify-between gap-4">
                    <h3
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.home.recentNews.title") }}
                    </h3>

                    <NuxtLink
                        to="/archive"
                        class="text-sm font-semibold text-(--md-sys-color-on-surface-variant) underline-offset-4 transition hover:text-(--md-sys-color-on-surface) hover:underline sm:text-base"
                    >
                        {{ t("pages.home.recentNews.more") }} →
                    </NuxtLink>
                </div>

                <div class="space-y-4 sm:space-y-5">
                    <div v-if="loading" class="flex justify-center py-10">
                        <AnzuProgressRing :size="80" status="loading" />
                    </div>

                    <div v-else-if="error">
                        <ErrorDisplay :errorData="error" />
                    </div>

                    <ul
                        v-else-if="archives?.length"
                        class="space-y-3 sm:space-y-4"
                    >
                        <ArticleBlock
                            v-for="archive in archives"
                            :key="archive.id"
                            :datetime="
                                new Date(
                                    archive.data.publish_time,
                                ).toLocaleString()
                            "
                            :linkto="`/archive/${archive.slug}`"
                            :title="archive.title"
                            :tags="archive.tags?.map((t) => t.name)"
                        />
                    </ul>

                    <div
                        v-else
                        class="py-12 text-center text-(--md-sys-color-outline)"
                    >
                        暂无动态，去归档页看看吧～
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import type { Archive } from "~/types/archives";
import gsap from "gsap";

const { t } = useI18n();

useHead(() => ({
    title: t("pages.home.meta.title"),
    meta: [{ name: "description", content: t("pages.home.meta.description") }],
}));

const { data: archives, loading, error, get } = useApi<Archive[]>();
const loadArticles = async () => {
    await get(
        `/v1/contents?type_slug=archive&fields=publish_time&page=1&page_size=6`,
    );
};
void loadArticles();

const aboutRef = ref<HTMLElement | null>(null);
const newsRef = ref<HTMLElement | null>(null);

onMounted(() => {
    const reduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const targets = [aboutRef.value, newsRef.value].filter(
        Boolean,
    ) as HTMLElement[];
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                gsap.from(e.target, {
                    opacity: 0,
                    y: 12,
                    duration: 0.55,
                    ease: "power2.out",
                });
                io.unobserve(e.target);
            });
        },
        { threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));
});
</script>

<style scoped>
@reference "tailwindcss";

.chip {
    @apply rounded-full border border-(--md-sys-color-outline-variant) bg-transparent px-3 py-1 text-xs font-medium text-(--md-sys-color-on-surface-variant) transition-colors hover:border-(--md-sys-color-primary) hover:text-(--md-sys-color-primary) sm:text-sm;
}
</style>
