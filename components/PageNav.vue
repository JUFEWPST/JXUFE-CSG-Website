<template>
    <div
        class="flex flex-wrap items-center justify-center gap-2 my-4 text-(--md-sys-color-on-surface)"
    >
        <!-- 上一页 -->
        <button
            class="pagination-button"
            :class="{ disabled: currentPage <= 1 }"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            :aria-label="t('common.actions.paginationPrevious')"
        >
            <span class="text-base leading-none">←</span>
        </button>
        <template v-for="page in displayedPages" :key="page">
            <button
                class="pagination-button"
                :class="{
                    active: page === currentPage,
                    dots: page === '...',
                    'disabled-item': page === '...',
                }"
                @click="page !== '...' ? goToPage(page) : null"
            >
                {{ page }}
            </button>
        </template>
        <!-- 下一页 -->
        <button
            class="pagination-button"
            :class="{ disabled: currentPage >= totalPages }"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            :aria-label="$t('common.actions.paginationNext')"
        >
            <span class="text-base leading-none">→</span>
        </button>
        <div
            class="flex items-center gap-2 ml-3 text-sm text-(--md-sys-color-on-surface)/80"
        >
            <span>{{ t("common.actions.paginationJumpTo") }}</span>
            <input
                type="number"
                class="w-13 px-2 py-1 rounded-lg border border-(--md-sys-color-outline)/80 bg-(--md-sys-color-surface-container-low) text-(--md-sys-color-on-surface) text-center text-sm leading-none outline-none transition-all duration-200 focus-visible:border-(--md-sys-color-primary) focus-visible:shadow-[0_0_0_1px_color-mix(in_srgb,var(--md-sys-color-primary)_40%,transparent)]"
                v-model.number="inputPage"
                min="1"
                :max="totalPages"
                @keyup.enter="jumpToPage"
                :aria-label="t('common.actions.paginationTargetPageNumber')"
            />
            <span>{{ t("common.actions.paginationPageUnit") }}</span>
            <button
                class="pagination-button active"
                @click="jumpToPage"
                :aria-label="
                    t('common.actions.paginationJumpToPage', {
                        page: inputPage,
                    })
                "
            >
                芳文跳
            </button>
        </div>
    </div>
</template>

<style scoped>
@reference "tailwindcss";

.pagination-button {
    @apply relative inline-flex h-8 min-w-9 items-center justify-center overflow-hidden rounded-lg border border-(--md-sys-color-outline)/80 bg-(--md-sys-color-surface) px-3 text-sm font-medium leading-none text-(--md-sys-color-on-surface) cursor-pointer transition-all duration-200;
}

.pagination-button::after {
    @apply pointer-events-none absolute inset-0 bg-current opacity-0 transition-opacity duration-200 content-[''];
}

.pagination-button:hover:not(.disabled, .active, .dots) {
    @apply bg-(--md-sys-color-surface-container-low);
}

.pagination-button:hover:not(.disabled, .active, .dots)::after {
    @apply opacity-8;
}

.pagination-button:active:not(.disabled, .active, .dots) {
    @apply translate-y-0;
}

.pagination-button:active:not(.disabled, .active, .dots)::after {
    @apply opacity-12;
}

.pagination-button.active {
    @apply border-(--md-sys-color-primary) bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary);
}

.pagination-button.disabled {
    @apply cursor-not-allowed border-transparent bg-(--md-sys-color-on-surface)/12 text-(--md-sys-color-on-surface)/38;
}

.pagination-button.disabled::after {
    @apply opacity-0;
}

.pagination-button.dots {
    @apply cursor-default border-none bg-transparent text-(--md-sys-color-on-surface)/60;
}

.disabled-item {
    @apply cursor-not-allowed;
}
</style>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "#imports";
const { t } = useI18n();
const props = defineProps({
    totalPages: {
        type: Number,
        required: true,
        validator: (value) => value > 0,
    },
    currentPage: {
        type: Number,
        required: true,
        validator: (value) => value > 0,
    },
    baseUrl: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["pageChanged"]);

const router = useRouter();
const inputPage = ref("");

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

const goToPage = (page) => {
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
    const page = parseInt(inputPage.value);
    if (!isNaN(page) && page >= 1 && page <= props.totalPages) {
        goToPage(page);
        inputPage.value = "";
    }
};
</script>
