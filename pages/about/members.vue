<template>
    <main class="max-w-6xl mx-auto">
        <AnzuAlert type="info">
            {{ t('pages.about.members.dataCollectTip') }}<NuxtLink class="text-(--md-sys-color-primary)"
                to="/archive/nvz60h0y8pj9opi1hyn9ysvb">
                [{{ t('pages.about.members.archiveInvite') }}]</NuxtLink>
        </AnzuAlert>
        <div v-for="item in members" :key="item.year" class="mb-12">
            <h2 class="text-2xl font-bold mb-6 border-l-4 border-(--md-sys-color-primary) pl-3">
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
import { usePageTitle } from '@/composables/usePageTitle';
const members = ref(membersArray);
const { t } = useI18n()
const { setPageTitle } = usePageTitle()

setPageTitle('pages.about.members.title')

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
