<template>
    <footer
        class="bg-white dark:bg-[#141414] border-t border-gray-200 dark:border-gray-700 py-8 relative overflow-hidden">
        <div class="container mx-auto px-4 relative">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="col-span-1">
                    <div class="flex items-center mb-4 group">
                        <h3 class="text-2xl font-bold">
                            江财网络安全协会
                        </h3>
                        <span class="ml-2 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">✧</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed relative">
                        也许在这可以写一句话
                    </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h4 class="text-gray-800 dark:text-gray-200 font-bold mb-4 flex items-center">
                            快速导航
                        </h4>
                        <ul class="space-y-3">
                            <li v-for="link in navLinks" :key="link.name">
                                <a :href="link.url"
                                    class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors flex items-center"
                                    target="_blank">
                                    {{ link.name }}
                                </a>
                            </li>
                            <li>
                                <NuxtLink to="/links"
                                    class="font-medium text-pink-600 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center">
                                    更多>>
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h4 class="text-gray-800 dark:text-gray-200 font-bold mb-4 flex items-center">联系我们</h4>
                    <ul class="space-y-4">
                        <li class="flex items-start group">
                            <div
                                class="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-gray-600 transition-colors">
                                <MapPinIcon class="flex-shrink-0 h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </div>
                            <span class="text-gray-600 dark:text-gray-400">江西财经大学麦庐园校区</span>
                        </li>
                        <li class="flex items-center group">
                            <div
                                class="w-8 h-8 rounded-full bg-pink-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-pink-200 dark:group-hover:bg-gray-600 transition-colors">
                                <EnvelopeIcon class="h-5 w-5 text-pink-500 dark:text-pink-400" />
                            </div>
                            <span class="text-gray-600 dark:text-gray-400">email</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center relative">
                <div
                    class="absolute -left-4 top-1/2 transform -translate-y-1/2 text-blue-300/50 dark:text-blue-700/50 text-xl">
                    ✦</div>
                <div
                    class="absolute -right-4 top-1/2 transform -translate-y-1/2 text-pink-300/50 dark:text-pink-700/50 text-xl">
                    ✦</div>
                <p class="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
                    © {{ new Date().getFullYear() === 2025 ? `2025` : `2025-${new Date().getFullYear()}` }}
                    江西财经大学网络安全协会
                </p>
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import {
    MapPinIcon,
    EnvelopeIcon,
} from '@heroicons/vue/24/outline'

const navLinks = [
    { name: '江西财经大学官网', url: 'https://www.jxufe.edu.cn/' },
    { name: '江西财经大学计算机与人工智能学院', url: 'http://cai.jxufe.edu.cn/' },
]
</script>
