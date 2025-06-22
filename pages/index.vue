<template>
    <div
        class="min-h-screen relative bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
        <div class="text-center space-y-4 transform transition-all duration-500 hover:scale-105">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-800 tracking-wide">
                <AnimationTypingCursor text="江西财经大学" :blink-cursor="false" :show-cursor="false"></AnimationTypingCursor>
            </h1>
            <h2 class="text-4xl md:text-5xl font-semibold text-[var(--color-accent-text)] bg-clip-text">
                <AnimationTypingCursor text="网络安全协会"></AnimationTypingCursor>
            </h2>
        </div>
        <div class="absolute bottom-10 flex flex-col items-center">
            <p class="text-2xl font-bold text-gray-700 mb-2 animate-pulse">信敏廉毅</p>
            <AnimationScrollDown />
        </div>
    </div>
    <div
        class="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col md:flex-row items-center justify-center p-8 gap-8">
        <div class="w-full md:w-1/3 flex justify-center">
            <h3
                class="text-4xl md:text-5xl font-bold text-gray-800 p-4 border-b-4 border-[var(--color-primary)] transform rotate-0 md:-rotate-3 hover:rotate-0 transition-transform duration-300">
                近期动态
            </h3>
        </div>
        <div class="w-full md:w-1/2 max-w-2xl">
            <ul class="space-y-4">
                <ArticleBlock v-for="(article, index) in recentArticles" :key="index" :linkto="article.link"
                    :title="article.title"  />
            </ul>
        </div>
    </div>

    <div
        class="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col md:flex-row items-center justify-center p-8 gap-8">
        <div class="w-full md:w-1/3 flex justify-center">
            <h3
                class="text-4xl md:text-5xl font-bold text-gray-800 p-4 border-b-4 border-[var(--color-primary)] transform rotate-0 md:rotate-3 hover:rotate-0 transition-transform duration-300">
                关于我们
            </h3>
        </div>
        <div class="w-full md:w-1/2 max-w-2xl bg-white p-8 rounded-xl shadow-lg">
            <p class="text-lg text-gray-700 leading-relaxed">
                <span
                    class="font-bold text-[var(--color-accent-hover)]">江西财经大学网络安全协会</span>成立于2016年9月，协会的宗旨是想全校师生普及网络安全知识、培养网络安全技术人才、互相交流、共同进步。
            </p>
            <p class="mt-4 text-lg text-gray-700 leading-relaxed">
                本社创立的初衷是为了一起<span
                    class="font-semibold text-[var(--color-accent-hover)]">学习交流网络安全知识，教授同学们有关网络安全的知识</span>，组织大家一起参加比赛，以及宣传和开展活动以增加同学对网络安全的浓厚兴趣。同时作为一个技术讨论的平台，我们为有兴趣和有能力的同学提供技交流方向的圈子。
            </p>
            <div class="mt-6">
                <h4 class="text-xl font-semibold text-gray-800 mb-2">参与比赛:</h4>
                <div class="flex flex-wrap gap-2">
                    <span
                        class="px-3 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary-pressed)] rounded-full text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">ISCC</span>
                    <span
                        class="px-3 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary-pressed)] rounded-full text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">CISCN</span>
                    <span
                        class="px-3 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary-pressed)] rounded-full text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">联合比赛</span>
                    <span
                        class="px-3 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary-pressed)] rounded-full text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">校园挖洞活动</span>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

const recentArticles = [
    { link: "/", title: "你好" },
    { link: "/", title: "Ciallo" },
    { link: "/", title: "和我一起 签订契约" },
    { link: "/", title: "成为魔法少女" },
    { link: "/", title: "一起建设网站吧" }
];
</script>

<style>
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.hover-float:hover {
    animation: float 2s ease-in-out infinite;
}
</style>
