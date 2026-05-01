<template>
    <nav
        class="my-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2"
        :aria-label="t('common.actions.pagination')"
    >
        <div class="flex items-center gap-1">
            <AnzuButton
                variant="text"
                size="md"
                class="w-9! min-w-9! px-0!"
                :disabled="currentPage <= 1"
                :loading="loading"
                @click="goToPage(currentPage - 1)"
                :aria-label="t('common.actions.paginationPrevious')"
            >
                <template #icon>
                    <ChevronLeftIcon class="h-4 w-4" />
                </template>
            </AnzuButton>

            <div class="flex items-center gap-1">
                <template
                    v-for="(page, index) in displayedPages"
                    :key="`${page}-${index}`"
                >
                    <span
                        v-if="page === '...'"
                        class="px-2 py-1 text-sm text-(--md-sys-color-on-surface-variant)/45"
                        aria-hidden="true"
                    >
                        …
                    </span>
                    <AnzuButton
                        v-else
                        :variant="page === currentPage ? 'filled' : 'text'"
                        size="md"
                        class="w-9! min-w-9! px-0!"
                        :disabled="loading"
                        :aria-current="
                            page === currentPage ? 'page' : undefined
                        "
                        :aria-label="
                            t('common.actions.paginationPage', { page })
                        "
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </AnzuButton>
                </template>
            </div>

            <AnzuButton
                variant="text"
                size="md"
                class="w-9! min-w-9! px-0!"
                :disabled="currentPage >= totalPages"
                :loading="loading"
                @click="goToPage(currentPage + 1)"
                :aria-label="t('common.actions.paginationNext')"
            >
                <template #icon>
                    <ChevronRightIcon class="h-4 w-4" />
                </template>
            </AnzuButton>
        </div>

        <div
            class="flex items-center gap-2 text-sm text-(--md-sys-color-on-surface)/80 sm:ml-3"
        >
            <span>{{ t("common.actions.paginationJumpTo") }}</span>
            <div class="h-9 w-16">
                <AnzuInput
                    v-model.number="inputPage"
                    type="number"
                    :min="1"
                    :max="totalPages"
                    class="text-center [&_input]:h-9!"
                    placeholder=""
                    @keydown.enter="jumpToPage"
                    :aria-label="t('common.actions.paginationTargetPageNumber')"
                />
            </div>
            <span>{{ t("common.actions.paginationPageUnit") }}</span>
            <AnzuButton
                variant="filled"
                size="md"
                class="min-w-16!"
                :disabled="loading"
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
    </nav>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
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
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["pageChanged"]);

const router = useRouter();
const inputPage = ref<string | number>("");

const displayedPages = computed(() => {
    const pages = [];
    const { currentPage, totalPages } = props;
    const maxVisible = 5;

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
:deep(input[type="number"])::-webkit-inner-spin-button,
:deep(input[type="number"])::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
:deep(input[type="number"]) {
    -moz-appearance: textfield;
}
</style>
