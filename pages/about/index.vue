<script setup lang="ts">
import FlipToggle from "~/components/FlipToggle.vue";
import { onMounted, ref } from "vue";
import { leadersData } from "~/data/leadersData";
import { honorsData, getLevelColor, getYearColor } from "~/data/honors";
import { membersArray } from "~/data/membersData";
import { usePageTitle } from "@/composables/usePageTitle";

const isMounted = ref(false);
const currentQuote = ref(0);
const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.about.index.title");

const quotes = [
    "太好听了吧！你打网安真的好好听啊，简直就是天籁！我刚才，听到你打网安了。我们以后一起打网安好不好？一起做学园偶像！",
    "放弃的话就到此为止了，但是，你可以改变命运()",
    "是我喜欢的协会",
    "协会可能会倒闭，但一定不会变质！（笑",
];

useHead(() => ({
    title: t("pages.about.index.meta.title"),
    meta: [
        {
            name: "description",
            content: t("pages.about.index.meta.description"),
        },
        { name: "keywords", content: t("pages.about.index.meta.keywords") },
    ],
}));

onMounted(() => {
    isMounted.value = true;
    setInterval(() => {
        currentQuote.value = (currentQuote.value + 1) % quotes.length;
    }, 5000);
});
</script>

<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mb-10 flex justify-center sm:mb-12">
            <h1 class="hidden">{{ t("pages.about.index.title") }}</h1>
            <FlipToggle
                class="aspect-square w-4/5 max-w-60 transition-transform duration-300 hover:scale-110 md:w-60"
            >
                <template #front>
                    <div
                        class="relative mx-auto text-center text-4xl font-bold md:text-5xl"
                        :aria-label="t('pages.about.index.meta.title')"
                    >
                        <client-only>
                            <div
                                class="pointer-events-none absolute top-0 left-0 h-full w-full"
                            >
                                <template v-for="i in 8" :key="i">
                                    <div
                                        class="animate-float absolute text-(--md-sys-color-tertiary) opacity-70"
                                        :style="{
                                            left: `${Math.random() * 100}%`,
                                            top: `${-10 - Math.random() * 10}%`,
                                            animationDuration: `${5 + Math.random() * 10}s`,
                                            animationDelay: `${Math.random() * 5}s`,
                                            fontSize: `${10 + Math.random() * 15}px`,
                                            transform: `rotate(${Math.random() * 360}deg)`,
                                            filter: `hue-rotate(${Math.random() * 60}deg)`,
                                        }"
                                    >
                                        {{
                                            ["✿", "❀", "✽", "✼", "❁"][
                                                Math.floor(Math.random() * 5)
                                            ]
                                        }}
                                    </div>
                                </template>
                            </div>
                        </client-only>

                        <span class="text-(--md-sys-color-primary)">网安</span>
                        *
                        <span class="text-(--md-sys-color-tertiary)">领域</span>
                        <div
                            class="absolute -top-5 -left-4 text-2xl text-(--md-sys-color-secondary)"
                        >
                            ✧
                        </div>
                        <div
                            class="absolute -top-5 -right-4 text-2xl text-(--md-sys-color-error)"
                        >
                            ✧
                        </div>
                        <div
                            class="absolute -bottom-5 -left-4 text-2xl text-(--md-sys-color-primary)"
                        >
                            ✦
                        </div>
                        <div
                            class="absolute -right-4 -bottom-5 text-2xl text-(--md-sys-color-tertiary)"
                        >
                            ✦
                        </div>
                    </div>
                </template>

                <template #back>
                    <div class="relative h-full w-full">
                        <img
                            src="~/assets/images/网安领域.webp"
                            class="h-full w-full object-contain"
                            alt="网安*领域"
                        />
                        <div
                            class="absolute right-0 bottom-0 left-0 bg-black/60 p-3 text-sm text-white"
                        >
                            <p>「欢迎来到网络安全的世界...」</p>
                        </div>
                    </div>
                </template>
            </FlipToggle>
        </div>

        <div
            class="mx-auto max-w-4xl space-y-10 sm:space-y-12"
            :class="isMounted ? 'opacity-100' : 'opacity-0'"
        >
            <section class="space-y-6">
                <header class="space-y-2">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.about.index.intro.title") }}
                    </h2>
                    <hr class="border-(--md-sys-color-outline-variant)" />
                </header>

                <div class="space-y-4 text-pretty">
                    <p
                        class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base md:text-lg"
                    >
                        <i18n-t keypath="pages.about.index.intro.p1" tag="span">
                            <template #default>
                                <span
                                    class="font-bold text-(--md-sys-color-primary)"
                                    >{{ t("meta.fullName") }}</span
                                >
                            </template>
                        </i18n-t>
                    </p>

                    <p
                        class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base md:text-lg"
                    >
                        <i18n-t keypath="pages.about.index.intro.p2" tag="span">
                            <template #highlighted>
                                <span
                                    class="font-bold text-(--md-sys-color-primary)"
                                    >{{
                                        t(
                                            "pages.about.index.intro.highlightedText",
                                        )
                                    }}</span
                                >
                            </template>
                        </i18n-t>
                    </p>
                    <section class="space-y-3">
                        <h3
                            class="text-lg font-semibold text-(--md-sys-color-on-surface) sm:text-xl"
                        >
                            {{ t("pages.about.index.departments.title") }}
                        </h3>

                        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div
                                class="space-y-1 border-l-2 border-(--md-sys-color-outline-variant) pl-3"
                            >
                                <h4
                                    class="text-sm font-medium text-(--md-sys-color-on-surface) sm:text-base"
                                >
                                    {{
                                        t(
                                            "pages.about.index.departments.study.name",
                                        )
                                    }}
                                </h4>
                                <p
                                    class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base"
                                >
                                    {{
                                        t(
                                            "pages.about.index.departments.study.desc",
                                        )
                                    }}
                                </p>
                            </div>

                            <div
                                class="space-y-1 border-l-2 border-(--md-sys-color-outline-variant) pl-3"
                            >
                                <h4
                                    class="text-sm font-medium text-(--md-sys-color-on-surface) sm:text-base"
                                >
                                    {{
                                        t(
                                            "pages.about.index.departments.organization.name",
                                        )
                                    }}
                                </h4>
                                <p
                                    class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base"
                                >
                                    {{
                                        t(
                                            "pages.about.index.departments.organization.desc",
                                        )
                                    }}
                                </p>
                            </div>

                            <div
                                class="space-y-1 border-l-2 border-(--md-sys-color-outline-variant) pl-3"
                            >
                                <h4
                                    class="text-sm font-medium text-(--md-sys-color-on-surface) sm:text-base"
                                >
                                    {{
                                        t(
                                            "pages.about.index.departments.publicity.name",
                                        )
                                    }}
                                </h4>
                                <p
                                    class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base"
                                >
                                    {{
                                        t(
                                            "pages.about.index.departments.publicity.desc",
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div
                        class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base md:text-lg"
                    >
                        {{ t("pages.about.index.intro.wpstIntro") }}
                    </div>
                </div>
            </section>

            <AnzuAlert type="info">
                {{ t("pages.about.members.dataCollectTip")
                }}<NuxtLink
                    class="text-(--md-sys-color-primary)"
                    to="/archive/nvz60h0y8pj9opi1hyn9ysvb"
                >
                    [{{ t("pages.about.members.archiveInvite") }}]</NuxtLink
                >
            </AnzuAlert>

            <!-- Leaders -->
            <section class="space-y-4">
                <div class="flex flex-wrap items-end justify-between gap-4">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.about.index.members.leaders") }}
                    </h2>
                    <NuxtLink
                        to="/about/leaders"
                        class="text-sm font-bold text-(--md-sys-color-on-surface-variant) underline-offset-4 transition hover:text-(--md-sys-color-on-surface) hover:underline sm:text-base"
                    >
                        >> {{ t("pages.about.index.listmode") }}
                    </NuxtLink>
                </div>
                <LeaderCarousel :leaders="leadersData" />
            </section>

            <!-- Members -->
            <section class="space-y-4">
                <div class="flex flex-wrap items-end justify-between gap-4">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.about.index.members.members") }}
                    </h2>
                    <NuxtLink
                        to="/about/members"
                        class="text-sm font-bold text-(--md-sys-color-on-surface-variant) underline-offset-4 transition hover:text-(--md-sys-color-on-surface) hover:underline sm:text-base"
                    >
                        >> {{ t("pages.about.index.listmode") }}
                    </NuxtLink>
                </div>
                <MembersCarousel :membersArray="membersArray" />
            </section>

            <!-- Honors -->
            <section class="space-y-6">
                <header class="space-y-2">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.about.index.members.honors") }}
                    </h2>
                    <hr class="border-(--md-sys-color-outline-variant)" />
                </header>

                <div class="space-y-8">
                    <div
                        v-for="yearData in honorsData"
                        :key="yearData.year"
                        class="space-y-4"
                    >
                        <h3
                            class="flex items-center gap-2 text-lg font-semibold text-(--md-sys-color-on-surface-variant) sm:text-xl"
                        >
                            <span
                                class="h-3 w-3 rounded-full"
                                :class="getYearColor(yearData.year)"
                            />
                            {{ yearData.year }}
                        </h3>

                        <ul class="space-y-3">
                            <li
                                v-for="(honor, index) in yearData.honors"
                                :key="index"
                                class="flex items-start gap-3"
                            >
                                <span
                                    class="min-w-10 rounded-full px-2 py-1 text-center text-xs font-bold text-white"
                                    :class="`bg-linear-to-r ${getLevelColor(honor.level)}`"
                                >
                                    {{ honor.level }}
                                </span>
                                <span
                                    class="text-(--md-sys-color-on-surface-variant)"
                                    >{{ honor.description }}</span
                                >
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    class="border-t border-(--md-sys-color-outline-variant) pt-4 text-center text-xs text-(--md-sys-color-on-surface-variant) sm:text-sm"
                >
                    <p class="mt-1">
                        我认为奇迹与魔法对谁都会带来幸福，是十分美好的事物。
                    </p>
                </div>
            </section>
            <!-- Join Us -->
            <section class="space-y-6">
                <header class="space-y-2">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.about.index.joinUs.title") }}
                    </h2>
                    <hr class="border-(--md-sys-color-outline-variant)" />
                </header>
                <div class="flex flex-col items-center gap-8 md:flex-row">
                    <div
                        class="space-y-4 text-(--md-sys-color-on-surface-variant) md:w-1/2"
                    >
                        <p
                            class="text-sm leading-relaxed sm:text-base md:text-lg"
                        >
                            <i18n-t
                                keypath="pages.about.index.joinUs.scan_qr"
                                tag="span"
                            >
                                <span>
                                    <span class="md:hidden">{{
                                        t("common.direction.down1")
                                    }}</span>
                                    <span class="hidden md:inline">{{
                                        t("common.direction.right1")
                                    }}</span>
                                </span>
                            </i18n-t>
                        </p>
                        <div class="pl-4">
                            <div
                                class="min-h-12 text-sm text-(--md-sys-color-tertiary) italic transition-opacity duration-500 sm:text-base"
                            >
                                「{{ quotes[currentQuote] }}」
                            </div>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-3">
                            <AnzuButton
                                class="h-10"
                                href="https://qm.qq.com/q/v7pD9BL4Lm"
                                primary-color="oklch(62.3% 0.214 259.815)"
                                target="_blank"
                            >
                                {{ t("pages.about.index.joinUs.joinGroup") }}
                            </AnzuButton>
                            <AnzuButton
                                @click="
                                    currentQuote =
                                        (currentQuote + 1) % quotes.length
                                "
                                primary-color="oklch(65.6% 0.241 354.308)"
                            >
                                {{ t("pages.about.index.joinUs.changeQuote") }}
                            </AnzuButton>
                        </div>
                    </div>

                    <div class="flex justify-center md:w-1/2">
                        <figure class="max-w-xs">
                            <img
                                src="/assets/images/2025JXUFECGS.svg"
                                class="h-56 w-56 object-contain p-3"
                                :alt="t('pages.about.index.joinUs.qrLabel')"
                            />
                            <figcaption
                                class="mt-2 text-center text-xs text-(--md-sys-color-on-surface-variant)"
                            >
                                {{ t("pages.about.index.joinUs.idolLine") }}
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>
            <!-- Contributors -->
            <section class="space-y-6">
                <header class="space-y-2">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        Contributors
                    </h2>
                    <hr class="border-(--md-sys-color-outline-variant)" />
                </header>
                <div
                    class="space-y-3 text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base md:text-lg"
                >
                    <i18n-t
                        keypath="pages.about.index.contributors.para"
                        tag="span"
                    >
                        <a
                            href="https://github.com/JUFEWPST/JXUFE-CSG-Website"
                            class="text-(--md-sys-color-primary) underline-offset-4 transition hover:text-(--md-sys-color-tertiary) hover:underline"
                        >
                            {{ t("common.actions.viewDetail") }}
                        </a>
                    </i18n-t>
                </div>
                <div class="my-2">
                    <a
                        href="https://github.com/JUFEWPST/JXUFE-CSG-Website/graphs/contributors"
                    >
                        <img
                            src="https://contrib.rocks/image?repo=JUFEWPST/JXUFE-CSG-Website&columns=15"
                        />
                    </a>
                </div>
            </section>
        </div>
    </main>
</template>

<style scoped>
@reference "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 0.7;
    }

    90% {
        opacity: 0.7;
    }

    100% {
        transform: translateY(calc(100vh + 100px)) rotate(360deg);
        opacity: 0;
    }
}

.animate-float {
    animation-name: float;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
</style>
