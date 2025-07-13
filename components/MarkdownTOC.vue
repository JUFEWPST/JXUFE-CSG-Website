<template>
    <div class="relative">
        <button v-if="isCollapsed" @click="toggleToc"
            class="fixed md:sticky top-5 left-0 md:left-auto z-30 p-2 bg-white dark:bg-black  rounded-r-md shadow-md border border-l-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="展开目录">
            <Bars3Icon class="w-5 h-5" />
        </button>

        <!-- 目录内容 -->
        <div v-show="!isCollapsed"
            class="sticky top-5 max-h-[calc(100vh-40px)] overflow-y-auto p-4 border-l bg-white dark:bg-[#1E1E1E] border-gray-200 transition-all duration-300 ease-in-out min-w-[250px]"
            :class="{
                'fixed top-0 left-0 w-72 h-screen bg-white z-40 shadow-lg p-5': isMobile,
                'ml-8': !isMobile
            }">
            <div v-if="items.length" class="flex items-center justify-between mb-4">
                <h2 class="font-bold text-lg">目录</h2>
                <button @click="toggleToc" class="p-1 rounded-md hover:bg-gray-100 transition-colors" aria-label="关闭目录">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <ul class="list-none pl-0 m-0 space-y-1">
                <li v-for="item in items" :key="item.id" :class="`pl-${(item.level - 1) * 4}`"
                    class="my-1 leading-snug whitespace-nowrap overflow-hidden text-ellipsis transition-colors min-w-0">
                    <a @click="scrollTo(item.id)"
                        class="block py-1.5 px-2 no-underline rounded-md transition-colors  hover:bg-purple-300 cursor-pointer whitespace-normal break-words overflow-visible"
                        :class="{
                            ' text-white font-medium bg-purple-400': activeId === item.id,
                            'pl-4': item.level === 2,
                            'pl-8': item.level === 3,
                            'pl-12': item.level >= 4
                        }" :title="item.text">
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

const props = defineProps<{
    items: TocItem[]
}>()

const activeId = ref('')
const isCollapsed = ref(false)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 768)

function toggleToc() {
    isCollapsed.value = !isCollapsed.value
}

async function scrollTo(idOrText: string) {
    if (!idOrText) return;

    await nextTick(); // 确保 DOM 更新完成

    let element = document.getElementById(idOrText);

    // 如果通过ID找不到，尝试通过文本内容查找
    if (!element) {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[];
        const matchedHeading = headings.find(heading => {
            const headingText = heading.textContent?.trim() || '';
            return (
                headingText === idOrText ||
                heading.id === slugify(idOrText, { lower: true }) ||
                headingText.includes(idOrText)
            );
        });

        if (matchedHeading) {
            // 如果找到匹配的标题但缺少ID，自动生成一个
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
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
    let current = ''
    let closestDistance = Infinity

    headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        const distance = Math.abs(rect.top - 100)

        if (rect.top <= 120 && distance < closestDistance) {
            closestDistance = distance
            current = heading.id
        }
    })

    if (current) {
        activeId.value = current
    }
}

function handleResize() {
    windowWidth.value = window.innerWidth
    if (!isMobile.value) {
        // 在桌面端默认展开
        isCollapsed.value = false
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    if (isMobile.value) {
        isCollapsed.value = true
    }
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
})
</script>
