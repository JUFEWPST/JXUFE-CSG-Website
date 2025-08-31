<script setup lang="ts">
import FlipToggle from '~/components/FlipToggle.vue';
import { onMounted, ref } from 'vue';
import { leadersData } from '~/data/leadersData';
import { membersArray } from '~/data/membersData';
const isMounted = ref(false);
const currentQuote = ref(0);

const quotes = [
    "太好听了吧！你打网安真的好好听啊，简直就是天籁！我刚才，听到你打网安了。我们以后一起打网安好不好？一起做学园偶像！",
    "放弃的话就到此为止了，但是，你可以改变命运()",
    "是我喜欢的协会"
];
useHead({
    title: "关于协会 - 江西财经大学网络安全协会",
    meta: [
        {
            name: 'description',
            content: '江西财经大学网络安全协会成立于2016年，致力于普及网络安全知识、培养技术人才。下设技术部、组织部、宣传部，拥有弱口令安全团队(WPST)，组织竞赛与交流活动，欢迎感兴趣的同学加入。'
        },
        {
            name: "keywords",
            content: "协会简介,发展历程,组织架构,协会宗旨,加入协会"
        }
    ]
})
onMounted(() => {
    isMounted.value = true;
    setInterval(() => {
        currentQuote.value = (currentQuote.value + 1) % quotes.length;
    }, 5000);
});

</script>

<template>
    <main class="mt-15 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 flex justify-center">
            <h1 class="hidden">关于协会</h1>
            <FlipToggle class="w-4/5 md:w-60 max-w-60 aspect-square hover:scale-110 transition-transform duration-300">
                <template #front>
                    <div class="font-bold mx-auto text-center text-3xl md:text-4xl lg:text-5xl  relative"
                        aria-label="江西财经大学网络安全协会 - 关于协会">
                        <client-only>
                            <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <template v-for="i in 8" :key="i">
                                    <div class="absolute text-pink-300 opacity-70 animate-float" :style="{
                                        left: `${Math.random() * 100}%`,
                                        top: `${-10 - Math.random() * 10}%`,
                                        animationDuration: `${5 + Math.random() * 10}s`,
                                        animationDelay: `${Math.random() * 5}s`,
                                        fontSize: `${10 + Math.random() * 15}px`,
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                        filter: `hue-rotate(${Math.random() * 60}deg)`
                                    }">
                                        {{ ['✿', '❀', '✽', '✼', '❁'][Math.floor(Math.random() * 5)] }}
                                    </div>
                                </template>
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
                        <img src="~/assets/images/网安领域.webp" class="object-contain w-full h-full" alt="网安*领域" />
                        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-sm">
                            <p>「欢迎来到网络安全的世界...」</p>
                        </div>
                    </div>
                </template>
            </FlipToggle>
        </div>

        <div class="flex flex-col box-border mb-12 space-y-12">
            <section
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
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
                        <div class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            同时，我们网安协会还有一支精湛的安全团队——弱口令安全团队(WPST)。这支团队深耕网络安全领域，在漏洞挖掘、攻防、安全策略等方面积累了丰富经验。
                        </div>
                    </div>
                </div>
            </section>
            <section
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden">
                <div class="absolute top-1/5 right-1/6 text-4xl text-purple-300 opacity-50">✭</div>
                <div class="absolute bottom-1/4 left-1/5 text-3xl text-orange-400 opacity-60">✧</div>
                <div class="absolute top-1/2 right-1/4 text-5xl text-teal-200 opacity-40">✦</div>
                <div class="absolute bottom-1/6 left-1/3 text-2xl text-rose-500 opacity-70">☆</div>
                <div class="absolute top-1/3 left-1/6 text-4xl text-indigo-400 opacity-50">✯</div>
                <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                    <span class="w-2 h-8 bg-amber-300 mr-3 rounded-full"></span>
                    历届负责人
                </h2>
                <NuxtLink to="/about/leaders" class="ml-5"><span
                        class="text-md font-bold text-gray-400 hover:text-black transition-colors duration-300">>>
                        列表形式</span></NuxtLink>
                <LeaderCarousel :leaders="leadersData" />
            </section>
            <section
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden">
                <div class="absolute top-1/5 right-1/6 text-4xl text-purple-300 opacity-50">✭</div>
                <div class="absolute bottom-1/4 left-1/5 text-3xl text-orange-400 opacity-60">✧</div>
                <div class="absolute top-1/2 right-1/4 text-5xl text-teal-200 opacity-40">✦</div>
                <div class="absolute bottom-1/6 left-1/3 text-2xl text-rose-500 opacity-70">☆</div>
                <div class="absolute top-1/3 left-1/6 text-4xl text-indigo-400 opacity-50">✯</div>
                <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                    <span class="w-2 h-8 bg-amber-300 mr-3 rounded-full"></span>
                    历届成员
                </h2>
                <NuxtLink to="/about/members" class="ml-5"><span
                        class="text-md font-bold text-gray-400 hover:text-black transition-colors duration-300">>>
                        列表形式</span></NuxtLink>
                <MembersCarousel :membersArray="membersArray" />
            </section>
            <h2 class="text-xl font-bold text-blue-400 text-center">数据努力收集中，若您是协会相关成员，烦请协助填写我们的收集表<NuxtLink
                    class="text-green-500" to="/archive/nvz60h0y8pj9opi1hyn9ysvb">[历届成员档案共建邀请]</NuxtLink>
            </h2>
            <section
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 300ms">
                <div class="absolute -left-5 -top-5 text-blue-100/70 dark:text-gray-700/80 text-7xl z-0">✦</div>
                <div class="absolute -right-5 -bottom-5 text-pink-100/70 dark:text-gray-700/80 text-7xl z-0">✧</div>
                <div class="absolute top-4 right-6 text-2xl text-yellow-400 opacity-60">☆</div>
                <div class="absolute bottom-4 left-6 text-2xl text-blue-400 opacity-60">☆</div>

                <div class="relative z-10">
                    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                        <span class="w-2 h-8 bg-purple-500 mr-3 rounded-full"></span>
                        协会成员荣誉
                    </h2>
                    <div class="space-y-8">
                        <div>
                            <h3
                                class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
                                <span class="w-1.5 h-6 bg-pink-500 mr-2 rounded-full"></span>
                                2025年
                            </h3>
                            <ul class="space-y-4">
                                <li class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full min-w-[40px] text-center group-hover:scale-110 transition-transform">国一</span>
                                    <span class="text-gray-700 dark:text-gray-300">22届ISCC全国大学生信息安全竞赛</span>
                                </li>
                                <li class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full min-w-[40px] text-center group-hover:scale-110 transition-transform">省二</span>
                                    <span class="text-gray-700 dark:text-gray-300">十六届蓝桥杯网络安全赛道</span>
                                </li>
                                <li class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full min-w-[40px] text-center group-hover:scale-110 transition-transform">省三</span>
                                    <span class="text-gray-700 dark:text-gray-300">十八届CISCN广东赛区</span>
                                </li>

                            </ul>
                        </div>
                        <div>
                            <h3
                                class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center">
                                <span class="w-1.5 h-6 bg-blue-500 mr-2 rounded-full"></span>
                                2024年
                            </h3>
                            <ul class="space-y-4">
                                <li class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full min-w-[40px] text-center group-hover:scale-110 transition-transform">国一</span>
                                    <span class="text-gray-700 dark:text-gray-300">21届ISCC全国大学生信息安全竞赛</span>
                                </li>
                                <li class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full min-w-[40px] text-center group-hover:scale-110 transition-transform">国二</span>
                                    <span class="text-gray-700 dark:text-gray-300">2024睿抗机器人开发者大赛(RAICOM)全国总决赛</span>
                                </li>
                                <li class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full min-w-[40px] text-center group-hover:scale-110 transition-transform">省二</span>
                                    <span class="text-gray-700 dark:text-gray-300">十五届蓝桥杯网络安全赛道</span>
                                </li>
                                <li class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full min-w-[40px] text-center group-hover:scale-110 transition-transform">省二</span>
                                    <span class="text-gray-700 dark:text-gray-300">第九届全国密码挑战赛</span>
                                </li>

                            </ul>
                        </div>
                    </div>
                    <div
                        class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p class="mt-1"> 我认为奇迹与魔法对谁都会带来幸福，是十分美好的事物。</p>
                    </div>
                </div>
            </section>
            <section
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 200ms">
                <div
                    class="absolute -right-5 top-1/2 transform -translate-y-1/2 text-pink-100/70 dark:text-gray-700/80 text-8xl z-0">
                    ★</div>
                <div class="absolute -left-4 bottom-4 text-yellow-300/60 text-4xl z-0">☆</div>

                <div class="relative z-10">
                    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                        <span class="w-2 h-8 bg-pink-500 mr-3 rounded-full"></span>
                        加入我们
                    </h2>

                    <div class="flex flex-col md:flex-row items-center gap-8">
                        <div class="md:w-1/2 space-y-4 text-gray-700 dark:text-gray-300">
                            <p class="text-lg leading-relaxed">
                                无论您是否是本校学生，都可扫描<span class="md:hidden">下方</span><span
                                    class="hidden md:inline">右方</span>的二维码加入2025年江财网安协会招新群与我们互动
                            </p>
                            <div class="bg-pink-50 dark:bg-gray-700 p-4 rounded-lg border-pink-400">
                                <div
                                    class="text-sm italic text-pink-700 dark:text-pink-300 transition-opacity duration-500 min-h-12">
                                    「{{ quotes[currentQuote] }}」
                                </div>
                            </div>
                            <div class="flex space-x-3 mt-4">
                                <a class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                                    href="https://qm.qq.com/q/v7pD9BL4Lm" target="_blank">
                                    加入群聊
                                </a>
                                <a class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors text-sm"
                                    href="#" @click.prevent="currentQuote = (currentQuote + 1) % quotes.length">
                                    换一句
                                </a>
                            </div>
                        </div>
                        <div class="md:w-1/2 flex justify-center">
                            <div class="bg-white p-4 rounded-lg shadow-inner relative group">
                                <img src="/assets/images/2025JXUFECGS.svg"
                                    class="w-48 h-48 object-contain transition-transform group-hover:scale-105"
                                    alt="2025年江财网安协会招新群二维码" />
                                <div
                                    class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    一起成为学院偶像！
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </main>
</template>
<style module>
@reference "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

.card {
    @apply bg-white dark: bg-gray-800 rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden;
}

@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }

    10% {
        opacity: 0.7;
    }

    90% {
        opacity: 0.7;
    }

    100% {
        transform: translateY(calc(100vh + 100px)) rotate(360deg);
        opacity: 0;
    }
}

.animate-float {
    animation-name: float;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
</style>