<template>
    <footer class="bg-white border-t border-gray-200 py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="col-span-1">
                    <div class="flex items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-800">江财网络安全协会</h3>
                    </div>
                    <p class="text-gray-600 mb-4 leading-relaxed">
                        或许这里可以写一句话
                    </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h4 class="text-gray-800 font-medium mb-4">快速导航</h4>
                        <ul class="space-y-2">
                            <li v-for="link in navLinks" :key="link.name">
                                <a :href="link.url" class="text-gray-600 hover:text-gray-900 transition-colors">
                                    {{ link.name }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div>
                    <h4 class="text-gray-800 font-medium mb-4">联系我们</h4>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <MapPinIcon class="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                            <span class="text-gray-600">江西财经大学麦庐园校区</span>
                        </li>
                        <li class="flex items-center">
                            <EnvelopeIcon class="h-5 w-5 text-gray-500 mr-2" />
                            <span class="text-gray-600">email</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p class="text-gray-500 text-sm">©
                    {{ new Date().getFullYear() === 2025 ? `2025` : `2025-${new Date().getFullYear()}` }} 江西财经大学网络安全协会
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
