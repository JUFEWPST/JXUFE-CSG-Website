<script setup lang="ts">
import FlipToggle from '~/components/FlipToggle.vue';
import { onMounted, ref } from 'vue';

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});
</script>

<template>
    <div class="mt-15 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 flex justify-center">
            <FlipToggle class="w-[240px] h-[240px] hover:scale-105 transition-transform duration-300">
                <template #front>
                    <div class="font-bold mx-auto text-center text-5xl relative">
                        <client-only>
                            <div v-for="i in 5" :key="i"
                                class="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <div class="absolute text-pink-300 opacity-70 animate-float" :style="{
                                    left: `${Math.random() * 100}%`,
                                    animationDuration: `${5 + Math.random() * 10}s`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    fontSize: `${10 + Math.random() * 10}px`
                                }">
                                    ✿
                                </div>
                            </div>
                        </client-only>
                        <span class="text-blue-400 hover:text-blue-500 transition-colors">网安</span> *
                        <span class="text-pink-400 hover:text-pink-500 transition-colors">领域</span>
                        <div class="absolute -top-5 -left-4 text-2xl text-pink-300">✧</div>
                        <div class="absolute -top-5 -right-4 text-2xl text-orange-400">✧</div>
                        <div class="absolute -bottom-5 -left-4 text-2xl text-blue-300">✦</div>
                        <div class="absolute -bottom-5 -right-4 text-2xl text-red-300">✦</div>
                    </div>
                </template>
                <template #back>
                    <div class="relative w-full h-full">
                        <img src="~/assets/images/网安领域.webp" class="object-contain w-full h-full" />
                        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-sm">
                            <p>「欢迎来到网络安全的世界...」</p>
                        </div>
                    </div>
                </template>
            </FlipToggle>
        </div>

        <div class="flex flex-col box-border mb-12 space-y-12">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 100ms">
                <div class="absolute -right-10 -top-10 text-blue-100/70 dark:text-gray-700/80 text-9xl z-0">✧</div>
                <div class="absolute -left-5 -bottom-5 text-pink-100/70 dark:text-gray-700/80 text-7xl z-0">♡</div>

                <div class="relative z-10">
                    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                        <span class="w-2 h-8 bg-blue-500 mr-3 rounded-full"></span>
                        协会简介
                    </h2>
                    <div class="space-y-6">
                        <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span
                                class="font-bold text-[var(--color-accent-hover)]">江西财经大学网络安全协会</span>成立于2016年9月，协会的宗旨是想全校师生普及网络安全知识、培养网络安全技术人才、互相交流、共同进步。
                        </p>
                        <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            本社创立的初衷是为了一起<span
                                class="font-semibold text-[var(--color-accent-hover)]">学习交流网络安全知识，教授同学们有关网络安全的知识</span>，组织大家一起参加比赛，以及宣传和开展活动以增加同学对网络安全的浓厚兴趣。同时作为一个技术讨论的平台，我们为有兴趣和有能力的同学提供技交流方向的圈子。
                        </p>
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                            <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                                <span class="w-1.5 h-6 bg-pink-500 mr-2 rounded-full"></span>
                                协会下设部门
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div
                                    class="bg-blue-50/80 dark:bg-gray-600 p-3 rounded-lg hover:shadow-md transition-shadow">
                                    <h4 class="font-medium text-blue-700 dark:text-blue-300">技术部</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">负责技术研究、培训和比赛指导</p>
                                </div>
                                <div
                                    class="bg-pink-50/80 dark:bg-gray-600 p-3 rounded-lg hover:shadow-md transition-shadow">
                                    <h4 class="font-medium text-pink-700 dark:text-pink-300">组织部</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">负责活动策划和组织协调</p>
                                </div>
                                <div
                                    class="bg-purple-50/80 dark:bg-gray-600 p-3 rounded-lg hover:shadow-md transition-shadow">
                                    <h4 class="font-medium text-purple-700 dark:text-purple-300">宣传部</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">负责协会形象宣传和内容制作</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 200ms">
                <div
                    class="absolute -right-5 top-1/2 transform -translate-y-1/2 text-pink-100/70 dark:text-gray-700/80 text-8xl z-0">
                    ★</div>

                <div class="relative z-10">
                    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                        <span class="w-2 h-8 bg-pink-500 mr-3 rounded-full"></span>
                        加入我们
                    </h2>
                    <div class="flex flex-col md:flex-row items-center gap-8">
                        <div class="md:w-1/2 space-y-4 text-gray-700 dark:text-gray-300">
                            <p class="text-lg leading-relaxed">
                                无论您是否是本校学生，都可扫描<span class="md:hidden">下方</span><span
                                    class="hidden md:inline">右方</span>的二维码加入江财网安协会编外群与我们互动
                            </p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                加入我们，一起探索网络安全的奥秘，提升技能，参与精彩活动！
                            </p>
                            <div class="flex space-x-3 mt-4">
                                <a class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                                    href="https://qm.qq.com/q/qIC4fkPlbW" target="_blank">
                                    加入群聊
                                </a>
                            </div>
                        </div>
                        <div class="md:w-1/2 flex justify-center">
                            <div class="bg-white p-4 rounded-lg shadow-inner relative group">
                                <img src="/assets/images/qrcode.svg"
                                    class="w-48 h-48 object-contain transition-transform group-hover:scale-105"
                                    alt="江财网安协会编外群二维码" />
                                <div
                                    class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    一起做学院偶像！
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 0.7;
    }

    100% {
        transform: translateY(240px) rotate(360deg);
        opacity: 0;
    }
}

.animate-float {
    animation: float linear infinite;
}
</style>
