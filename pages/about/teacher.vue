<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-5xl space-y-8 sm:space-y-10">
            <div class="flex flex-col justify-center">
                <TeacherCard :teacher="teacherData" />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import TeacherCard from "~/components/TeacherCard.vue";
import { teacherData } from "~/data/teacherData";
import { usePageTitle } from "@/composables/usePageTitle";
const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.about.teacher.title");

useHead(() => ({
    title: t("pages.about.teacher.meta.title"),
    meta: [
        {
            name: "description",
            content: t("pages.about.teacher.meta.description"),
        },
        { name: "keywords", content: t("pages.about.teacher.meta.keywords") },
    ],
}));
</script>
