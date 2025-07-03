<template>
    <div class="pagination-container">
        <!-- 上一页 -->
        <button class="pagination-button" :class="{ disabled: currentPage <= 1 }" @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1">
            <span class="pagination-arrow">←</span>
        </button>

        <template v-for="page in displayedPages" :key="page">
            <button class="pagination-button" :class="{
                active: page === currentPage,
                'dots': page === '...',
                'disabled-item': page === '...'
            }" @click="page !== '...' ? goToPage(page) : null">
                {{ page }}
            </button>
        </template>

        <!-- 下一页 -->
        <button class="pagination-button" :class="{ disabled: currentPage >= totalPages }"
            @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages">
            <span class="pagination-arrow">→</span>
        </button>

        <div class="page-jump">
            <span>跳至</span>
            <input type="number" v-model.number="inputPage" min="1" :max="totalPages" @keyup.enter="jumpToPage" />
            <span>页</span>
            <button class="jump-button" @click="jumpToPage">GO</button>
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
}

.pagination-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    height: 30px;
    border-radius: 5px;
    box-sizing: border-box;
    border: 0.5px solid #e0e0e0;
    background-color: white;
    color: #333;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination-button:hover:not(.disabled, .active, .dots) {
    background-color: #e0e0e0;
    border-color: #cbd5e0;
    transform: translateY(-2px);
}

.pagination-button.active {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.pagination-button.disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: #f5f5f5;
    color: #999;
}

.pagination-button.dots {
    cursor: default;
    border: none;
    background-color: transparent;
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
    color: var(--color-text)
}

.page-jump input {
    width: 3rem;
    padding: 4px 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    text-align: center;
}

.jump-button {
    padding: 4px 12px;
    border-radius: 4px;
    background-color: var(--color-primary);
    color: #ffffff;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.jump-button:hover {
    background-color: #e0e0e0;
    border-color: #cbd5e0;
}

.pagination-button {
    transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.pagination-button:active:not(.disabled, .active, .dots) {
    transform: translateY(0);
}
</style>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from '#imports';

const props = defineProps({
    totalPages: {
        type: Number,
        required: true,
        validator: value => value > 0
    },
    currentPage: {
        type: Number,
        required: true,
        validator: value => value > 0
    },
    baseUrl: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['pageChanged']);

const router = useRouter();
const inputPage = ref('');

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
                pages.push('...');
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
    }

    return pages;
});

const goToPage = (page) => {
    if (page < 1 || page > props.totalPages || page === props.currentPage) return;

    const query = { ...router.currentRoute.value.query, page };
    router.push({ path: props.baseUrl || router.currentRoute.value.path, query });
    emit('pageChanged', page);
};

const jumpToPage = () => {
    const page = parseInt(inputPage.value);
    if (!isNaN(page) && page >= 1 && page <= props.totalPages) {
        goToPage(page);
        inputPage.value = '';
    }
};
</script>
