<template>
    <nav
        v-if="hasAny"
        class="anzu-prev-next-nav mt-10"
        :aria-label="t('common.items.prevNextNav')"
    >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NuxtLink
                v-if="prev"
                :to="prev.to"
                class="anzu-prev-next-nav__card group"
                :aria-label="`${t('common.actions.prevContent')}：${prev.title}`"
            >
                <div class="anzu-prev-next-nav__meta">
                    <span class="anzu-prev-next-nav__hint">
                        <span class="anzu-prev-next-nav__arrow" aria-hidden="true"
                            >←</span
                        >
                        {{ t("common.actions.prevContent") }}
                    </span>
                </div>
                <div class="anzu-prev-next-nav__title">
                    {{ prev.title }}
                </div>
            </NuxtLink>

            <NuxtLink
                v-if="next"
                :to="next.to"
                class="anzu-prev-next-nav__card group"
                :class="!prev ? 'sm:col-start-2' : ''"
                :aria-label="`${t('common.actions.nextContent')}：${next.title}`"
            >
                <div class="anzu-prev-next-nav__meta justify-start sm:justify-end">
                    <span class="anzu-prev-next-nav__hint">
                        {{ t("common.actions.nextContent") }}
                        <span class="anzu-prev-next-nav__arrow" aria-hidden="true"
                            >→</span
                        >
                    </span>
                </div>
                <div class="anzu-prev-next-nav__title text-left sm:text-right">
                    {{ next.title }}
                </div>
            </NuxtLink>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export interface AnzuPrevNextTarget {
    to: string;
    title: string;
}

const props = defineProps<{
    prev?: AnzuPrevNextTarget | null;
    next?: AnzuPrevNextTarget | null;
}>();

const { t } = useI18n();

const hasAny = computed(() => !!props.prev || !!props.next);
</script>

<style scoped>
@reference "tailwindcss";

.anzu-prev-next-nav__card {
    display: block;
    border-radius: 0.75rem;
    border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 40%, transparent);
    padding: 1rem;
    color: var(--md-sys-color-on-surface);
    background: transparent;
    box-shadow: none;
    transition:
        border-color 150ms ease,
        color 150ms ease;
}

.anzu-prev-next-nav__card:hover {
    border-color: color-mix(in srgb, var(--md-sys-color-primary) 70%, transparent);
    color: var(--md-sys-color-primary);
}

.anzu-prev-next-nav__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.anzu-prev-next-nav__hint {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--md-sys-color-on-surface);
}

.anzu-prev-next-nav__card:hover .anzu-prev-next-nav__hint {
    color: var(--md-sys-color-primary);
}

.anzu-prev-next-nav__arrow {
    font-weight: 700;
}

.anzu-prev-next-nav__card:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 3px;
}

.anzu-prev-next-nav__title {
    margin-top: 0.35rem;
    font-weight: 500;
    line-height: 1.5;
    word-break: break-word;
    color: var(--md-sys-color-on-surface-variant);
}

.anzu-prev-next-nav__card:hover .anzu-prev-next-nav__title {
    color: color-mix(in srgb, var(--md-sys-color-primary) 85%, var(--md-sys-color-on-surface));
}
</style>

