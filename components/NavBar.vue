<template>
    <header
        ref="headerRef"
        class="fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-out"
        :style="headerStyles"
    >
        <div
            class="relative z-10 mx-3 my-4 text-(--md-sys-color-on-surface) sm:mx-6"
        >
            <nav
                class="relative flex flex-nowrap items-center justify-between"
                role="navigation"
                aria-label="主导航"
            >
                <div class="flex min-w-0 shrink-0 items-center">
                    <NuxtLink
                        to="/"
                        class="nav-link-block text-md mr-2 flex min-w-0 shrink-0 cursor-pointer items-center py-1! font-bold transition-colors hover:text-(--md-sys-color-primary) sm:text-lg"
                    >
                        <img
                            src="/favicon.svg"
                            class="mr-2 h-9 shrink-0"
                            alt="江财网安协会logo"
                        />
                        <span
                            class="block max-w-56 min-w-0 truncate lg:max-w-[20rem]"
                        >
                            {{ t("meta.fullName") }}
                        </span>
                    </NuxtLink>
                </div>

                <div
                    ref="centerColRef"
                    class="relative mx-2 hidden h-10 min-w-0 flex-1 items-center justify-center md:flex"
                >
                    <div
                        ref="measureRowRef"
                        class="pointer-events-none invisible absolute top-0 left-0 flex items-center gap-2 whitespace-nowrap md:gap-4"
                    >
                        <template
                            v-for="(link, index) in navLinks"
                            :key="`measure-${link.path}`"
                        >
                            <div
                                :ref="
                                    (el) =>
                                        setMeasureItemRef(
                                            el as HTMLElement | null,
                                            index,
                                        )
                                "
                                class="shrink-0"
                            >
                                <div
                                    v-if="'children' in link"
                                    class="flex items-center"
                                >
                                    <div
                                        class="nav-link-block"
                                        :class="[
                                            isActive(link)
                                                ? 'active-link'
                                                : 'text-(--md-sys-color-on-surface-variant)',
                                        ]"
                                    >
                                        <span
                                            class="relative z-10 flex items-center font-bold"
                                        >
                                            <component
                                                :is="iconMap[link.path]"
                                                v-if="iconMap[link.path]"
                                                class="mr-1.5 h-5 w-5"
                                            />
                                            {{ t(link.label) }}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        class="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                                    >
                                        <svg
                                            class="h-3.5 w-3.5 text-(--md-sys-color-on-surface-variant) transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    v-else
                                    class="nav-link-block"
                                    :class="[
                                        isActive(link)
                                            ? 'active-link'
                                            : 'text-(--md-sys-color-on-surface-variant)',
                                    ]"
                                >
                                    <span
                                        class="relative z-10 flex items-center font-bold"
                                    >
                                        <component
                                            :is="iconMap[link.path]"
                                            v-if="iconMap[link.path]"
                                            class="mr-1.5 h-5 w-5"
                                        />
                                        {{ t(link.label) }}
                                    </span>
                                </div>
                            </div>
                        </template>

                        <div ref="moreMeasureRef" class="shrink-0">
                            <div
                                class="nav-link-block text-(--md-sys-color-on-surface-variant)"
                            >
                                <span
                                    class="relative z-10 flex items-center font-bold"
                                >
                                    <EllipsisHorizontalIcon
                                        class="mr-1.5 h-5 w-5"
                                    />
                                    {{ t("common.actions.more") }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex min-w-0 items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 md:gap-4"
                        :class="{
                            'invisible scale-95 opacity-0':
                                showArticleTitle && scrollDirection === 'down',
                        }"
                    >
                        <template v-for="link in visibleLinks" :key="link.path">
                            <AnzuDropdown
                                v-if="'children' in link"
                                :model-value="dropdownStates[link.path]"
                                @update:modelValue="
                                    (v) => (dropdownStates[link.path] = !!v)
                                "
                                width-class="w-48"
                                panel-class="p-1.5"
                                open-on-hover
                                :hover-close-delay="180"
                                @mouseenter="moreOpen = false"
                            >
                                <template #trigger>
                                    <div class="flex items-center">
                                        <NuxtLink
                                            :to="link.defaultPath || link.path"
                                            class="nav-link-block"
                                            :class="[
                                                isActive(link)
                                                    ? 'active-link'
                                                    : 'text-(--md-sys-color-on-surface-variant)',
                                            ]"
                                        >
                                            <span
                                                class="relative z-10 flex items-center font-bold"
                                            >
                                                <component
                                                    :is="iconMap[link.path]"
                                                    v-if="iconMap[link.path]"
                                                    class="mr-1.5 h-5 w-5"
                                                />
                                                {{ t(link.label) }}
                                            </span>
                                        </NuxtLink>

                                        <button
                                            @click.stop="
                                                moreOpen = false;
                                                toggleDropdown(link.path);
                                            "
                                            class="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                                            :class="{
                                                'rotate-180':
                                                    dropdownStates[link.path],
                                            }"
                                            type="button"
                                            aria-label="子菜单"
                                        >
                                            <svg
                                                class="h-3.5 w-3.5 text-(--md-sys-color-on-surface-variant) transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 9l-7 7-7-7"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                </template>

                                <template #menu>
                                    <NuxtLink
                                        v-for="child in (
                                            link as NavLinkWithChildren
                                        ).children"
                                        :key="child.path"
                                        :to="child.path"
                                        class="block rounded-lg px-3 py-2 text-sm transition-colors duration-200"
                                        :class="[
                                            route.path === child.path
                                                ? 'bg-(--md-sys-color-secondary-container) font-medium text-(--md-sys-color-on-secondary-container)'
                                                : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)',
                                        ]"
                                        @click="closeDropdown(link.path)"
                                    >
                                        {{ t(child.label) }}
                                    </NuxtLink>
                                </template>
                            </AnzuDropdown>

                            <NuxtLink
                                v-else
                                :to="link.path"
                                class="nav-link-block"
                                :class="[
                                    isActive(link)
                                        ? 'active-link'
                                        : 'text-(--md-sys-color-on-surface-variant)',
                                ]"
                                @mouseenter="moreOpen = false"
                            >
                                <span
                                    class="relative z-10 flex items-center font-bold"
                                >
                                    <component
                                        :is="iconMap[link.path]"
                                        v-if="iconMap[link.path]"
                                        class="mr-1.5 h-5 w-5"
                                    />
                                    {{ t(link.label) }}
                                </span>
                            </NuxtLink>
                        </template>
                        <AnzuDropdown
                            v-if="overflowLinks.length"
                            v-model="moreOpen"
                            width-class="w-56"
                            panel-class="p-1.5"
                            @mouseenter="closeAllDropdowns()"
                        >
                            <template #trigger>
                                <button
                                    type="button"
                                    class="nav-link-block"
                                    :class="
                                        moreOpen
                                            ? 'active-link'
                                            : 'text-(--md-sys-color-on-surface-variant)'
                                    "
                                    @click.stop="moreOpen = !moreOpen"
                                    aria-label="更多菜单"
                                >
                                    <span
                                        class="relative z-10 flex items-center font-bold"
                                    >
                                        <EllipsisHorizontalIcon
                                            class="mr-1.5 h-5 w-5"
                                        />
                                        {{ t("common.actions.more") }}
                                    </span>
                                </button>
                            </template>

                            <template #menu>
                                <template
                                    v-for="link in overflowLinks"
                                    :key="`more-${link.path}`"
                                >
                                    <div v-if="'children' in link" class="p-1">
                                        <NuxtLink
                                            :to="link.defaultPath || link.path"
                                            class="block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                                            :class="[
                                                isActive(link)
                                                    ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                                                    : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)',
                                            ]"
                                            @click="moreOpen = false"
                                        >
                                            <span class="flex items-center">
                                                <component
                                                    :is="iconMap[link.path]"
                                                    v-if="iconMap[link.path]"
                                                    class="mr-2 h-5 w-5"
                                                />
                                                {{ t(link.label) }}
                                            </span>
                                        </NuxtLink>

                                        <div
                                            class="mt-1 border-l border-(--md-sys-color-outline-variant)/50 pl-2"
                                        >
                                            <NuxtLink
                                                v-for="child in (
                                                    link as NavLinkWithChildren
                                                ).children"
                                                :key="child.path"
                                                :to="child.path"
                                                class="block rounded-lg px-3 py-2 text-sm transition-colors duration-200"
                                                :class="[
                                                    route.path === child.path
                                                        ? 'bg-(--md-sys-color-secondary-container) font-medium text-(--md-sys-color-on-secondary-container)'
                                                        : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)',
                                                ]"
                                                @click="moreOpen = false"
                                            >
                                                {{ t(child.label) }}
                                            </NuxtLink>
                                        </div>
                                    </div>

                                    <NuxtLink
                                        v-else
                                        :to="link.path"
                                        class="block rounded-lg px-3 py-2 text-sm transition-colors duration-200"
                                        :class="[
                                            isActive(link)
                                                ? 'bg-(--md-sys-color-secondary-container) font-medium text-(--md-sys-color-on-secondary-container)'
                                                : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)',
                                        ]"
                                        @click="moreOpen = false"
                                    >
                                        <span class="flex items-center">
                                            <component
                                                :is="iconMap[link.path]"
                                                v-if="iconMap[link.path]"
                                                class="mr-2 h-5 w-5"
                                            />
                                            {{ t(link.label) }}
                                        </span>
                                    </NuxtLink>
                                </template>
                            </template>
                        </AnzuDropdown>
                    </div>
                    <div
                        v-if="
                            route.path.startsWith('/archive/') &&
                            navTitleBox.title
                        "
                        class="pointer-events-none absolute top-0 left-0 flex h-full w-full flex-col items-start justify-center px-4 text-left transition-all duration-300"
                        :class="{
                            'invisible opacity-0':
                                !showArticleTitle || scrollDirection === 'up',
                        }"
                    >
                        <div
                            class="w-full overflow-hidden text-sm leading-tight font-bold text-ellipsis whitespace-nowrap text-(--md-sys-color-on-surface) transition-all duration-300 md:text-base"
                        >
                            {{ navTitleBox.title }}
                        </div>
                        <div
                            class="text-xs text-(--md-sys-color-on-surface-variant) opacity-70 transition-all duration-500"
                        >
                            <span v-if="navTitleBox.subtitle">{{
                                navTitleBox.subtitle
                            }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="ml-2 flex min-w-0 items-center gap-1 sm:ml-4 sm:gap-2"
                >
                    <ToggleTheme class="shrink-0" />
                    <ToggleLocale class="shrink-0" />
                    <button
                        class="relative ml-1 shrink-0 rounded-full p-2 text-(--md-sys-color-on-surface) transition-colors hover:bg-(--md-sys-color-surface-container-high) focus:outline-none md:hidden"
                        aria-label="打开菜单"
                        @click.stop="toggleMenu"
                    >
                        <Bars3Icon
                            v-if="!isMenuOpen"
                            class="h-6 w-6"
                        ></Bars3Icon>
                        <XMarkIcon v-else class="h-6 w-6"></XMarkIcon>
                    </button>
                </div>
            </nav>
            <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
            >
                <div
                    v-show="isMenuOpen"
                    class="absolute top-full right-0 z-60 mt-2 max-h-[calc(100vh-5rem)] w-64 origin-top-right overflow-y-auto rounded-xl border border-(--md-sys-color-outline-variant)/50 bg-(--md-sys-color-surface-container) p-3 shadow-lg md:hidden"
                >
                    <template
                        v-for="link in navLinks"
                        :key="`mobile-${link.path}`"
                    >
                        <div v-if="'children' in link" class="mb-1">
                            <div
                                class="mobile-nav-link flex w-full items-center justify-between rounded-lg p-2 transition-colors"
                                :class="
                                    isActive(link)
                                        ? 'bg-(--md-sys-color-surface-container-high) font-medium'
                                        : 'hover:bg-(--md-sys-color-surface-container-high)/50'
                                "
                            >
                                <NuxtLink
                                    :to="link.defaultPath || link.path"
                                    class="flex flex-1 items-center"
                                    :class="
                                        isActive(link)
                                            ? 'font-medium text-(--md-sys-color-primary)'
                                            : 'text-(--md-sys-color-on-surface)'
                                    "
                                    @click="closeMenu"
                                >
                                    <component
                                        :is="iconMap[link.path]"
                                        v-if="iconMap[link.path]"
                                        class="mr-2 h-5 w-5"
                                    />
                                    {{ t(link.label) }}
                                </NuxtLink>

                                <button
                                    @click.stop="toggleMobileSubmenu(link.path)"
                                    class="rounded-full p-1 hover:bg-(--md-sys-color-surface-container-highest)"
                                    aria-label="子菜单"
                                >
                                    <svg
                                        class="h-4 w-4 text-(--md-sys-color-on-surface-variant) transition-transform"
                                        :class="{
                                            'rotate-180':
                                                mobileDropdownStates[link.path],
                                        }"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </button>
                            </div>

                            <div
                                v-if="mobileDropdownStates[link.path]"
                                class="mt-1 mb-2 space-y-1 pl-4"
                            >
                                <NuxtLink
                                    v-for="child in (
                                        link as NavLinkWithChildren
                                    ).children"
                                    :key="child.path"
                                    :to="child.path"
                                    class="block rounded-lg px-3 py-2 text-sm transition-colors"
                                    :class="{
                                        'bg-(--md-sys-color-secondary-container) font-medium text-(--md-sys-color-on-secondary-container)':
                                            route.path === child.path,
                                        'text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)':
                                            route.path !== child.path,
                                    }"
                                    @click="closeMenu"
                                >
                                    {{ t(child.label) }}
                                </NuxtLink>
                            </div>
                        </div>

                        <NuxtLink
                            v-else
                            :to="link.path"
                            class="mobile-nav-link mb-1 block rounded-lg p-2 transition-colors"
                            :class="[
                                isActive(link)
                                    ? 'bg-(--md-sys-color-surface-container-high) font-medium'
                                    : 'hover:bg-(--md-sys-color-surface-container-high)/50',
                            ]"
                            @click="closeMenu"
                        >
                            <span
                                class="flex items-center"
                                :class="
                                    isActive(link)
                                        ? 'font-medium text-(--md-sys-color-primary)'
                                        : 'text-(--md-sys-color-on-surface)'
                                "
                            >
                                <component
                                    :is="iconMap[link.path]"
                                    v-if="iconMap[link.path]"
                                    class="mr-2 h-5 w-5"
                                />
                                {{ t(link.label) }}
                            </span>
                        </NuxtLink>
                    </template>
                </div>
            </transition>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";
import ToggleTheme from "./ToggleTheme.vue";
import AnzuDropdown from "@/components/AnzuDropdown.vue";
import { useClickAway } from "@/composables/useClickAway";
import {
    Bars3Icon,
    XMarkIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/vue/24/outline";
import { useRoute } from "vue-router";
import {
    useNavLinks,
    type NavLink,
    type NavLinkWithChildren,
} from "~/composables/useNavLinks";
import {
    HomeIcon,
    ArchiveBoxIcon,
    UserGroupIcon,
    LinkIcon,
} from "@heroicons/vue/24/outline";
import { useDropdownController } from "~/composables/useDropdownController";
import ToggleLocale from "./ToggleLocale.vue";

const { t } = useI18n();
const route = useRoute();
const navTitleBox = useState("navTitleBox", () => ({
    title: "",
    subtitle: "",
}));

const navLinks = useNavLinks();

const iconMap: Record<string, any> = {
    "/": HomeIcon,
    "/archive": ArchiveBoxIcon,
    "/about": UserGroupIcon,
    "/links": LinkIcon,
};

const dropdownLinks = navLinks.filter(
    (link): link is NavLinkWithChildren => "children" in link,
);
const desktopDropdown = useDropdownController(dropdownLinks);
const mobileDropdown = useDropdownController(dropdownLinks);

const centerColRef = ref<HTMLElement | null>(null);
const measureRowRef = ref<HTMLElement | null>(null);
const moreMeasureRef = ref<HTMLElement | null>(null);
const measureItemRefs = ref<Array<HTMLElement | null>>([]);

const visibleCount = ref(navLinks.length);
const moreOpen = ref(false);

const visibleLinks = computed(() => navLinks.slice(0, visibleCount.value));
const overflowLinks = computed(() => navLinks.slice(visibleCount.value));

const setMeasureItemRef = (el: HTMLElement | null, index: number) => {
    measureItemRefs.value[index] = el;
};

let ro: ResizeObserver | null = null;
const scheduleRecompute = () => window.requestAnimationFrame(recomputeOverflow);

const recomputeOverflow = async () => {
    await nextTick();

    const center = centerColRef.value;
    const row = measureRowRef.value;
    if (!center || !row) return;

    const availableWidth = center.clientWidth;
    if (!availableWidth) return;

    const itemEls = measureItemRefs.value.filter(Boolean) as HTMLElement[];
    if (!itemEls.length) return;

    const styles = window.getComputedStyle(row);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

    const widths = itemEls.map((el) => el.getBoundingClientRect().width);
    const moreWidth = moreMeasureRef.value?.getBoundingClientRect().width ?? 0;

    const totalWidth = (count: number) => {
        if (count <= 0) return 0;
        return (
            widths.slice(0, count).reduce((a, b) => a + b, 0) +
            gap * (count - 1)
        );
    };

    let count = itemEls.length;
    while (count > 0 && totalWidth(count) > availableWidth) {
        count--;
    }
    if (count === itemEls.length) {
        visibleCount.value = itemEls.length;
        moreOpen.value = false;
        return;
    }

    const reserved = moreWidth + gap;
    const limit = Math.max(0, availableWidth - reserved);
    count = itemEls.length;
    while (count > 0 && totalWidth(count) > limit) {
        count--;
    }
    visibleCount.value = Math.max(0, count);
};

const opacity = ref(0);
const headerRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);
const showArticleTitle = ref(false);
const lastScrollY = ref(0);
const scrollDirection = ref<"up" | "down">("up");

const anyPopupOpen = computed(() => {
    const desktopAny = Object.values(dropdownStates).some(Boolean);
    const mobileAny = Object.values(mobileDropdownStates).some(Boolean);
    return isMenuOpen.value || moreOpen.value || desktopAny || mobileAny;
});

useClickAway(
    headerRef,
    () => {
        isMenuOpen.value = false;
        moreOpen.value = false;
        closeAllDropdowns();
        closeAllMobileDropdowns();
    },
    {
        enabled: () => anyPopupOpen.value,
    },
);

const headerStyles = computed(() => {
    const bgEffect = isMenuOpen.value || opacity.value > 0.2;
    const alphaValue = isMenuOpen.value ? 0.95 : Math.min(opacity.value, 0.8);

    return {
        backgroundColor: `color-mix(in srgb, var(--md-sys-color-surface) ${alphaValue * 100}%, transparent)`,
        backdropFilter: bgEffect ? "blur(10px)" : "none",
        WebkitBackdropFilter: bgEffect ? "blur(10px)" : "none",
        borderBottom: bgEffect
            ? "1px solid color-mix(in srgb, var(--md-sys-color-outline-variant), transparent 80%)"
            : "1px solid transparent",
        boxShadow: bgEffect
            ? "0 4px 16px color-mix(in srgb, var(--md-sys-color-shadow), transparent 94%)"
            : "none",
    };
});

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const isActive = (link: NavLink) => {
    if ("children" in link) {
        return (
            link.children.some((child) => route.path === child.path) ||
            route.path === link.defaultPath
        );
    }
    if (link.path === "/") {
        return route.path === "/";
    }
    return route.path === link.path || route.path.startsWith(link.path + "/");
};

const {
    states: dropdownStates,
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
    closeAll: closeAllDropdowns,
} = desktopDropdown;

const {
    states: mobileDropdownStates,
    toggle: toggleMobileSubmenu,
    closeAll: closeAllMobileDropdowns,
} = mobileDropdown;

const handleScroll = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    scrollDirection.value = scrollPosition > lastScrollY.value ? "down" : "up";
    lastScrollY.value = scrollPosition;

    const rawOpacity = Math.min(scrollPosition / 100, 1);
    opacity.value = easeOutCubic(rawOpacity);

    if (route.path.startsWith("/archive/")) {
        if (scrollPosition > 120) {
            showArticleTitle.value = true;
        } else {
            showArticleTitle.value = false;
        }
    } else {
        showArticleTitle.value = false;
    }
};

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const closeMenu = () => {
    isMenuOpen.value = false;
    closeAllMobileDropdowns();
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("resize", scheduleRecompute);

    if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(scheduleRecompute);
        if (centerColRef.value) ro.observe(centerColRef.value);
    }

    watch(
        () => route.path,
        () => {
            moreOpen.value = false;
            scheduleRecompute();
        },
        { immediate: true },
    );

    handleScroll();
    scheduleRecompute();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);

    window.removeEventListener("resize", scheduleRecompute);
    ro?.disconnect();
    ro = null;
});
</script>

<style scoped>
@reference "tailwindcss";

header {
    will-change: background-color, backdrop-filter, border-bottom;
}

.nav-link-block {
    @apply relative flex transform cursor-pointer items-center overflow-hidden rounded-lg px-2 py-2 text-sm whitespace-nowrap transition-all duration-200 ease-out will-change-transform lg:px-4 lg:text-base;
    @apply before:absolute before:inset-0 before:z-[-1] before:scale-[0.8] before:rounded-lg before:opacity-0 before:backdrop-blur before:transition-all before:duration-300 before:ease-out;
    @apply before:origin-center;
    @apply hover:before:scale-100 hover:before:opacity-100;
    @apply before:bg-(--md-sys-color-primary-container)/40 dark:before:bg-(--md-sys-color-primary-container)/70;
    @apply hover:text-(--md-sys-color-primary);
}

.active-link {
    @apply bg-(--md-sys-color-secondary-container)/50 font-semibold text-(--md-sys-color-primary);
}

.nav-link-block span {
    position: relative;
    z-index: 1;
}

.group:hover .absolute.top-full {
    pointer-events: auto;
}

.group:hover::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 10px;
    background: transparent;
    z-index: 40;
}
</style>
