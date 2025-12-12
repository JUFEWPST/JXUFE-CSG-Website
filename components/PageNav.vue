<template>
    <div class="pagination-container">
        <!-- 上一页 -->
        <button
            class="pagination-button"
            :class="{ disabled: currentPage <= 1 }"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            :aria-label="t('common.actions.paginationPrevious')"
        >
            <span class="pagination-arrow">←</span>
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
            <span class="pagination-arrow">→</span>
        </button>
        <div class="page-jump">
            <span>{{ t("common.actions.paginationJumpTo") }}</span>
            <input
                type="number"
                v-model.number="inputPage"
                min="1"
                :max="totalPages"
                @keyup.enter="jumpToPage"
                :aria-label="t('common.actions.paginationTargetPageNumber')"
            />
            <span>{{ t("common.actions.paginationPageUnit") }}</span>
            <button
                class="jump-button"
                @click="jumpToPage"
                :aria-label="
                    t('common.actions.paginationJumpToPage', {
                        page: inputPage,
                    })
                "
            >
                GO
            </button>
        </div>
    </div>
</template>

<style scoped>
.pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 1rem 0;
    flex-wrap: wrap;
    color: var(--md-sys-color-on-surface);
}

.pagination-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    padding: 0 12px;
    height: 32px;
    box-sizing: border-box;
    border-radius: 0.75rem;
    border: 1px solid
        color-mix(in srgb, var(--md-sys-color-outline) 80%, transparent);
    background-color: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease,
        transform 0.1s ease,
        box-shadow 0.2s ease;
}

.pagination-button::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
}

.pagination-button:hover:not(.disabled, .active, .dots) {
    background-color: var(--md-sys-color-surface-container-low);
}

.pagination-button:hover:not(.disabled, .active, .dots)::after {
    opacity: 0.08;
}

.pagination-button:active:not(.disabled, .active, .dots) {
    transform: translateY(0);
}

.pagination-button:active:not(.disabled, .active, .dots)::after {
    opacity: 0.12;
}

.pagination-button.active {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border-color: var(--md-sys-color-primary);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
}

.pagination-button.disabled {
    cursor: not-allowed;
    border-color: transparent;
    background-color: color-mix(
        in srgb,
        var(--md-sys-color-on-surface) 12%,
        transparent
    );
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
}

.pagination-button.disabled::after {
    opacity: 0;
}

.pagination-button.dots {
    cursor: default;
    border: none;
    background-color: transparent;
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 60%, transparent);
}

.disabled-item {
    cursor: not-allowed;
}

.pagination-arrow {
    font-size: 1rem;
    line-height: 1;
}

.page-jump {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 12px;
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 80%, transparent);
}

.page-jump input {
    width: 3.25rem;
    padding: 4px 8px;
    border-radius: 0.5rem;
    border: 1px solid
        color-mix(in srgb, var(--md-sys-color-outline) 80%, transparent);
    background-color: var(--md-sys-color-surface-container-low);
    color: var(--md-sys-color-on-surface);
    text-align: center;
    font-size: 0.875rem;
    line-height: 1;
    outline: none;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;
}

.page-jump input:focus-visible {
    border-color: var(--md-sys-color-primary);
    box-shadow: 0 0 0 1px
        color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent);
}

.jump-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    height: 32px;
    border-radius: 0.75rem;
    border: none;
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    font-size: 0.875rem;
    line-height: 1;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease;
}

.jump-button::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
}

.jump-button:hover {
    background-color: color-mix(
        in srgb,
        var(--md-sys-color-secondary-container) 90%,
        var(--md-sys-color-on-surface) 10%
    );
}

.jump-button:hover::after {
    opacity: 0.08;
}

.jump-button:active::after {
    opacity: 0.12;
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
