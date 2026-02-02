<template>
    <div ref="root" class="relative inline-flex w-full" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <slot name="trigger" :open="isOpen" :toggle="toggleMenu" :selected="selectedItem" :selectedLabel="selectedLabel"
            :query="query" :setQuery="setQuery">
            <button ref="triggerRef" type="button"
                class="flex w-full min-w-40 items-center justify-between gap-2 rounded-md border border-(--md-sys-color-outline-variant) px-3 py-2 text-sm text-(--md-sys-color-on-surface) transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                @click="toggleMenu" :aria-label="ariaLabel" :aria-expanded="isOpen" aria-haspopup="listbox">
                <span class="truncate">
                    {{ selectedLabel || placeholder }}
                </span>
                <svg class="h-4 w-4 shrink-0 opacity-60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </slot>

        <Teleport to="body">
            <transition enter-active-class="transition duration-150 ease-out"
                enter-from-class="transform translate-y-1 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-120 ease-in" leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform translate-y-1 opacity-0">
                <div v-if="isOpen" ref="menuRef"
                    class="shadow-center-sm fixed z-50 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-(--md-sys-color-surface-container) ring-1 ring-black/5"
                    :class="menuWidthClass" :style="menuPositionStyle" role="listbox" @mouseenter="handleMouseEnter"
                    @mouseleave="handleMouseLeave">
                    <div class="border-b border-(--md-sys-color-outline-variant)/40 p-2">
                        <input v-model="query" type="text"
                            class="w-full rounded-full border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-3 py-1.5 text-sm text-(--md-sys-color-on-surface) outline-none focus:ring-2 focus:ring-(--md-sys-color-primary)/20"
                            :placeholder="searchPlaceholder" @keydown.escape.prevent="closeNow" />
                    </div>

                    <div class="overflow-auto py-1" :style="menuBodyStyle">
                        <button v-for="it in filteredItems" :key="getKey(it)" type="button" role="option"
                            :aria-selected="isSelected(it)" @click="select(getValue(it))"
                            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors"
                            :class="isSelected(it)
                                    ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                                    : 'text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)'
                                ">
                            <span class="inline-block h-1.5 w-1.5 rounded-full" :class="isSelected(it)
                                    ? 'bg-(--md-sys-color-primary)'
                                    : 'bg-transparent'
                                " />
                            <span class="truncate">
                                <slot name="item" :item="it" :selected="isSelected(it)">
                                    {{ getLabel(it) }}
                                </slot>
                            </span>
                        </button>

                        <div v-if="filteredItems.length === 0"
                            class="px-3 py-3 text-sm text-(--md-sys-color-on-surface-variant)">
                            {{ emptyText }}
                        </div>
                    </div>
                </div>
            </transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

type Primitive = string | number;
type ItemLike = Primitive | Record<string, any>;

const props = withDefaults(
    defineProps<{
        modelValue: Primitive | null;
        items: ItemLike[];

        valueKey?: string;
        labelKey?: string;
        keyKey?: string;

        menuWidthClass?: string;
        ariaLabel?: string;

        placeholder?: string;
        searchPlaceholder?: string;
        emptyText?: string;

        closeDelay?: number;
        autoFocusSearch?: boolean;
        filterFn?: (query: string, item: ItemLike) => boolean;
        openOnHover?: boolean;

        maxMenuHeight?: string | number;
        menuAlign?: "left" | "center" | "right";
    }>(),
    {
        valueKey: "value",
        labelKey: "label",
        keyKey: "",
        menuWidthClass: "w-full",
        ariaLabel: "打开 combobox",
        placeholder: "选择...",
        searchPlaceholder: "搜索...",
        emptyText: "没有结果",
        closeDelay: 120,
        autoFocusSearch: true,
        filterFn: undefined,
        openOnHover: false,
        maxMenuHeight: "18rem",
        menuAlign: "left",
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", v: Primitive | null): void;
    (e: "change", v: Primitive | null, item: any): void;
    (e: "open"): void;
    (e: "close"): void;
}>();

const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const query = ref("");
const menuPosition = ref({ top: 0, left: 0, width: 0 });

let closeTimer: ReturnType<typeof setTimeout> | null = null;
const clearCloseTimer = () => {
    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }
};

const updateMenuPosition = () => {
    const trigger = triggerRef.value || root.value;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    menuPosition.value = {
        top: rect.bottom + 4,
        left: props.menuAlign === "right" ? rect.right : props.menuAlign === "center" ? rect.left + rect.width / 2 : rect.left,
        width: rect.width,
    };
};

const openMenu = () => {
    clearCloseTimer();
    if (!isOpen.value) emit("open");
    isOpen.value = true;
    updateMenuPosition();
};

const closeNow = () => {
    clearCloseTimer();
    if (isOpen.value) emit("close");
    isOpen.value = false;
};

const scheduleClose = () => {
    clearCloseTimer();
    closeTimer = setTimeout(() => closeNow(), props.closeDelay);
};

const toggleMenu = () => {
    if (isOpen.value) {
        closeNow();
    } else {
        openMenu();
    }
};

const handleMouseEnter = () => {
    if (props.openOnHover) openMenu();
};
const handleMouseLeave = () => {
    if (props.openOnHover) scheduleClose();
};

const normalizedItems = computed(() => props.items ?? []);

const getValue = (it: ItemLike): Primitive => {
    if (typeof it === "string" || typeof it === "number") return it;
    return it[props.valueKey];
};

const getLabel = (it: ItemLike): string => {
    if (typeof it === "string" || typeof it === "number") return String(it);
    return it?.[props.labelKey] ?? String(getValue(it));
};

const getKey = (it: ItemLike): Primitive => {
    if (typeof it === "string" || typeof it === "number") return it;
    const keyField = props.keyKey || props.valueKey;
    return it?.[keyField] ?? getValue(it);
};

const isSelected = (it: ItemLike) => getValue(it) === props.modelValue;

const selectedItem = computed(() =>
    normalizedItems.value.find((x) => getValue(x) === props.modelValue),
);
const selectedLabel = computed(() =>
    selectedItem.value ? getLabel(selectedItem.value) : "",
);

const defaultFilter = (q: string, it: ItemLike) =>
    getLabel(it).toLowerCase().includes(q.toLowerCase().trim());

const filteredItems = computed(() => {
    const q = query.value.trim();
    if (!q) return normalizedItems.value;
    const fn = props.filterFn ?? defaultFilter;
    return normalizedItems.value.filter((it) => fn(q, it));
});

const select = (val: Primitive) => {
    const item = normalizedItems.value.find((x) => getValue(x) === val);
    if (val !== props.modelValue) {
        emit("update:modelValue", val);
        emit("change", val, item);
    }
    closeNow();
};

const setQuery = (v: string) => (query.value = v);

const onDocClick = (e: MouseEvent) => {
    if (!root.value) return;
    const menu = menuRef.value;
    if (!root.value.contains(e.target as Node) && (!menu || !menu.contains(e.target as Node))) {
        closeNow();
    }
};

onMounted(() => {
    document.addEventListener("click", onDocClick);
    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocClick);
    window.removeEventListener("scroll", updateMenuPosition, true);
    window.removeEventListener("resize", updateMenuPosition);
    clearCloseTimer();
});

watch(isOpen, (v) => {
    if (v) {
        query.value = "";
        updateMenuPosition();
    }
});

const menuPositionStyle = computed(() => {
    const style: Record<string, string> = {
        top: `${menuPosition.value.top}px`,
    };
    
    if (props.menuAlign === "right") {
        style.right = `${window.innerWidth - menuPosition.value.left}px`;
    } else if (props.menuAlign === "center") {
        style.left = `${menuPosition.value.left}px`;
        style.transform = "translateX(-50%)";
    } else {
        style.left = `${menuPosition.value.left}px`;
        style.width = `${menuPosition.value.width}px`;
    }
    
    return style;
});

const menuBodyStyle = computed(() => {
    const h =
        typeof props.maxMenuHeight === "number"
            ? `${props.maxMenuHeight}px`
            : props.maxMenuHeight;
    return { maxHeight: h };
});
</script>
