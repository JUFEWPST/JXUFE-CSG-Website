<template>
    <main class="bg-white dark:bg-(--md-sys-color-surface) px-4 py-2 box-border">
        <AnzuAlert type="info">
            {{ t('pages.about.members.dataCollectTip') }}<NuxtLink class="text-(--md-sys-color-primary)"
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
import { usePageTitle } from '@/composables/usePageTitle';
const { t } = useI18n()
const { setPageTitle } = usePageTitle()

setPageTitle('pages.about.leaders.title')

useHead(() => ({
    title: t('pages.about.leaders.meta.title'),
    meta: [
        { name: 'description', content: t('pages.about.leaders.meta.description') },
        { name: 'keywords', content: t('pages.about.leaders.meta.keywords') }
    ]
}))


</script>
