<script setup lang="ts">
import FlipToggle from '~/components/FlipToggle.vue';
import { onMounted, ref } from 'vue';
import { leadersData } from '~/data/leadersData';
import { honorsData, getLevelColor, getYearColor } from '~/data/honors'
import { membersArray } from '~/data/membersData';
import { usePageTitle } from '@/composables/usePageTitle';
const isMounted = ref(false);
const currentQuote = ref(0);
const { t } = useI18n()
const { setPageTitle } = usePageTitle()

setPageTitle('pages.about.index.title')

const quotes = [
    "太好听了吧！你打网安真的好好听啊，简直就是天籁！我刚才，听到你打网安了。我们以后一起打网安好不好？一起做学园偶像！",
    "放弃的话就到此为止了，但是，你可以改变命运()",
    "是我喜欢的协会",
    "协会可能会倒闭，但一定不会变质！（笑"
];
useHead(() => ({
    title: t('pages.about.index.meta.title'),
    meta: [
        { name: 'description', content: t('pages.about.index.meta.description') },
        { name: 'keywords', content: t('pages.about.index.meta.keywords') }
    ]
}))
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
            <h1 class="hidden">{{ t('pages.about.index.title') }}</h1>
            <FlipToggle class="w-4/5 md:w-60 max-w-60 aspect-square hover:scale-110 transition-transform duration-300">
                <template #front>
                    <div class="font-bold mx-auto text-center text-4xl md:text-5xl  relative"
                        :aria-label="t('pages.about.index.meta.title')">
                        <client-only>
                            <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <template v-for="i in 8" :key="i">
                                    <div class="absolute text-(--md-sys-color-tertiary) opacity-70 animate-float"
                                        :style="{
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
                        <span
                            class="text-(--md-sys-color-primary) hover:text-(--md-sys-color-primary) transition-colors">网安</span>
                        *
                        <span
                            class="text-(--md-sys-color-tertiary) hover:text-(--md-sys-color-tertiary) transition-colors">领域</span>
                        <div class="absolute -top-5 -left-4 text-2xl text-(--md-sys-color-secondary)">✧</div>
                        <div class="absolute -top-5 -right-4 text-2xl text-(--md-sys-color-error)">✧</div>
                        <div class="absolute -bottom-5 -left-4 text-2xl text-(--md-sys-color-primary)">✦</div>
                        <div class="absolute -bottom-5 -right-4 text-2xl text-(--md-sys-color-tertiary)">✦</div>
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
                class="bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 100ms">
                <div
                    class="absolute -right-10 -top-10 text-(--md-sys-color-primary-container)/70 dark:text-(--md-sys-color-surface-dim)/80 text-9xl z-0">
                    ✧</div>
                <div
                    class="absolute -left-5 -bottom-5 text-(--md-sys-color-tertiary-container)/70 dark:text-(--md-sys-color-surface-dim)/80 text-7xl z-0">
                    ♡</div>

                <div class="relative z-10">
                    <h2
                        class="text-3xl md:text-4xl font-bold mb-6 text-(--md-sys-color-on-surface) flex items-center">
                        <span class="w-2 h-8 bg-(--md-sys-color-primary) mr-3 rounded-full"></span>
                        {{ t('pages.about.index.intro.title') }}
                    </h2>
                    <div class="space-y-6">
                        <p class="text-lg text-(--md-sys-color-on-surface-variant) leading-relaxed">
                            <i18n-t keypath="pages.about.index.intro.p1" tag="span">
                                <template #default>
                                    <span
                                        class="font-bold text-(--md-sys-color-primary)">{{ t("meta.fullName") }}</span>
                                </template>
                            </i18n-t>
                        </p>
                        <p class="text-lg text-(--md-sys-color-on-surface-variant) leading-relaxed mb-4">
                            <i18n-t keypath="pages.about.index.intro.p2" tag="span">
                                <template #highlighted>
                                    <span
                                        class="font-bold text-(--md-sys-color-primary)">{{ t('pages.about.index.intro.highlightedText') }}</span>
                                </template>
                            </i18n-t>
                        </p>
                        <div
                            class="bg-(--md-sys-color-surface-container-low) dark:bg-(--md-sys-color-surface-container-high) p-4 rounded-lg shadow-inner">
                            <h3
                                class="text-xl font-semibold mb-3 text-(--md-sys-color-on-surface) flex items-center">
                                <span class="w-1.5 h-6 bg-(--md-sys-color-tertiary) mr-2 rounded-full"></span>
                                {{ t('pages.about.index.departments.title') }}
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div
                                    class="bg-(--md-sys-color-primary-container)/30 dark:bg-(--md-sys-color-secondary-container) p-3 rounded-lg hover:shadow-md transition-shadow">
                                    <h4 class="font-medium text-(--md-sys-color-on-surface)">
                                        {{ t('pages.about.index.departments.study.name') }}
                                    </h4>
                                    <p class="text-sm text-(--md-sys-color-on-surface-variant) mt-1">
                                        {{ t('pages.about.index.departments.study.desc') }}
                                    </p>
                                </div>
                                <div
                                    class="bg-(--md-sys-color-tertiary-container)/30 dark:bg-(--md-sys-color-secondary-container) p-3 rounded-lg hover:shadow-md transition-shadow">
                                    <h4 class="font-medium text-(--md-sys-color-on-surface)">
                                        {{ t('pages.about.index.departments.organization.name') }}
                                    </h4>
                                    <p class="text-sm text-(--md-sys-color-on-surface-variant) mt-1">
                                        {{ t('pages.about.index.departments.organization.desc') }}
                                    </p>
                                </div>

                                <div
                                    class="bg-(--md-sys-color-secondary-container)/30 dark:bg-(--md-sys-color-secondary-container) p-3 rounded-lg hover:shadow-md transition-shadow">
                                    <h4 class="font-medium text-(--md-sys-color-on-surface)">
                                        {{ t('pages.about.index.departments.publicity.name') }}
                                    </h4>
                                    <p class="text-sm text-(--md-sys-color-on-surface-variant) mt-1">
                                        {{ t('pages.about.index.departments.publicity.desc') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="text-lg text-(--md-sys-color-on-surface-variant) leading-relaxed">
                            {{ t('pages.about.index.intro.wpstIntro') }}
                        </div>
                    </div>
                </div>
            </section>
            <AnzuAlert type="info">
                {{ t('pages.about.members.dataCollectTip') }}<NuxtLink class="text-(--md-sys-color-primary)"
                    to="/archive/nvz60h0y8pj9opi1hyn9ysvb">
                    [{{ t('pages.about.members.archiveInvite') }}]</NuxtLink>
            </AnzuAlert>
            <section
                class="bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden">
                <div class="absolute top-1/5 right-1/6 text-4xl text-(--md-sys-color-secondary) opacity-50">✭</div>
                <div class="absolute bottom-1/4 left-1/5 text-3xl text-(--md-sys-color-tertiary) opacity-60">✧
                </div>
                <div class="absolute top-1/2 right-1/4 text-5xl text-(--md-sys-color-primary) opacity-40">✦</div>
                <div class="absolute bottom-1/6 left-1/3 text-2xl text-(--md-sys-color-error) opacity-70">☆</div>
                <div class="absolute top-1/3 left-1/6 text-4xl text-(--md-sys-color-secondary) opacity-50">✯</div>
                <h2 class="text-3xl md:text-4xl font-bold mb-6 text-(--md-sys-color-on-surface) flex items-center">
                    <span class="w-2 h-8 bg-(--md-sys-color-secondary) mr-3 rounded-full"></span>
                    {{ t('pages.about.index.members.leaders') }}
                </h2>
                <NuxtLink to="/about/leaders" class="ml-5"><span
                        class="text-md font-bold text-(--md-sys-color-outline) hover:text-(--md-sys-color-on-surface) transition-colors duration-300">>>
                        {{ t('pages.about.index.listmode') }}</span></NuxtLink>
                <LeaderCarousel :leaders="leadersData" />
            </section>
            <section
                class="bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden">
                <div class="absolute top-1/5 right-1/6 text-4xl text-(--md-sys-color-secondary) opacity-50">✭</div>
                <div class="absolute bottom-1/4 left-1/5 text-3xl text-(--md-sys-color-tertiary) opacity-60">✧
                </div>
                <div class="absolute top-1/2 right-1/4 text-5xl text-(--md-sys-color-primary) opacity-40">✦</div>
                <div class="absolute bottom-1/6 left-1/3 text-2xl text-(--md-sys-color-error) opacity-70">☆</div>
                <div class="absolute top-1/3 left-1/6 text-4xl text-(--md-sys-color-secondary) opacity-50">✯</div>
                <h2 class="text-3xl md:text-4xl font-bold mb-6 text-(--md-sys-color-on-surface) flex items-center">
                    <span class="w-2 h-8 bg-(--md-sys-color-secondary) mr-3 rounded-full"></span>
                    {{ t('pages.about.index.members.members') }}
                </h2>
                <NuxtLink to="/about/members" class="ml-5"><span
                        class="text-md font-bold text-(--md-sys-color-outline) hover:text-(--md-sys-color-on-surface) transition-colors duration-300">>>
                        {{ t('pages.about.index.listmode') }}</span></NuxtLink>
                <MembersCarousel :membersArray="membersArray" />
            </section>
            <section
                class="bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 300ms">
                <div
                    class="absolute -left-5 -top-5 text-(--md-sys-color-primary-container)/70 dark:text-(--md-sys-color-surface-dim)/80 text-7xl z-0">
                    ✦</div>
                <div
                    class="absolute -right-5 -bottom-5 text-(--md-sys-color-tertiary-container)/70 dark:text-(--md-sys-color-surface-dim)/80 text-7xl z-0">
                    ✧</div>
                <div class="absolute top-4 right-6 text-2xl text-(--md-sys-color-secondary) opacity-60">☆</div>
                <div class="absolute bottom-4 left-6 text-2xl text-(--md-sys-color-primary) opacity-60">☆</div>

                <div class="relative z-10">
                    <h2
                        class="text-3xl md:text-4xl font-bold mb-6 text-(--md-sys-color-on-surface) flex items-center">
                        <span class="w-2 h-8 bg-(--md-sys-color-secondary) mr-3 rounded-full"></span>
                        {{ t('pages.about.index.members.honors') }}
                    </h2>
                    <div class="space-y-8">
                        <div v-for="yearData in honorsData" :key="yearData.year">
                            <h3
                                class="text-xl font-semibold mb-4 text-(--md-sys-color-on-surface-variant) border-b pb-2 border-(--md-sys-color-outline-variant) flex items-center">
                                <span class="w-1.5 h-6 mr-2 rounded-full" :class="getYearColor(yearData.year)"></span>
                                {{ yearData.year }}
                            </h3>
                            <ul class="space-y-4">
                                <li v-for="(honor, index) in yearData.honors" :key="index"
                                    class="flex items-start group">
                                    <span
                                        class="px-2 py-1 mr-3 text-white text-xs font-bold rounded-full min-w-10 text-center group-hover:scale-110 transition-transform"
                                        :class="`bg-linear-to-r ${getLevelColor(honor.level)}`">
                                        {{ honor.level }}
                                    </span>
                                    <span
                                        class="text-(--md-sys-color-on-surface-variant)">{{ honor.description }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div
                        class="mt-6 pt-4 border-t border-(--md-sys-color-outline-variant) text-center text-sm text-(--md-sys-color-on-surface-variant)">
                        <p class="mt-1"> 我认为奇迹与魔法对谁都会带来幸福，是十分美好的事物。</p>
                    </div>
                </div>
            </section>
            <section
                class="bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 200ms">
                <div
                    class="absolute -right-5 top-1/2 transform -translate-y-1/2 text-(--md-sys-color-tertiary-container)/70 dark:text-(--md-sys-color-surface-dim)/80 text-8xl z-0">
                    ★</div>
                <div class="absolute -left-4 bottom-4 text-(--md-sys-color-secondary-container)/60 text-4xl z-0">☆
                </div>

                <div class="relative z-10">
                    <h2
                        class="text-3xl md:text-4xl font-bold mb-6 text-(--md-sys-color-on-surface) flex items-center">
                        <span class="w-2 h-8 bg-(--md-sys-color-tertiary) mr-3 rounded-full"></span>
                        {{ t('pages.about.index.joinUs.title') }}
                    </h2>

                    <div class="flex flex-col md:flex-row items-center gap-8">
                        <div class="md:w-1/2 space-y-4 text-(--md-sys-color-on-surface-variant)">
                            <p class="text-lg leading-relaxed">
                                <i18n-t keypath="pages.about.index.joinUs.scan_qr" tag="span">
                                    <span>
                                        <span class="md:hidden">{{ t("common.direction.down1") }}</span>
                                        <span class="hidden md:inline">{{ t("common.direction.right1") }}</span>
                                    </span>

                                </i18n-t>
                            </p>
                            <div
                                class="bg-(--md-sys-color-tertiary-container)/30 dark:bg-(--md-sys-color-surface-container-high) p-4 rounded-lg border-(--md-sys-color-tertiary)">
                                <div
                                    class="text-sm italic text-(--md-sys-color-tertiary) dark:text-(--md-sys-color-tertiary) transition-opacity duration-500 min-h-12">
                                    「{{ quotes[currentQuote] }}」
                                </div>
                            </div>
                            <div class="flex space-x-3 mt-4">
                                <AnzuButton class="h-10" href="https://qm.qq.com/q/v7pD9BL4Lm"
                                    primary-color="oklch(62.3% 0.214 259.815)" target="_blank">
                                    {{ t('pages.about.index.joinUs.joinGroup') }}</AnzuButton>
                                <AnzuButton @click="currentQuote = (currentQuote + 1) % quotes.length"
                                    primary-color="oklch(65.6% 0.241 354.308)">
                                    {{ t('pages.about.index.joinUs.changeQuote') }}</AnzuButton>
                            </div>
                        </div>
                        <div class="md:w-1/2 flex justify-center">
                            <div class="bg-white dark:bg-white/90 p-4 rounded-lg shadow-inner relative group">
                                <img src="/assets/images/2025JXUFECGS.svg"
                                    class="w-48 h-48 object-contain transition-transform group-hover:scale-105"
                                    :alt="t('pages.about.index.joinUs.qrLabel')" />
                                <div
                                    class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {{ t('pages.about.index.joinUs.idolLine') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                class="bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden"
                :class="{ 'opacity-0 translate-y-4': !isMounted, 'opacity-100 translate-y-0': isMounted }"
                style="transition-delay: 200ms">
                <div
                    class="absolute right-20 top-5 transform -translate-y-1/2 text-(--md-sys-color-secondary-container)/70 dark:text-(--md-sys-color-surface-dim)/80 text-8xl z-0">
                    ☍</div>
                <div class="absolute left-30 -bottom-3 text-(--md-sys-color-primary-container)/60 text-4xl z-0">❁
                </div>

                <div class="relative z-10">
                    <h2
                        class="text-3xl md:text-4xl font-bold mb-6 text-(--md-sys-color-on-surface) flex items-center">
                        <span class="w-2 h-8 bg-(--md-sys-color-secondary) mr-3 rounded-full"></span>
                        Contributors
                    </h2>
                    <div class="text-lg leading-relaxed">{{ t('pages.about.index.contributors.title') }}
                    </div>
                    <div class="my-2">
                        <a href="https://github.com/JUFEWPST/JXUFE-CSG-Website/graphs/contributors">
                            <img src="https://contrib.rocks/image?repo=JUFEWPST/JXUFE-CSG-Website&columns=15" />
                        </a>
                    </div>
                    <div class="text-lg leading-relaxed">
                        {{ t('pages.about.index.contributors.invite') }}
                    </div>

                    <i18n-t keypath="pages.about.index.contributors.projectLink" tag="div"
                        class="text-lg leading-relaxed">
                        <a href="https://github.com/JUFEWPST/JXUFE-CSG-Website"
                            class="text-(--md-sys-color-primary) hover:text-(--md-sys-color-tertiary) transition-colors">
                            {{ t('common.actions.viewDetail') }}
                        </a>
                    </i18n-t>

                </div>
            </section>
        </div>
    </main>
</template>
<style module>
@reference "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

.card {
    @apply bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) rounded-xl shadow-md p-6 md:p-8 transition-all duration-500 relative overflow-hidden;
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
