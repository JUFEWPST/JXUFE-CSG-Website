<template>
    <div class="flex min-w-0 items-center space-x-1" v-if="tags && tags.length">
        <svg width="1em" height="1em" viewBox="0 0 24 24" class="translate-y-[0.5px] text-(--anzu-primary)">
            <path fill="currentColor" fill-rule="evenodd"
                d="M10 15h4V9h-4v6Zm0 2v3a1 1 0 0 1-2 0v-3H5a1 1 0 0 1 0-2h3V9H5a1 1 0 1 1 0-2h3V4a1 1 0 1 1 2 0v3h4V4a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2h-3v6h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-4Z">
            </path>
        </svg>
        <span class="min-w-0 truncate">
            <span v-for="(tag, index) in tags" :key="tag">
                <button
                    class="shiro-link--underline font-normal hover:text-(--anzu-primary-pressed) transition-colors"
                    tabindex="0" @click="$emit('tag-click', tag)">
                    {{ tag }}
                </button>
                <span v-if="index < tags.length - 1">, </span>
            </span>
        </span>
    </div>
</template>

<script setup>
defineProps({
    tags: {
        type: Array,
        default: () => []
    }
});

defineEmits(['tag-click']);
</script>

<style scoped>
.shiro-link--underline {
    position: relative;
    display: inline-block;
}

.shiro-link--underline::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    transition: width 0.5s ease;
}

.shiro-link--underline:hover::after {
    width: 100%;
}
</style>
