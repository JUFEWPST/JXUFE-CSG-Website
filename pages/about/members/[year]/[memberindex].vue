<template>
    <main
        class="bg-(--md-sys-color-surface-container-lowest) w-full px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto w-full max-w-6xl">
            <div class="mb-4 flex justify-center">
                <AnzuComboBox
                    v-model="selectedYear"
                    :items="yearOptions"
                    value-key="value"
                    label-key="label"
                    placeholder="选择届数"
                    search-placeholder="搜索届数..."
                    menu-width-class="w-48"
                    maxMenuHeight="10rem"
                    aria-label="Select year"
                />
            </div>
            <div class="mb-6 flex w-full items-center justify-between">
                <div class="w-16 flex justify-start">
                    <AnzuButton
                        v-if="prevMemberLink"
                        variant="tonal"
                        class="px-0! min-w-12! w-12!"
                        @click="goTo(prevMemberLink, 'prev')"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="h-6 w-6"
                        >
                            <path
                                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                            />
                        </svg>
                    </AnzuButton>
                </div>

                <div class="w-16 flex justify-end">
                    <AnzuButton
                        v-if="nextMemberLink"
                        variant="tonal"
                        class="px-0! min-w-12! w-12!"
                        @click="goTo(nextMemberLink, 'next')"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="h-6 w-6"
                        >
                            <path
                                d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                            />
                        </svg>
                    </AnzuButton>
                </div>
            </div>
            <div
                v-if="member"
                :key="uniqueKey"
                ref="memberPanelRef"
                class="member-panel mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 md:flex-row md:gap-12 lg:gap-16"
            >
                <div class="relative flex shrink-0 items-center justify-center">
                    <div
                        class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                    >
                        <svg
                            v-show="playPentagon"
                            class="pentagon-anim h-[160%] w-[160%] text-(--md-sys-color-primary)"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <polygon
                                points="50,2.4 97.6,37 79.4,92.6 20.6,92.6 2.4,37"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            />
                        </svg>
                    </div>
                    <div
                        class="relative z-10 h-40 w-40 overflow-hidden rounded-full bg-(--md-sys-color-surface-container-highest) md:h-56 md:w-56"
                    >
                        <img
                            v-if="member.avatar"
                            :src="member.avatar"
                            :alt="member.display || 'Avatar'"
                            class="h-full w-full object-cover"
                        />
                        <div
                            v-else
                            class="flex h-full w-full items-center justify-center text-4xl font-bold text-(--md-sys-color-on-surface-variant)"
                        >
                            {{ (member.display || "").charAt(0) }}
                        </div>
                    </div>
                </div>
                <div
                    class="z-10 flex max-w-lg flex-1 flex-col items-center text-center md:items-start md:text-left"
                >
                    <h1
                        class="text-2xl font-bold text-(--md-sys-color-on-surface) md:text-3xl"
                    >
                        {{ member.display }}
                    </h1>

                        <div class="mt-2">
                            <span
                                class="inline-flex items-center rounded-md bg-(--md-sys-color-primary-container) px-2 py-0.5 text-xs font-bold text-(--md-sys-color-primary)"
                            >
                                {{ member.position }}
                            </span>
                        </div>

                    <p
                        v-if="member.message"
                        class="mt-4 text-base leading-relaxed text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ member.message }}
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "#imports";
import gsap from "gsap";
import { membersArray } from "~/data/membersData";
import AnzuButton from "~/components/AnzuButton.vue";
import AnzuComboBox from "~/components/AnzuComboBox.vue";

definePageMeta({
    pageTransition: false,
    layoutTransition: false,
});

const route = useRoute();
const router = useRouter();

const navDirection = ref<"prev" | "next" | "">("");
const isNavigating = ref(false);

const memberPanelRef = ref<HTMLElement | null>(null);

const yearOptions = computed(() =>
    membersArray.map((item) => ({
        value: item.year,
        label: typeof item.year === "string" ? item.year : `${item.year}届`,
    })),
);

const initialYear = membersArray.find(
    (g) => String(g.year) === String(route.params.year),
)?.year;
const selectedYear = ref<string | number>(initialYear || "");

const uniqueKey = computed(
    () => `${route.params.year}-${route.params.memberindex}`,
);

const allMembers = computed(() =>
    membersArray.flatMap((group) =>
        group.members.map((m, i) => ({
            ...m,
            _year: group.year,
            _index: i,
        })),
    ),
);

const currentIndex = computed(() => {
    const year = route.params.year as string;
    const index = parseInt(route.params.memberindex as string);
    return allMembers.value.findIndex(
        (m) => String(m._year) === year && m._index === index,
    );
});

const member = computed(() => {
    if (currentIndex.value === -1) return null;
    return allMembers.value[currentIndex.value];
});

const prevMemberLink = computed(() => {
    if (currentIndex.value > 0) {
        const prev = allMembers.value[currentIndex.value - 1];
        if (prev) return { year: prev._year, index: prev._index };
    }
    return null;
});

const nextMemberLink = computed(() => {
    if (currentIndex.value < allMembers.value.length - 1) {
        const next = allMembers.value[currentIndex.value + 1];
        if (next) return { year: next._year, index: next._index };
    }
    return null;
});

const playPentagon = ref(false);
const triggerPentagon = async () => {
    playPentagon.value = false;
    await nextTick();
    setTimeout(() => {
        playPentagon.value = true;
    }, 50);
};

const animateIn = async (dir: "prev" | "next" | "") => {
    await nextTick();
    const el = memberPanelRef.value;
    if (!el) return;

    const fromX = dir === "next" ? 72 : dir === "prev" ? -72 : 0;

    gsap.killTweensOf(el);
    gsap.fromTo(
        el,
        { opacity: 0, x: fromX },
        { opacity: 1, x: 0, duration: 0.65, ease: "power3.out" },
    );
};

const animateOut = (dir: "prev" | "next" | "") =>
    new Promise<void>((resolve) => {
        const el = memberPanelRef.value;
        if (!el) return resolve();

        const toX = dir === "next" ? -72 : dir === "prev" ? 72 : 0;

        gsap.killTweensOf(el);
        gsap.to(el, {
            opacity: 0,
            x: toX,
            duration: 0.35,
            ease: "power3.in",
            onComplete: () => resolve(),
        });
    });

watch(selectedYear, async (newVal) => {
    if (newVal && String(newVal) !== String(route.params.year)) {
        navDirection.value = "";
        isNavigating.value = true;
        await animateOut("");
        await router.push(`/about/members/${newVal}/0`);
    }
});

watch(
    () => route.params.year,
    (newYear) => {
        if (newYear && String(selectedYear.value) !== String(newYear)) {
            const match = membersArray.find(
                (g) => String(g.year) === String(newYear),
            );
            if (match) selectedYear.value = match.year;
        }
    },
);

// Navigation
const goTo = async (
    target: { year: string | number; index: number },
    direction: "prev" | "next",
) => {
    if (isNavigating.value) return;
    navDirection.value = direction;
    isNavigating.value = true;

    await animateOut(direction);
    await router.push(`/about/members/${target.year}/${target.index}`);
};

watch(
    uniqueKey,
    async () => {
        await triggerPentagon();
        await animateIn(navDirection.value);
        isNavigating.value = false;
    },
    { immediate: true },
);
</script>

<style scoped>
@import "tailwindcss";

.member-panel {
    width: 100%;
    will-change: transform, opacity;
}

.pentagon-anim {
    animation: zoom-out 0.8s ease-out forwards;
}

@keyframes zoom-out {
    0% {
        transform: scale(0.6) rotate(0deg);
        opacity: 0.8;
        stroke-width: 4px;
    }
    100% {
        transform: scale(1.5) rotate(36deg);
        opacity: 0;
        stroke-width: 1px;
    }
}
</style>
