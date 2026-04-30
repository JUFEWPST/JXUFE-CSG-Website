<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-5xl space-y-8 sm:space-y-10">
            <AnzuAlert type="info">
                {{ t("pages.about.members.dataCollectTip")
                }}<NuxtLink
                    class="text-(--md-sys-color-primary)"
                    to="/archive/江财网安协会历届成员档案共建邀请"
                >
                    [{{ t("pages.about.members.archiveInvite") }}]</NuxtLink
                >
            </AnzuAlert>

            <LeadersList :leaders="leadersData" />
        </div>
    </main>
</template>
<script setup lang="ts">
import LeadersList from "~/components/LeadersList.vue";
import { leadersData } from "~/data/leadersData";
import AnzuAlert from "~/components/AnzuAlert.vue";

const { t } = useI18n();
usePageMeta({
    titleKey: "pages.about.leaders.title",
    descriptionKey: "pages.about.leaders.meta.description",
    keywords: t("pages.about.leaders.meta.keywords"),
    canonicalPath: "/about/leaders",
});
</script>
