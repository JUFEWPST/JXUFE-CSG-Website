<template>
    <div
        class="flex flex-wrap items-center justify-center gap-2 my-4 text-(--md-sys-color-on-surface)"
    >
        <AnzuButton
            variant="outlined"
            class="h-10! w-10! min-w-10! px-0!"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
            :aria-label="t('common.actions.paginationPrevious')"
        >
            <span class="text-base leading-none"> < </span>
        </AnzuButton>
        <template v-for="page in displayedPages" :key="page">
            <div
                v-if="page === '...'"
                class="flex h-10 w-10 items-center justify-center text-(--md-sys-color-on-surface-variant)"
            >
                ...
            </div>
            <AnzuButton
                v-else
                :variant="page === currentPage ? 'filled' : 'outlined'"
                class="h-10! w-10! min-w-10! px-0!"
                @click="goToPage(page)"
            >
                {{ page }}
            </AnzuButton>
        </template>

        <!-- 下一页 -->
        <AnzuButton
            variant="outlined"
            class="h-10! w-10! min-w-10! px-0!"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
            :aria-label="t('common.actions.paginationNext')"
        >
            <span class="text-base leading-none">></span>
        </AnzuButton>

        <div
            class="flex items-center gap-2 ml-3 text-sm text-(--md-sys-color-on-surface)/80"
        >
            <span>{{ t("common.actions.paginationJumpTo") }}</span>
            <div class="w-20">
                <AnzuInput
                    v-model.number="inputPage"
                    type="number"
                    :min="1"
                    :max="totalPages"
                    class="text-center"
                    placeholder=""
                    @keydown.enter="jumpToPage"
                    :aria-label="t('common.actions.paginationTargetPageNumber')"
                />
            </div>
            <span>{{ t("common.actions.paginationPageUnit") }}</span>
            <AnzuButton
                variant="filled"
                class="min-w-16!"
                @click="jumpToPage"
                :aria-label="
                    t('common.actions.paginationJumpToPage', {
                        page: inputPage,
                    })
                "
            >
                芳文跳
            </AnzuButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "#imports";
import AnzuButton from "./AnzuButton.vue";
import AnzuInput from "./AnzuInput.vue";

const { t } = useI18n();
const props = defineProps({
    totalPages: {
        type: Number,
        required: true,
        validator: (value: number) => value > 0,
    },
    currentPage: {
        type: Number,
        required: true,
        validator: (value: number) => value > 0,
    },
    baseUrl: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["pageChanged"]);

const router = useRouter();
const inputPage = ref<string | number>("");

const displayedPages = computed(() => {
    const pages = [];
    const { currentPage, totalPages } = props;
    const maxVisible = 5; // 最多显示5个页码

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        const half = Math.floor(maxVisible / 2);
        let start = currentPage - half;
        let end = currentPage + half;

        if (start < 1) {
            start = 1;
            end = maxVisible;
        } else if (end > totalPages) {
            end = totalPages;
            start = totalPages - maxVisible + 1;
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push("...");
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }
    }

    return pages;
});

const goToPage = (page: number | string) => {
    if (typeof page !== "number") return;

    if (page < 1 || page > props.totalPages || page === props.currentPage)
        return;

    const query = { ...router.currentRoute.value.query, page };
    router.push({
        path: props.baseUrl || router.currentRoute.value.path,
        query,
    });
    emit("pageChanged", page);
};

const jumpToPage = () => {
    const page =
        typeof inputPage.value === "string"
            ? parseInt(inputPage.value)
            : inputPage.value;
    if (
        typeof page === "number" &&
        !isNaN(page) &&
        page >= 1 &&
        page <= props.totalPages
    ) {
        goToPage(page);
        inputPage.value = "";
    }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
