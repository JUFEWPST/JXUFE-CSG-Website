<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-6xl space-y-10 sm:space-y-12">
            <AnzuAlert type="info">
                {{ t("pages.about.members.dataCollectTip")
                }}<NuxtLink
                    class="text-(--md-sys-color-primary)"
                    to="/archive/nvz60h0y8pj9opi1hyn9ysvb"
                >
                    [{{ t("pages.about.members.archiveInvite") }}]</NuxtLink
                >
            </AnzuAlert>

            <div v-for="item in members" :key="item.year" class="space-y-6">
                <h2
                    class="border-l-4 border-(--md-sys-color-primary) pl-3 text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                >
                    <template v-if="typeof item.year === 'string'">{{
                        item.year
                    }}</template>
                    <template v-else>{{ item.year }} 届</template>
                </h2>
                <div class="grid-cols-auto-fill grid gap-4">
                    <MemberCard
                        v-for="(member, index) in item.members"
                        :key="`${item.year}-${index}`"
                        :member="member"
                    />
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { membersArray } from "~/data/membersData";
import { usePageTitle } from "@/composables/usePageTitle";
const members = ref(membersArray);
const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.about.members.title");

useHead(() => ({
    title: t("pages.about.members.meta.title"),
    meta: [
        {
            name: "description",
            content: t("pages.about.members.meta.description"),
        },
        { name: "keywords", content: t("pages.about.members.meta.keywords") },
    ],
}));
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
