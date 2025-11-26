<template>
    <main class="mt-15 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">{{ t('pages.about.members.title') }}</h1>
        <AnzuAlert type="info">
            {{ t('pages.about.members.dataCollectTip') }}<NuxtLink class="text-blue-500" to="/archive/nvz60h0y8pj9opi1hyn9ysvb">
                [{{ t('pages.about.members.archiveInvite') }}]</NuxtLink>
        </AnzuAlert>
        <div v-for="item in members" :key="item.year" class="mb-12">
            <h2 class="text-2xl font-bold mb-6 border-l-4 border-blue-400 pl-3">
                <template v-if="typeof item.year === 'string'">{{ item.year }}</template>
                <template v-if="typeof item.year === 'number'">{{ item.year }} 届</template>
            </h2>
            <div class="grid grid-cols-auto-fill gap-4">
                <MemberCard v-for="(member, index) in item.members" :key="`${item.year}-${index}`" :member="member" />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { membersArray } from '~/data/membersData';
const members = ref(membersArray);
const { t } = useI18n()

useHead(() => ({
    title: t('pages.about.members.meta.title'),
    meta: [
        { name: 'description', content: t('pages.about.members.meta.description') },
        { name: 'keywords', content: t('pages.about.members.meta.keywords') }
    ]
}))



</script>

<style scoped>
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@layer utilities {
    .grid-cols-auto-fill {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}
</style>