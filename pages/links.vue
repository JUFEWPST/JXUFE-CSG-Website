<template>
    <main class="mt-15 mb-6">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-3">
                相关链接
            </h1>
        </div>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <section>
                <div class="flex items-center mb-6">
                    <HomeIcon class="w-8 h-8 mr-3" />
                    <h2 class="text-2xl font-bold">
                        江财官方
                    </h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <a v-for="link in Links" :key="link.url" :href="link.url" target="_blank"
                        class="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md MAOutlined">
                        <div class="p-5 flex flex-col h-full">
                            <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-900 mb-4 overflow-hidden">
                                <img :src="link.icon || `${link.url}/favicon.ico`" :alt="`${link.name} 图标`"
                                    class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-95" />
                            </div>
                            <h3 class="font-semibold text-lg mb-2">
                                {{ link.name }}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                                {{ link.url }}
                            </p>
                            <div
                                class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">访问</span>
                                <ArrowRightIcon class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </a>
                </div>
            </section>
            <section>
                <div class="flex items-center mb-6">
                    <HeartIcon class="w-8 h-8 mr-3" />
                    <h2 class="text-2xl font-bold">
                        友情链接
                    </h2>
                </div>
                <div>
                    <p class="text-gray-400 mb-1.5">本页面提供的个人网站链接仅作信息分享，其内容与责任均由网站所有者自行承担，与本社团无关。</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <a v-for="link in fLinks" :key="link.url" :href="link.url" target="_blank"
                        class="group relative bg-white dark:bg-gray-900 transition-all rounded-xl overflow-hidden shadow-md MAOutlined">
                        <div class="p-5 flex flex-col h-full">
                            <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 mb-4 overflow-hidden">
                                <img :src="link.icon || `${link.url}/favicon.ico`" :alt="`${link.name} 图标`"
                                    class="w-full h-full object-cover transition-transform duration-1200 group-hover:rotate-360" />
                            </div>
                            <h3 class="font-semibold text-lg mb-2">
                                {{ link.name }}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                                {{ link.url }}
                            </p>
                            <div
                                class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">访问</span>
                                <ArrowRightIcon class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    </main>
</template>
<script lang="ts" setup>
import {
    HomeIcon,
    HeartIcon,
    ArrowRightIcon
} from '@heroicons/vue/24/outline';

const official_icon = '/jxufe-logo.svg';
const Links = [
    { name: '江西财经大学官网', url: 'https://www.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学计算机与人工智能学院', url: 'http://cai.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学本科招生网', url: 'https://zsjy.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学迎新网', url: 'http://hello.jxufe.edu.cn/', icon: official_icon }
];
const fLinks = [
    { name: '秋雨样大人', url: 'https://amqyy.cn/', icon: 'https://avatars.githubusercontent.com/u/60593418?v=4' },
    { name: 'Heaven', url: 'https://dearheaven.cn', icon: 'https://pic-bed.dearheaven.cn/img/touxiang.jpg' }
];

useHead({
    title: '相关链接 - 江西财经大学网络安全协会'
});
</script>

<style scoped>
.MAOutlined {
    outline: 0px solid #f7317364;
    transition: outline 0.15s ease-in-out;
}

.MAOutlined:hover {
    outline: 4px solid #f7317364;
}
</style>