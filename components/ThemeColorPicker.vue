<script setup lang="ts">
import { ref } from "vue";
import { useColorPalette } from "@/composables/useColorPalette";
import { PaintBrushIcon } from "@heroicons/vue/24/outline";

const { primaryColor, setPrimaryColor } = useColorPalette();
const { t } = useI18n();

const showPicker = ref(false);

const Themes = [
    { name: "江财红 (JXUFE)", color: "#A61E33" },
    { name: "初音未来 (Miku)", color: "#39C5BB" },
    { name: "田园海未 (Umi)", color: "#0067C0" },
    { name: "矢泽妮可 (Nico)", color: "#EC008C" },
    { name: "高坂穗乃果 (Honoka)", color: "#E48F23" },
    { name: "南小鸟 (Kotori)", color: "#97978F" },
    { name: "星空凛 (Rin)", color: "#FCD800" },
    { name: "小泉花阳 (Hanayo)", color: "#54AB4C" },
    { name: "西木野真姬 (Maki)", color: "#CC2439" },
    { name: "东条希 (Nozomi)", color: "#742D93" },
    { name: "绚濑绘里 (Eli)", color: "#2AB2E1" },
];

const updateColor = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setPrimaryColor(target.value);
};

const selectPreset = (color: string) => {
    setPrimaryColor(color);
    showPicker.value = false;
};
</script>

<template>
    <div class="relative inline-block text-left">
        <button
            @click="showPicker = !showPicker"
            class="flex h-[30px] w-[30px] items-center justify-center rounded-full text-(--md-sys-color-on-surface) transition-colors duration-200 hover:bg-(--md-sys-color-surface-container-high)"
            :title="t('themeColorPicker.tooltip')"
            aria-haspopup="true"
            :aria-expanded="showPicker ? 'true' : 'false'"
        >
            <PaintBrushIcon class="box-border h-full w-full p-1.5" />
        </button>

        <div
            v-if="showPicker"
            class="ring-opacity-5 absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-4 shadow-lg ring-1 ring-black focus:outline-none"
            role="dialog"
            :aria-label="t('themeColorPicker.title')"
        >
            <div class="mb-3">
                <label
                    class="mb-2 block text-xs font-medium text-(--md-sys-color-on-surface-variant)"
                >
                    {{ t("themeColorPicker.customColor") }}
                </label>
                <div class="flex items-center gap-2">
                    <div
                        class="h-8 w-8 rounded-full border border-(--md-sys-color-outline-variant)"
                        :style="{ background: primaryColor }"
                    ></div>
                    <input
                        type="color"
                        :value="primaryColor"
                        @input="updateColor"
                        class="absolute h-8 w-8 cursor-pointer opacity-0"
                        :aria-label="t('themeColorPicker.colorInputLabel')"
                    />
                    <span
                        class="font-mono text-sm text-(--md-sys-color-on-surface)"
                        >{{ primaryColor }}</span
                    >
                </div>
            </div>

            <div>
                <label
                    class="mb-2 block text-xs font-medium text-(--md-sys-color-on-surface-variant)"
                >
                    {{ t("themeColorPicker.Themes") }}
                </label>
                <div
                    class="custom-scrollbar flex max-h-64 flex-col gap-1 overflow-y-auto pr-1"
                >
                    <button
                        v-for="theme in Themes"
                        :key="theme.name"
                        @click="selectPreset(theme.color)"
                        class="group flex w-full items-center rounded-lg px-2 py-1.5 transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                        :class="{
                            'bg-(--md-sys-color-secondary-container)':
                                primaryColor === theme.color,
                        }"
                        type="button"
                        :aria-label="
                            t('themeColorPicker.themeItem', {
                                name: theme.name,
                            })
                        "
                    >
                        <div
                            class="mr-3 h-6 w-6 shrink-0 rounded-full border border-(--md-sys-color-outline-variant) shadow-sm transition-transform group-hover:scale-110"
                            :style="{ backgroundColor: theme.color }"
                        ></div>
                        <span
                            class="truncate text-sm text-(--md-sys-color-on-surface)"
                            >{{ theme.name }}</span
                        >
                        <div
                            v-if="primaryColor === theme.color"
                            class="ml-auto h-2 w-2 rounded-full bg-(--md-sys-color-primary)"
                        ></div>
                    </button>
                </div>
            </div>
            <div
                v-if="showPicker"
                class="fixed inset-0 z-40"
                @click="showPicker = false"
                aria-hidden="true"
            ></div>
        </div>
    </div>
</template>
