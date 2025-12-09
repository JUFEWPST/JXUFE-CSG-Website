<template>
    <div class="relative">
        <div
            class="max-h-[calc(100vh-7rem)] overflow-y-auto p-2 md:p-3 transition-all duration-300 ease-in-out text-(--md-sys-color-on-surface-variant)"
            id="toc-container"
            aria-labelledby="toc-title"
            role="navigation"
        >
            <div v-if="items.length" class="flex items-center mb-2">
                <h2
                    id="toc-title"
                    class="font-bold text-lg text-(--md-sys-color-primary)"
                >
                    {{ t("common.items.toc") }}
                </h2>
            </div>

            <ul class="list-none p-0 m-0 space-y-1">
                <li
                    v-for="item in items"
                    :key="item.id"
                    class="my-0.5 leading-snug overflow-hidden text-ellipsis min-w-0"
                >
                    <a
                        @click="scrollTo(item.id)"
                        :class="getLinkClasses(item)"
                        :title="item.text"
                        :aria-current="activeId === item.id ? 'location' : undefined"
                    >
                        {{ item.text }}
                    </a>
                </li>
            </ul>
            <div v-if="items.length === 0" class="text-(--md-sys-color-on-surface-variant) text-sm italic mt-2">
                NULL
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import slugify from 'slugify';
import type { TocItem } from '~/types/tocitems';

const HEADING_SELECTOR = 'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]';
const ALL_HEADINGS_SELECTOR = 'h1, h2, h3, h4, h5, h6';
const { t } = useI18n()

const props = defineProps<{
    items: TocItem[]
    markdownRenderRef: { $el: HTMLElement };
}>()

function getHeadingSelector() {
    if (!props.markdownRenderRef) {
        return [];
    }
    return props.markdownRenderRef.$el.querySelectorAll(
        HEADING_SELECTOR
    );
}

const activeId = ref('')

const getLinkClasses = (item: TocItem) => {
    const baseClasses = 'block py-1.5 px-2 md:px-3 no-underline rounded-full text-sm transition-colors cursor-pointer whitespace-normal break-words';
    const activeClasses = activeId.value === item.id
        ? 'bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) font-medium'
        : 'text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container)';

    return `${baseClasses} ${activeClasses}`;
}

async function scrollTo(idOrText: string) {
    if (!idOrText) return;
    let element = document.getElementById(idOrText);

    if (!element) {
        const headings = Array.from(document.querySelectorAll(ALL_HEADINGS_SELECTOR)) as HTMLElement[];
        const matchedHeading = headings.find(heading => {
            const headingText = heading.textContent?.trim() || '';
            return (
                headingText === idOrText ||
                heading.id === slugify(idOrText, { lower: true }) ||
                headingText.includes(idOrText)
            );
        });

        if (matchedHeading) {
            if (!matchedHeading.id) {
                matchedHeading.id = slugify(matchedHeading.textContent || '', {
                    lower: true,
                    strict: true,
                    locale: 'zh'
                });
            }
            element = matchedHeading;
        }
    }

    if (element) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const targetPosition = elementPosition - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        activeId.value = element.id;
    } else {
        console.warn(`无法定位到目标元素: ${idOrText}`);
    }
}

function handleScroll() {
    const headings = getHeadingSelector();
    let current = '';
    let closestDistance = Infinity;

    headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100);

        if (rect.top <= 120 && distance < closestDistance) {
            closestDistance = distance;
            current = heading.id;
        }
    });

    if (current) {
        activeId.value = current;
    }
}

const scrollHandler = () => handleScroll();

onMounted(() => {
    window.addEventListener('scroll', scrollHandler, { passive: true });
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandler);
});
</script>
