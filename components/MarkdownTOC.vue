<template>
    <div class="relative">
        <button v-if="isCollapsed" @click="toggleToc"
            class="fixed md:sticky top-5 left-0 md:left-auto z-30 p-2 bg-white dark:bg-black  rounded-r-md shadow-md border border-l-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="展开目录" title="展开目录" aria-expanded="false" aria-controls="toc-container">
            <Bars3Icon class="w-5 h-5" />
        </button>

        <!-- 目录内容 -->
        <div v-show="!isCollapsed"
            class="sticky top-5 max-h-[calc(100vh-40px)] overflow-y-auto p-4 border-l bg-white dark:bg-[#1E1E1E] border-gray-200 transition-all duration-300 ease-in-out min-w-[250px]"
            :class="{
                'fixed top-0 left-0 w-72 h-screen bg-white z-40 shadow-lg p-5': isMobile,
                'ml-8': !isMobile
            }" :aria-hidden="isCollapsed" id="toc-container" aria-labelledby="toc-title" role="navigation">
            <div v-if="items.length" class="flex items-center justify-between mb-4">
                <h2 id="toc-title" class="font-bold text-lg">目录</h2>
                <button @click="toggleToc" class="p-1 rounded-md hover:bg-gray-100 transition-colors" aria-label="关闭目录"
                    aria-expanded="true" aria-controls="toc-container" title="关闭目录">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <ul class="list-none p-0 m-0 space-y-1">
                <li v-for="item in items" :key="item.id" :style="{ paddingLeft: `${(item.level - 1)}rem` }"
                    class="my-1 leading-snug overflow-hidden text-ellipsis transition-colors min-w-0">
                    <a @click="scrollTo(item.id)" :class="getLinkClasses(item)" :title="item.text"
                        :aria-current="activeId === item.id ? 'location' : undefined">
                        {{ item.text }}
                    </a>
                </li>
            </ul>
            <div v-if="items.length === 0" class="text-gray-500 dark:text-gray-200 text-sm italic">
                暂无目录项
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import slugify from 'slugify';
import type { TocItem } from '~/types/tocitems';
const HEADING_SELECTOR = 'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]';
const ALL_HEADINGS_SELECTOR = 'h1, h2, h3, h4, h5, h6';

const props = defineProps<{
    items: TocItem[]
    markdownRenderRef: { $el: HTMLElement };
}>()
function getHeadingSelector() {
    if (!props.markdownRenderRef) {
        // console.log("没有ReF")
        return [];
    }
    return props.markdownRenderRef.$el.querySelectorAll(
        'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
    );
}
const activeId = ref('')
const isCollapsed = ref(false)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 768)
const initialCollapseState = computed(() => isMobile.value);

function toggleToc() {
    isCollapsed.value = !isCollapsed.value
}

const getLinkClasses = (item: TocItem) => {
    const baseClasses = 'block py-1.5 px-2 no-underline rounded-md transition-colors hover:bg-purple-300 cursor-pointer whitespace-normal break-words overflow-visible';
    const activeClasses = activeId.value === item.id ? 'text-white font-medium bg-purple-400' : '';
    const levelClasses =
        item.level === 2 ? 'pl-4' :
            item.level === 3 ? 'pl-8' :
                item.level >= 4 ? 'pl-12' : '';

    return `${baseClasses} ${activeClasses} ${levelClasses}`;
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
        if (isMobile.value) {
            isCollapsed.value = true;
        }
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

function handleResize() {
    windowWidth.value = window.innerWidth;
    if (isMobile.value === false) {
        isCollapsed.value = false;
    }
}

const scrollHandler = () => handleScroll();
const resizeHandler = () => handleResize();

onMounted(() => {
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', resizeHandler);
    isCollapsed.value = initialCollapseState.value;
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('resize', resizeHandler);
});
</script>
