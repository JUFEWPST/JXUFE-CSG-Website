<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "#imports";
import AnzuNavBar from "@/components/AnzuNavBar.vue";
import PageFooter from "@/components/PageFooter.vue";
import AnzuNotification from "~/components/AnzuNotification.vue";
import { useNotification } from "@/composables/useNotification";
import { useFetchNotice } from "@/composables/useFetchNotice";
import { useOncePerSession } from "@/composables/useOncePerSession";
import { useI18n } from "vue-i18n";
import { useColorPalette } from "@/composables/useColorPalette";
import { usePageTitle } from "@/composables/usePageTitle";
import { useSidebarLayout } from "@/composables/useSidebarLayout";
import SiteInfoCard from "@/components/sidebars/SiteInfoCard.vue";
import CalendarCard from "@/components/sidebars/CalendarCard.vue";
import CTFEventsCard from "@/components/sidebars/CTFEventsCard.vue";
import WikiTree from "@/components/sidebars/WikiTree.vue";

const { t } = useI18n();
const { notificationRef } = useNotification();
const { titleKey } = usePageTitle();

const hasPageTitle = computed(() => !!titleKey.value);

const {
    leftCards,
    rightCards,
    mobileBottomCards,
    mobileDrawerCards,
    registerCard,
} = useSidebarLayout();

const leftNonStickyCards = computed(() =>
    leftCards.value.filter((card) => !card.sticky),
);
const leftStickyCards = computed(() =>
    leftCards.value.filter((card) => card.sticky),
);
const rightNonStickyCards = computed(() =>
    rightCards.value.filter((card) => !card.sticky),
);
const rightStickyCards = computed(() =>
    rightCards.value.filter((card) => card.sticky),
);
const isMobileDrawerOpen = ref(false);
const mobileDrawerSide = ref<"left" | "right">("right");
const mobileDrawerLeftCards = computed(() =>
    mobileDrawerCards.value.filter((card) => card.side === "left"),
);
const mobileDrawerRightCards = computed(() =>
    mobileDrawerCards.value.filter((card) => card.side === "right"),
);
const hasMobileDrawer = computed(
    () =>
        mobileDrawerLeftCards.value.length ||
        mobileDrawerRightCards.value.length,
);
const activeMobileDrawerCards = computed(() =>
    mobileDrawerSide.value === "left"
        ? mobileDrawerLeftCards.value
        : mobileDrawerRightCards.value,
);
const mobileDrawerLeftLabel = computed(() => {
    if (mobileDrawerLeftCards.value.length === 1) {
        const card = mobileDrawerLeftCards.value[0];
        if (card?.mobileLabelKey) return t(card.mobileLabelKey);
        if (card?.mobileLabel) return card.mobileLabel;
    }
    return t("common.items.sidebar");
});
const mobileDrawerRightLabel = computed(() => {
    if (mobileDrawerRightCards.value.length === 1) {
        const card = mobileDrawerRightCards.value[0];
        if (card?.mobileLabelKey) return t(card.mobileLabelKey);
        if (card?.mobileLabel) return card.mobileLabel;
    }
    return t("common.items.toc");
});

useColorPalette();

// 注册默认左侧卡片
registerCard({
    id: "site-info",
    side: "left",
    order: 10,
    sticky: false,
    showOnMobileBottom: true,
    component: SiteInfoCard,
});

// 注册默认右侧 CTF 赛事卡片
registerCard({
    id: "ctf-events",
    side: "right",
    order: 20,
    sticky: false,
    showOnMobileBottom: true,
    excludeRoutes: ["/archive/", "/wiki/"],
    component: CTFEventsCard,
});

registerCard({
    id: "site-calendar",
    side: "right",
    order: 10,
    sticky: false,
    showOnMobileBottom: true,
    excludeRoutes: ["/archive/", "/wiki/"],
    mutualGroup: "right-context",
    priority: 1,
    component: CalendarCard,
});

// 左侧：Wiki 树（仅在 /wiki 下展示）
registerCard({
    id: "wiki-tree",
    side: "left",
    order: 10,
    sticky: true,
    showOnMobileBottom: false,
    showOnMobileDrawer: true,
    includeRoutes: ["/wiki"],
    when: ({ route }) => route.path !== "/wiki" && route.path !== "/wiki/",
    mobileLabelKey: "pages.wiki.tree.title",
    component: WikiTree,
});

const route = useRoute();

const openMobileDrawer = (preferred?: "left" | "right") => {
    if (!hasMobileDrawer.value) return;
    if (preferred === "left" && mobileDrawerLeftCards.value.length) {
        mobileDrawerSide.value = "left";
    } else if (preferred === "right" && mobileDrawerRightCards.value.length) {
        mobileDrawerSide.value = "right";
    } else {
        mobileDrawerSide.value = mobileDrawerRightCards.value.length
            ? "right"
            : "left";
    }
    isMobileDrawerOpen.value = true;
};

const closeMobileDrawer = () => {
    isMobileDrawerOpen.value = false;
};

if (import.meta.client) {
    useOncePerSession("init-notice", () => {
        useFetchNotice();
    });
}

const isHome = computed(() => route.path === "/" || route.path === "");
const showLeft = computed(() => {
    if (route.meta?.showLeftSidebar !== undefined)
        return route.meta.showLeftSidebar;
    return true;
});
const showRight = computed(() => {
    if (route.meta?.showRightSidebar !== undefined) {
        return route.meta.showRightSidebar;
    }
    return true;
});

const showMahouBg = ref(false);

const mahouVisible = computed(() => isHome.value && showMahouBg.value);

// 路由切回首页时，自动恢复为“文字模式”（只在从非首页跳转回首页时触发）
watch(
    () => route.path,
    (path, oldPath) => {
        const wasHome = oldPath === "/" || oldPath === "";
        const nowHome = path === "/" || path === "";
        if (nowHome && !wasHome) {
            showMahouBg.value = false;
        }
    },
);

watch(
    () => route.fullPath,
    () => {
        isMobileDrawerOpen.value = false;
    },
);

watch(
    [mobileDrawerLeftCards, mobileDrawerRightCards],
    () => {
        if (!hasMobileDrawer.value) {
            isMobileDrawerOpen.value = false;
            return;
        }
        if (
            mobileDrawerSide.value === "left" &&
            !mobileDrawerLeftCards.value.length
        ) {
            mobileDrawerSide.value = "right";
        }
        if (
            mobileDrawerSide.value === "right" &&
            !mobileDrawerRightCards.value.length
        ) {
            mobileDrawerSide.value = "left";
        }
    },
    { immediate: true },
);

const toggleMahou = () => {
    if (!isHome.value) {
        showMahouBg.value = false;
        return;
    }
    showMahouBg.value = !showMahouBg.value;
};
</script>

<template>
    <div
        class="min-h-screen bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-background) transition-colors duration-300"
    >
        <AnzuNavBar />
        <!-- banner -->
        <header
            class="relative flex w-full flex-col items-center justify-center overflow-hidden bg-(--md-sys-color-background) text-(--md-sys-color-on-surface) transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
            :class="[
                isHome
                    ? 'h-[40vh] sm:h-[50vh]'
                    : hasPageTitle
                      ? 'h-[20vh]'
                      : 'h-[14vh] sm:h-[16vh]',
            ]"
            style="padding-top: 64px"
            @click="toggleMahou"
        >
            <div
                class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            >
                <div
                    class="h-full w-full max-w-6xl px-4 transition-opacity duration-500"
                    :class="mahouVisible ? 'opacity-100' : 'opacity-0'"
                    style="
                        background-image: url(&quot;/MahouCsg.svg&quot;);
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                    "
                />
            </div>

            <div
                class="absolute bottom-0 z-0 w-full text-(--md-sys-color-surface-container)"
            >
                <svg
                    class="waves block h-12 w-full sm:h-20"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                    shape-rendering="auto"
                >
                    <defs>
                        <path
                            id="gentle-wave"
                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                        />
                    </defs>
                    <g class="parallax">
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="0"
                            fill="currentColor"
                            fill-opacity="0.7"
                        />
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="3"
                            fill="currentColor"
                            fill-opacity="0.5"
                        />
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="5"
                            fill="currentColor"
                            fill-opacity="0.3"
                        />
                        <use
                            xlink:href="#gentle-wave"
                            x="48"
                            y="7"
                            fill="currentColor"
                            fill-opacity="1"
                        />
                    </g>
                </svg>
            </div>
            <div class="relative z-10 w-full max-w-6xl px-4 text-center">
                <transition
                    enter-active-class="transition duration-700 delay-300 ease-out"
                    enter-from-class="opacity-0 translate-y-8"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-300 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-4"
                >
                    <div
                        v-if="isHome && !showMahouBg"
                        class="flex flex-col items-center gap-6 sm:gap-8"
                    >
                        <div class="space-y-2 sm:space-y-4">
                            <h1
                                class="text-4xl font-extrabold tracking-wide text-(--md-sys-color-on-surface) sm:text-5xl md:text-6xl"
                            >
                                {{ t("meta.school") }}
                            </h1>
                            <h2
                                class="text-3xl font-semibold text-(--md-sys-color-primary) sm:text-4xl md:text-5xl"
                            >
                                {{ t("meta.guild") }}
                            </h2>
                        </div>

                        <p
                            class="mx-auto max-w-3xl text-base font-bold text-(--md-sys-color-on-surface-variant) sm:text-lg md:text-xl"
                        >
                            {{ t("pages.home.slogan") }}
                        </p>
                    </div>

                    <div
                        v-else-if="!isHome"
                        class="flex flex-col items-center gap-4 text-center"
                    >
                        <h1
                            class="text-3xl font-extrabold tracking-wide text-(--md-sys-color-primary) sm:text-4xl md:text-5xl"
                        >
                            {{ titleKey ? t(titleKey) : "" }}
                        </h1>
                    </div>

                    <div
                        v-else
                        class="flex flex-col items-center gap-4 text-center"
                    ></div>
                </transition>
            </div>
        </header>
        <!-- 三列布局 -->
        <div class="w-full grow bg-transparent">
            <div class="mx-auto w-full max-w-400 px-2">
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-10">
                    <!-- left: 非 sticky 在上，sticky 在下 -->
                    <aside
                        v-if="
                            showLeft &&
                            (leftNonStickyCards.length ||
                                leftStickyCards.length)
                        "
                        class="hidden lg:col-span-2 lg:col-start-1 lg:block"
                    >
                        <!-- 非 sticky 卡片 -->
                        <div v-if="leftNonStickyCards.length">
                            <div
                                v-for="card in leftNonStickyCards"
                                :key="card.id"
                                class="shadow-center-sm mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface) dark:bg-(--md-sys-color-surface-container-lowest)"
                            >
                                <div class="p-6">
                                    <component
                                        :is="card.component"
                                        v-bind="card.props || {}"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- sticky 卡片 -->
                        <div
                            v-if="leftStickyCards.length"
                            class="lg:sticky lg:top-32"
                        >
                            <div
                                v-for="card in leftStickyCards"
                                :key="card.id"
                                class="shadow-center-sm mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface) dark:bg-(--md-sys-color-surface-container-lowest)"
                            >
                                <div class="p-6">
                                    <component
                                        :is="card.component"
                                        v-bind="card.props || {}"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    <!-- Page Content -->
                    <main
                        :class="[
                            'lg:col-span-6 lg:col-start-3',
                            'overflow-hidden rounded-xl',
                            'shadow-center-sm',
                            'self-start',
                        ]"
                        class="mt-4 mb-2 min-w-0 md:mb-10"
                    >
                        <slot />
                    </main>

                    <!-- Right Sidebar: 非 sticky 在上，sticky 在下 -->
                    <aside
                        v-if="
                            showRight &&
                            (rightNonStickyCards.length ||
                                rightStickyCards.length)
                        "
                        class="hidden lg:col-span-2 lg:col-start-9 lg:block"
                    >
                        <!-- 非 sticky 卡片 -->
                        <div v-if="rightNonStickyCards.length">
                            <div
                                v-for="card in rightNonStickyCards"
                                :key="card.id"
                                class="shadow-center-sm mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface) dark:bg-(--md-sys-color-surface-container-lowest)"
                            >
                                <div class="p-6">
                                    <component
                                        :is="card.component"
                                        v-bind="card.props || {}"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- sticky 卡片 -->
                        <div
                            v-if="rightStickyCards.length"
                            class="lg:sticky lg:top-32"
                        >
                            <div
                                v-for="card in rightStickyCards"
                                :key="card.id"
                                class="shadow-center-sm mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface) dark:bg-(--md-sys-color-surface-container-lowest)"
                            >
                                <div class="p-6">
                                    <component
                                        :is="card.component"
                                        v-bind="card.props || {}"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <div class="mt-4 space-y-4 lg:hidden">
                    <div
                        v-for="card in mobileBottomCards"
                        :key="card.id"
                        class="shadow-center-sm rounded-xl bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface) dark:bg-(--md-sys-color-surface-container-lowest)"
                    >
                        <div class="p-6">
                            <component
                                :is="card.component"
                                v-bind="card.props || {}"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Drawer Trigger -->
        <button
            v-if="hasMobileDrawer"
            class="fixed right-4 bottom-6 z-40 flex items-center gap-2 rounded-full bg-(--md-sys-color-primary) px-4 py-3 text-(--md-sys-color-on-primary) shadow-center-sm transition-transform active:scale-95 lg:hidden"
            @click="openMobileDrawer()"
            :aria-label="t('common.actions.open')"
        >
            <span class="text-sm font-semibold">
                {{
                    mobileDrawerRightCards.length
                        ? mobileDrawerRightLabel
                        : mobileDrawerLeftLabel
                }}
            </span>
        </button>

        <!-- Mobile Drawer -->
        <div v-if="isMobileDrawerOpen" class="fixed inset-0 z-50 lg:hidden">
            <div
                class="absolute inset-0 bg-black/30 backdrop-blur-sm"
                @click="closeMobileDrawer"
            ></div>
            <div
                class="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-surface) shadow-center-sm"
            >
                <div
                    class="flex items-center justify-between border-b border-(--md-sys-color-outline-variant)/50 px-4 py-3"
                >
                    <div class="flex items-center gap-2">
                        <button
                            v-if="mobileDrawerLeftCards.length"
                            class="rounded-full px-3 py-1 text-sm transition-colors"
                            :class="
                                mobileDrawerSide === 'left'
                                    ? 'bg-(--md-sys-color-primary-container) text-(--md-sys-color-primary)'
                                    : 'text-(--md-sys-color-on-surface-variant)'
                            "
                            @click="openMobileDrawer('left')"
                        >
                            {{ mobileDrawerLeftLabel }}
                        </button>
                        <button
                            v-if="mobileDrawerRightCards.length"
                            class="rounded-full px-3 py-1 text-sm transition-colors"
                            :class="
                                mobileDrawerSide === 'right'
                                    ? 'bg-(--md-sys-color-primary-container) text-(--md-sys-color-primary)'
                                    : 'text-(--md-sys-color-on-surface-variant)'
                            "
                            @click="openMobileDrawer('right')"
                        >
                            {{ mobileDrawerRightLabel }}
                        </button>
                    </div>
                    <button
                        class="text-sm text-(--md-sys-color-primary)"
                        @click="closeMobileDrawer"
                    >
                        {{ t("common.actions.close") }}
                    </button>
                </div>

                <div class="max-h-[calc(80vh-3.25rem)] overflow-y-auto p-4">
                    <div
                        v-for="card in activeMobileDrawerCards"
                        :key="card.id"
                        class="shadow-center-sm mb-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface)"
                    >
                        <div class="p-6">
                            <component
                                :is="card.component"
                                v-bind="card.props || {}"
                            />
                        </div>
                    </div>
                    <div
                        v-if="!activeMobileDrawerCards.length"
                        class="py-6 text-center text-sm text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("common.items.empty") }}
                    </div>
                </div>
            </div>
        </div>
        <AnzuNotification ref="notificationRef" />
        <PageFooter />
    </div>
</template>

<style scoped>
.waves {
    width: 100%;
}

.parallax > use {
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
}

.parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
}

.parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}

.parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}
</style>
