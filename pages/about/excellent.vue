<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-6xl space-y-8 sm:space-y-10">
            <AnzuAlert type="info">
                {{ t("pages.about.excellent.dataCollectTip")
                }}<NuxtLink
                    class="text-(--md-sys-color-primary)"
                    to="/archive/nvz60h0y8pj9opi1hyn9ysvb"
                >
                    [{{ t("pages.about.excellent.archiveInvite") }}]</NuxtLink
                >
            </AnzuAlert>

            <section class="grid-cols-auto-fill grid gap-4">
                <MemberHonorCard
                    v-for="(person, index) in excellentData"
                    :key="index"
                    :person="person"
                >
                </MemberHonorCard>
            </section>
        </div>
    </main>
</template>
<script setup lang="ts">
import MemberHonorCard from "~/components/MemberHonorCard.vue";
import { excellentData } from "~/data/excellentData";
import { usePageTitle } from "@/composables/usePageTitle";
const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.about.excellent.title");

useHead(() => ({
    title: t("pages.about.excellent.meta.title"),
    meta: [
        {
            name: "description",
            content: t("pages.about.excellent.meta.description"),
        },
        { name: "keywords", content: t("pages.about.excellent.meta.keywords") },
    ],
}));
</script>
<style scoped>
.grid-cols-auto-fill {
    --min-col-size: 360px;
    grid-template-columns: repeat(auto-fill, minmax(var(--min-col-size), 1fr));
}
</style>
