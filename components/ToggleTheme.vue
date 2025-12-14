<script lang="ts" setup>
import { ref } from "vue";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import { useColorPalette } from "@/composables/useColorPalette";
import AnzuDropdown from "@/components/AnzuDropdown.vue";

const { isDark } = useTheme();
const { primaryColor, setPrimaryColor } = useColorPalette();
const { t } = useI18n();

const showMenu = ref(false);

const Themes = [
    { name: "江财红 (JXUFE)", color: "#A61E33" },
    { name: "Miku", color: "#39C5BB" },
    { name: "Umi", color: "#0067C0" },
    { name: "Nico", color: "#EC008C" },
    { name: "Honoka", color: "#E48F23" },
    { name: "Kotori", color: "#97978F" },
    { name: "Rin", color: "#FCD800" },
    { name: "Hanayo", color: "#54AB4C" },
    { name: "Maki", color: "#CC2439" },
    { name: "Nozomi", color: "#742D93" },
    { name: "Eli", color: "#2AB2E1" },
];

const updateColor = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setPrimaryColor(target.value);
};

const selectPreset = (color: string) => {
    setPrimaryColor(color);
};

const setTheme = (nextIsDark: boolean) => {
    isDark.value = nextIsDark;

    if (import.meta.client) {
        localStorage.setItem("dark-theme", nextIsDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", nextIsDark);
    }
};
</script>

<template>
    <AnzuDropdown v-model="showMenu" width-class="w-72" align="right">
        <template #trigger>
            <button
                class="flex h-7.5 w-7.5 items-center justify-center rounded-full text-(--md-sys-color-on-surface) transition-colors duration-200 hover:bg-(--md-sys-color-surface-container-high)"
                @click="showMenu = !showMenu"
                :title="t('themeMenu.tooltip')"
                aria-haspopup="true"
                :aria-expanded="showMenu ? 'true' : 'false'"
                type="button"
            >
                <MoonIcon
                    v-if="isDark"
                    class="box-border p-1"
                    :style="{ color: primaryColor }"
                />
                <SunIcon
                    v-else
                    class="box-border p-1"
                    :style="{ color: primaryColor }"
                />
            </button>
        </template>

        <template #menu>
            <div class="p-4" role="dialog" :aria-label="t('themeMenu.title')">
                <!-- Theme mode -->
                <div class="mb-4">
                    <label
                        class="mb-2 block text-xs font-medium text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("themeMenu.mode") }}
                    </label>

                    <div class="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            class="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors"
                            :class="[
                                !isDark
                                    ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                                    : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)',
                            ]"
                            @click="setTheme(false)"
                        >
                            <SunIcon class="h-4 w-4" />
                            {{ t("themeMenu.light") }}
                        </button>

                        <button
                            type="button"
                            class="flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors"
                            :class="[
                                isDark
                                    ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                                    : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)',
                            ]"
                            @click="setTheme(true)"
                        >
                            <MoonIcon class="h-4 w-4" />
                            {{ t("themeMenu.dark") }}
                        </button>
                    </div>
                </div>

                <!-- Theme color -->
                <div>
                    <label
                        class="mb-2 block text-xs font-medium text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("themeColorPicker.title") }}
                    </label>

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
                                :aria-label="
                                    t('themeColorPicker.colorInputLabel')
                                "
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
                            class="custom-scrollbar flex max-h-56 flex-col gap-1 overflow-y-auto pr-1"
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
                </div>
            </div>
        </template>
    </AnzuDropdown>
</template>
