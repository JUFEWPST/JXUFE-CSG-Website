<template>
    <div
        class="relative w-full min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] overflow-x-hidden md:overflow-hidden bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface)"
    >
        <div class="absolute inset-0 pointer-events-none select-none z-0">
            <div
                class="absolute top-0 right-1/4 w-px h-full bg-(--md-sys-color-outline-variant) opacity-15"
            ></div>
            <div
                class="absolute bottom-1/4 left-0 w-full h-px bg-(--md-sys-color-outline-variant) opacity-15"
            ></div>
            <div
                class="absolute top-10 left-6 md:left-12 w-20 h-0.5 bg-(--md-sys-color-primary) opacity-70"
            ></div>
            <div
                class="absolute bottom-10 right-6 md:right-12 w-24 h-0.5 bg-(--md-sys-color-secondary) opacity-50"
            ></div>
        </div>
        <div
            class="absolute top-8 left-4 md:left-12 z-50 flex items-center gap-4"
        >
            <NuxtLink to="/about/members/">
                <AnzuButton variant="text">
                    <template #default>
                        <div class="flex items-center gap-2">
                            <span class="text-lg leading-none">←</span>
                            <span
                                class="font-bold tracking-widest uppercase text-xs"
                                >{{ t("common.actions.back") }}</span
                            >
                        </div>
                    </template>
                </AnzuButton>
            </NuxtLink>
        </div>
        <div class="md:hidden absolute top-12 right-4 z-50 flex gap-2">
            <AnzuButton
                :disabled="!prevLink"
                @click="prevLink && navigate(prevLink, 'prev')"
            >
                <span class="text-lg leading-none">←</span>
            </AnzuButton>
            <AnzuButton
                :disabled="!nextLink"
                @click="nextLink && navigate(nextLink, 'next')"
            >
                <span class="text-lg leading-none">→</span>
            </AnzuButton>
        </div>
        <div
            class="hidden md:flex absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-50"
        >
            <AnzuButton
                :disabled="!prevLink"
                @click="prevLink && navigate(prevLink, 'prev')"
                aria-label="Previous Member"
            >
                <span class="text-2xl leading-none">←</span>
            </AnzuButton>
        </div>
        <div
            class="hidden md:flex absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-50"
        >
            <AnzuButton
                :disabled="!nextLink"
                @click="nextLink && navigate(nextLink, 'next')"
                aria-label="Next Member"
            >
                <span class="text-2xl leading-none">→</span>
            </AnzuButton>
        </div>
        <div class="relative w-full z-10 px-4 md:px-8 py-8 md:py-0">
            <div
                class="content-shell w-full max-w-7xl mx-auto md:min-h-[calc(100vh-64px)] md:flex md:items-center"
            >
                <Transition
                    :css="false"
                    @enter="onEnter"
                    @leave="onLeave"
                    mode="out-in"
                >
                    <div
                        v-if="member"
                        :key="uniqueKey"
                        class="member-scene relative w-full h-auto md:w-full"
                    >
                        <div
                            class="member-frame flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
                        >
                            <div
                                class="visual-col w-full h-auto md:h-full md:w-1/2 relative flex flex-col items-center justify-center py-2 px-2 sm:px-4"
                            >
                                <div
                                    class="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-104 lg:h-104 shadow-xl skew-x-0 md:-skew-x-6 transform transition-all duration-700 bg-(--md-sys-color-surface-container-high) border border-(--md-sys-color-outline-variant)"
                                >
                                    <div
                                        class="absolute top-3 left-3 right-3 bottom-3 border border-(--md-sys-color-outline-variant)/50 z-20 pointer-events-none"
                                    ></div>
                                    <div
                                        class="absolute -bottom-3 left-6 w-20 h-0.5 bg-(--md-sys-color-primary) opacity-70"
                                    ></div>
                                    <img
                                        v-if="member.avatar"
                                        :src="member.avatar"
                                        class="w-full h-full object-cover skew-x-0 md:skew-x-6 scale-105"
                                        style="
                                            filter: grayscale(20%)
                                                contrast(110%);
                                        "
                                    />
                                    <div
                                        v-else
                                        class="w-full h-full flex items-center justify-center text-8xl font-black text-(--md-sys-color-surface-variant) skew-x-0 md:skew-x-6 select-none"
                                    >
                                        {{
                                            member.display
                                                ? member.display[0]
                                                : ""
                                        }}
                                    </div>
                                </div>
                                <div
                                    class="absolute bottom-6 left-6 md:bottom-12 md:left-0 opacity-10 pointer-events-none select-none"
                                >
                                    <span
                                        class="block text-9xl font-black leading-none tracking-tighter text-(--md-sys-color-on-surface-variant)"
                                        >{{ currentYear }}</span
                                    >
                                </div>
                            </div>
                            <div
                                class="info-col flex-1 h-auto md:h-full relative flex flex-col justify-start md:justify-center px-4 md:px-12 lg:px-16 mt-0"
                            >
                                <div class="max-w-xl">
                                    <div
                                        class="meta-row flex items-center gap-4 mb-3 md:mb-6"
                                    >
                                        <span
                                            class="w-16 h-0.5 bg-(--md-sys-color-primary)"
                                        ></span>
                                        <span
                                            class="text-sm font-bold tracking-[0.25em] uppercase text-(--md-sys-color-primary)"
                                            >{{ member.position }}</span
                                        >
                                    </div>

                                    <h1
                                        class="name-title text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-10 tracking-tighter leading-tight text-(--md-sys-color-on-surface)"
                                    >
                                        {{ member.display }}
                                    </h1>

                                    <div class="relative">
                                        <div
                                            class="quote-text px-5 py-4 md:px-6 md:py-5 bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary)"
                                        >
                                            <p
                                                class="text-lg md:text-xl leading-relaxed font-bold"
                                            >
                                                {{ member.message || "..." }}
                                            </p>
                                            <div
                                                v-if="member.contact"
                                                class="contact-line mt-4 flex items-center gap-2 text-sm font-mono text-(--md-sys-color-on-primary)/80"
                                            >
                                                <span class="opacity-50"
                                                    >></span
                                                >
                                                {{ member.contact }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// @ts-ignore
import { gsap } from "gsap";
import { membersArray } from "@/data/membersData";
import AnzuButton from "@/components/AnzuButton.vue";

definePageMeta({
    pageTransition: false,
    layoutTransition: false,
    key: "member-detail-fixed-key", // Force reuse of component to allow internal transitions
});

const route = useRoute();
const router = useRouter();
const { t } = useI18n(); // Standard
const direction = ref(1);

// --- Data Logic ---

const currentYear = computed(() => route.params.year as string);
const currentMemberIndex = computed(() => Number(route.params.memberindex));
const uniqueKey = computed(
    () => `${currentYear.value}-${currentMemberIndex.value}`,
);

const memberListGroup = computed(() =>
    membersArray.find((g) => String(g.year) === currentYear.value),
);
const memberList = computed(() => memberListGroup.value?.members || []);
const member = computed(() => memberList.value[currentMemberIndex.value]);

// --- Navigation Flattening ---
const allMembers = computed(() => {
    return membersArray.flatMap((group) =>
        group.members.map((m, idx) => ({
            ...m,
            _year: group.year,
            _index: idx,
        })),
    );
});

const globalIndex = computed(() => {
    return allMembers.value.findIndex(
        (m) =>
            String(m._year) === String(currentYear.value) &&
            m._index === currentMemberIndex.value,
    );
});

const prevLink = computed(() => {
    if (globalIndex.value > 0) {
        const prev = allMembers.value[globalIndex.value - 1];
        if (!prev) {
            return null;
        }
        return `/about/members/${prev._year}/${prev._index}`;
    }
    return null;
});

const nextLink = computed(() => {
    if (
        globalIndex.value !== -1 &&
        globalIndex.value < allMembers.value.length - 1
    ) {
        const next = allMembers.value[globalIndex.value + 1];
        if (!next) {
            return null;
        }
        return `/about/members/${next._year}/${next._index}`;
    }
    return null;
});

const navigate = (path: string, dir: "prev" | "next") => {
    direction.value = dir === "next" ? 1 : -1;
    router.push(path);
};

// --- Animations ---

const onEnter = (el: Element, done: () => void) => {
    const isNext = direction.value === 1;
    const frame = el.querySelector(".member-frame");

    if (!frame) {
        done();
        return;
    }

    gsap.set(frame, {
        opacity: 0,
        xPercent: isNext ? 10 : -10,
        scale: 0.995,
    });

    const timeline = gsap.timeline({ onComplete: done });

    timeline.to(frame, {
        opacity: 1,
        xPercent: 0,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
    });

    // Content stagger animation (PV-like)
    const visual = el.querySelector(".visual-col");
    const info = el.querySelector(".info-col");
    const meta = el.querySelector(".meta-row");
    const title = el.querySelector(".name-title");
    const quote = el.querySelector(".quote-text");
    const contact = el.querySelector(".contact-line");

    gsap.from(visual, {
        opacity: 0,
        x: isNext ? 24 : -24,
        duration: 0.5,
        delay: 0.08,
        ease: "power2.out",
    });

    gsap.from([meta, title, quote, contact], {
        opacity: 0,
        y: 10,
        duration: 0.45,
        stagger: 0.08,
        delay: 0.18,
        ease: "power2.out",
    });
};

const onLeave = (el: Element, done: () => void) => {
    const isNext = direction.value === 1;
    const frame = el.querySelector(".member-frame");

    if (!frame) {
        done();
        return;
    }

    gsap.to(frame, {
        opacity: 0,
        xPercent: isNext ? -8 : 8,
        scale: 0.992,
        duration: 0.5,
        ease: "power2.in",
        onComplete: done,
    });
};
</script>

<style scoped></style>
