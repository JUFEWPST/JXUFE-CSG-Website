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
                        class="group relative rounded-xl box-border overflow-hidden shadow-md MAOutlined"
                        :title="link.desc">
                        <div class="p-5 flex flex-col h-full">
                            <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 mb-4 overflow-hidden">
                                <img :src="link.icon || `${link.url}/favicon.ico`" :alt="`${link.name} 图标`"
                                    class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-95" />
                            </div>
                            <h3 class="font-semibold text-lg mb-2">
                                {{ link.name }}
                            </h3>
                            <div v-if="link.desc" class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                {{ link.desc }}
                            </div>
                            <div
                                class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span
                                    class="text-sm text-gray-500 dark:text-gray-400 mr-2">{{ link.droptext || '访问' }}</span>
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
                        class="group relative transition-all rounded-xl overflow-hidden shadow-md MAOutlined">
                        <div class="p-5 flex flex-col h-full">
                            <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 mb-4 overflow-hidden">
                                <img :src="link.icon || `${link.url}/favicon.ico`" :alt="`${link.name} 图标`"
                                    class="w-full h-full object-cover transition-transform duration-1200 group-hover:rotate-360" />
                            </div>
                            <h3 class="font-semibold text-lg mb-2">
                                {{ link.name }}
                            </h3>
                            <div class="flex flex-wrap gap-1">
                                <div v-for="(tag, index) in link.tags" :key="index"
                                    class="px-2 py-1 rounded text-xs font-medium whitespace-nowrap text-white"
                                    :style="{ backgroundColor: useRandomColor(tag) }">
                                    {{ tag }}
                                </div>
                            </div>
                            <div
                                class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span
                                    class="text-sm text-gray-500 dark:text-gray-400 mr-2">{{ link.droptext || '访问' }}</span>
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
import { useRandomColor } from '@/composables/useRandomColor';
const official_icon = '/jxufe-logo.svg';
const Links = [
    { name: '江西财经大学官网', url: 'https://www.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学科技与信息化中心', url: 'https://nic.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学计算机与人工智能学院', url: 'https://cai.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学本科招生网', url: 'https://zsjy.jxufe.edu.cn/', icon: official_icon },
    { name: '江西财经大学迎新网', url: 'http://hello.jxufe.edu.cn/', icon: official_icon },
    {
        name: '江西财经大学程序设计竞赛协会', url: 'https://jxufe-acm.cn/', icon: '/avatar/程协图标.webp', droptext: '程协欢迎你！', desc: '写码码，拿奖奖，加分分，领钱钱'
    },
    {
        name: '江西财经大学计算机协会',
        url: 'https://qm.qq.com/q/QPvPyzxfk6',
        icon: '/avatar/jsjxh.webp',
        droptext: '即刻入群',
        desc: '计算机协会是面向新手小白教学的，激起学计算机的兴趣，教会大家如何学好计算机，还会涉及一些AI、脚本、插件等实用的电脑小技巧。计协分为5个部门宣传部、维修部、软件部、量化部、办公室，但教学是统一教学，所以在这你会学到基础但实用的计算机技巧。由于是面向小白教学，所以会带大家一步一步学好计算机。跟上计协的教学，期末高分so easy。来加入计协，让你感受什么是科技的力量。',
        tooltip: '计算机协会是面向新手小白教学的，激起学计算机的兴趣，教会大家如何学好计算机，还会涉及一些AI、脚本、插件等实用的电脑小技巧。计协分为5个部门宣传部、维修部、软件部、量化部、办公室，但教学是统一教学，所以在这你会学到基础但实用的计算机技巧。由于是面向小白教学，所以会带大家一步一步学好计算机。跟上计协的教学，期末高分so easy。来加入计协，让你感受什么是科技的力量。'
    },
    {
        name: '江西财经大学数智技术协会', url: 'https://www.jxufe-tech.top', icon: '/avatar/数智技术协会.avif', droptext: '数智技术协会欢迎你！', desc: '《赛博孔子的故事》'
    },
];
const fLinks = [
    { name: '秋雨样大人', url: 'https://amqyy.cn/', icon: '/avatar/qyy.avif' },
    { name: 'Heaven', url: 'https://dearheaven.cn', icon: 'https://pic-bed.dearheaven.cn/img/touxiang.webp' },
    {
        name: 'woodfish', url: 'https://www.woodfishhhh.xyz/', icon: 'https://pic1.imgdb.cn/item/682f3d1658cb8da5c807b704.jpg', droptext: '我喜欢你', tags: ['我喜欢喝雪碧', '全栈开发（with AI）']
    },
    {
        name: 'piterの小屋', url: 'https://npiter.de/', icon: 'https://upload-bbs.miyoushe.com/upload/2025/01/13/363839390/3b27ef57435c87542b43e4fecdabc040_3189688091243815374.png?x-oss-process=image//resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,png',
    },
];

useHead({
    title: '相关链接 - 江西财经大学网络安全协会',
    meta: [
        {
            name: 'description',
            content: '江西财经大学网络安全协会官方网站友链页.提供江财官方网站/校内社团链接及其他个人网站链接跳转.'
        },
        {
            name: "keywords",
            content: "友情链接,相关链接,学校官网,社团网站,个人网站"
        }
    ]
});
</script>

<style scoped>
.MAOutlined {
    outline: 0px solid #f7317364;
    transition: outline 0.1s ease-in-out;
}

.dark .MAOutlined {
    outline: 0.5px solid #6d6d6d;
    transition: outline 0.1s ease-in-out;
}

.MAOutlined:hover {
    outline: 4px solid #f7317364;
}
</style>