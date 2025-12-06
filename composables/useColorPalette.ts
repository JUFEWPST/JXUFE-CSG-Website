import { ref, computed, watchEffect } from 'vue';
import { generateTheme, applyThemeToRoot, type ColorScheme } from '@/utils/material-theme';
import useTheme from './useTheme';

const primaryColor = ref('#6bb9f0'); // Default primary color from old main.css

export const useColorPalette = () => {
    const { isDark } = useTheme();

    const currentTheme = computed<ColorScheme>(() => {
        return generateTheme(primaryColor.value, isDark.value);
    });

    const setPrimaryColor = (color: string) => {
        primaryColor.value = color;
    };

    // Automatically apply theme to root when color or dark mode changes
    if (import.meta.client) {
        watchEffect(() => {
            applyThemeToRoot(currentTheme.value);
        });
    }

    return {
        primaryColor,
        setPrimaryColor,
        currentTheme,
    };
};
