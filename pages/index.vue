<template>
    <main>
        <section
            class="min-h-screen relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#121212] dark:to-[#181919] flex flex-col items-center justify-center px-4">
            <div class="text-center space-y-4 transform transition-all duration-500 hover:scale-105">
                <h1 class="text-5xl md:text-6xl text-gray-900 dark:text-white font-bold tracking-wide">
                    <AnimationTypingCursor text="江西财经大学" :blink-cursor="false" :show-cursor="false" :start-delay="100">
                    </AnimationTypingCursor>
                </h1>
                <h2 class="text-4xl md:text-5xl font-semibold text-[var(--color-accent-text)] bg-clip-text">
                    <AnimationTypingCursor text="网络安全协会" :start-delay="100"></AnimationTypingCursor>
                </h2>
            </div>
            <div class="absolute bottom-10 flex flex-col items-center">
                <p class="text-xl font-bold mb-2 animate-pulse">共筑网络安全 坚守网络防线</p>
                <AnimationScrollDown />
            </div>
        </section>
        <section
            class="sm:h-auto md:min-h-screen bg-gradient-to-br relative from-blue-50 to-white dark:from-[#121212] dark:to-[#181919] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:py-10 gap-4 sm:gap-6 md:gap-8 md:flex-row box-border">
            <div class="w-full max-w-screen-sm md:max-w-none md:w-1/3 flex justify-center">
                <h3
                    class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white p-3 sm:p-4 border-b-4 border-[var(--color-primary)]">
                    关于我们
                </h3>
            </div>
            <div
                class="w-full max-w-screen-sm md:max-w-2xl md:w-1/2 bg-white dark:bg-[#1E1E1E] p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mb-4 md:mb-0">
                <p class="text-base sm:text-lg text-gray-700 dark:text-white leading-relaxed">
                    <span
                        class="font-bold text-[var(--color-accent-hover)]">江西财经大学网络安全协会</span>成立于2016年9月，协会的宗旨是想全校师生普及网络安全知识、培养网络安全技术人才、互相交流、共同进步。
                </p>
                <p class="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-[#E5E5E5] leading-relaxed">
                    本社创立的初衷是为了一起<span
                        class="font-semibold text-[var(--color-accent-hover)]">学习交流网络安全知识，教授同学们有关网络安全的知识</span>，组织大家一起参加比赛，以及宣传和开展活动以增加同学对网络安全的浓厚兴趣。同时作为一个技术讨论的平台，我们为有兴趣和有能力的同学提供技交流方向的圈子。
                </p>
                <NuxtLink to="/about"
                    class="mt-4 inline-block text-sm font-bold text-[var(--color-accent-hover)] transition-colors duration-200 relative group">
                    更多
                    <span
                        class="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 dark:bg-gray-600 group-hover:w-full transition-all duration-300"></span>
                </NuxtLink>
                <div class="mt-4 sm:mt-6">
                    <h4 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2 dark:text-[#E5E5E5]">参与比赛:</h4>
                    <div class="flex flex-wrap gap-1 sm:gap-2">
                        <span
                            class="px-2 sm:px-3 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary-pressed)] rounded-full text-xs sm:text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">ISCC</span>
                        <span
                            class="px-2 sm:px-3 py-1 bg-[#f7fbff] text-[var(--color-primary-pressed)] rounded-full text-xs sm:text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">CISCN</span>
                        <span
                            class="px-2 sm:px-3 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary-pressed)] rounded-full text-xs sm:text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">联合比赛</span>
                        <span
                            class="px-2 sm:px-3 py-1 bg-[var(--color-primary-bg)] text-[var(--color-primary-pressed)] rounded-full text-xs sm:text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">校园挖洞活动</span>
                    </div>
                </div>
            </div>
            <div class="absolute w-full flex justify-center bottom-1 sm:bottom-0.5">
                <NuxtLink to="/archive"
                    class="text-base sm:text-xl font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group">
                    查看更多动态 >>
                    <span
                        class="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 dark:bg-gray-600 group-hover:w-full transition-all duration-300"></span>
                </NuxtLink>
            </div>
        </section>
    </main>
</template>

<script lang="ts" setup>
useHead({
    title: '江西财经大学网络安全协会'
})
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
