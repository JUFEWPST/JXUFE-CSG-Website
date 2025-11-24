<template>
    <main class="mt-15 mb-2 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">{{ t('pages.about.leaders.title') }}</h1>
        <AnzuAlert type="info">
            {{ t('pages.about.members.dataCollectTip') }}<NuxtLink class="text-blue-500"
                to="/archive/nvz60h0y8pj9opi1hyn9ysvb">
                [{{ t('pages.about.members.archiveInvite') }}]</NuxtLink>
        </AnzuAlert>
        <LeadersList :leaders="leadersData" />
    </main>
</template>
<script setup lang="ts">
import LeadersList from '~/components/LeadersList.vue';
import { leadersData } from '~/data/leadersData';
import AnzuAlert from '~/components/AnzuAlert.vue';
const { t } = useI18n()

useHead(() => ({
    title: t('pages.about.leaders.meta.title'),
    meta: [
        { name: 'description', content: t('pages.about.leaders.meta.description') },
        { name: 'keywords', content: t('pages.about.leaders.meta.keywords') }
    ]
}))


</script>