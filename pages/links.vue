<template>
    <div class="mt-15">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-3">
                相关链接
            </h1>
        </div>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
            <section class="mb-16">
                <div class="flex items-center mb-6 text-gray-800 dark:text-white">
                    <HomeIcon class="w-10 h-10 mr-3" />
                    <h2 class="text-2xl font-bold ">江财官方</h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <a v-for="link in Links" :key="link.url" :href="link.url" target="_blank"
                        class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-700 ease-in-out hover:shadow-lg ">
                        <div class="p-5 flex flex-col h-full">
                            <div
                                class="w-12 h-12 rounded-lg border-2 border-gray-100 dark:border-gray-700 mb-4 overflow-hidden">
                                <img :src="link.icon || `${link.url}/favicon.ico`" alt="{{ link.name }} 图标"
                                    class="w-full h-full object-contain">
                            </div>
                            <h3
                                class="font-semibold text-lg text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {{ link.name }}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">{{ link.url }}</p>
                            <div
                                class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">→ 访问</span>
                                <ArrowRightIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </a>
                </div>
            </section>
            <section>
                <div class="flex items-center mb-6 text-gray-800 dark:text-white">
                    <HeartIcon class="w-10 h-10 mr-3" />
                    <h2 class="text-2xl font-bold">友情链接</h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <a v-for="link in fLinks" :key="link.url" :href="link.url" target="_blank"
                        class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-700 ease-in-out hover:shadow-lg">
                        <div class="p-5 flex flex-col h-full">
                            <div
                                class="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-700 mb-4 overflow-hidden">
                                <img :src="link.icon || `${link.url}/favicon.ico`" :alt="`${link.name} 图标`"
                                    class="w-full h-full object-cover">
                            </div>
                            <h3
                                class="font-semibold text-lg text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {{ link.name }}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">{{ link.url }}</p>
                            <div
                                class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">→ 访问</span>
                                <ArrowRightIcon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import {
    HomeIcon,
    HeartIcon,
    ArrowRightIcon
} from '@heroicons/vue/24/outline';

const official_icon = 'https://www.jxufe.edu.cn/favicon.ico';
const Links = [
    { name: '江西财经大学官网', url: 'https://www.jxufe.edu.cn/' },
    { name: '江西财经大学计算机与人工智能学院', url: 'http://cai.jxufe.edu.cn/' },
    { name: '江西财经大学本科招生网', url: 'https://zsjy.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学迎新网', url: 'http://hello.jxufe.edu.cn/', icon: official_icon }
];
const fLinks = [
    { name: '秋雨样大人', url: 'https://amqyy.cn/', icon: 'https://avatars.githubusercontent.com/u/60593418?v=4' },
    { name: 'Heaven', url: 'https://dearheaven.cn', icon: 'https://pic-bed.dearheaven.cn/img/touxiang.jpg' }
];

onMounted(() => {
    const cards = document.querySelectorAll('a');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => card.style.opacity = '1', 50 * index);
        setTimeout(() => card.style.transform = 'translateY(0)', 50 * index);
    });
});

useHead({
    title: '相关链接 - 江西财经大学网络安全协会'
});
</script>

<style scoped>
:root {
    --color-bg: #ffffff;
    --color-text: #333333;
    --color-card-bg: #ffffff;
    --color-card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dark {
    --color-bg: #121212;
    --color-text: #f5f5f5;
    --color-card-bg: #1e1e1e;
    --color-card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
</style>