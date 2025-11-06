interface ColorPaletteOptions {
    primaryColor?: string
}

export const useColorPalette = (options?: ColorPaletteOptions) => {
    const baseColor = ref(options?.primaryColor || '#3aa2fc')
    const { isDark } = useTheme()
    const adjustAlpha = (color: string, alpha: number): string => {
        // hex 颜色
        if (color.startsWith('#') && color.length === 7) {
            const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0')
            return color + alphaHex
        }

        // rgba 颜色
        if (color.startsWith('rgba')) {
            return color.replace(/[\d.]+\)$/, `${alpha})`)
        }

        // rgb 颜色
        if (color.startsWith('rgb') && !color.startsWith('rgba')) {
            const rgbValues = color.match(/\d+/g)
            if (rgbValues && rgbValues.length === 3) {
                return `rgba(${rgbValues.join(', ')}, ${alpha})`
            }
        }

        // oklch 颜色
        if (color.startsWith('oklch')) {
            const oklchMatch = color.match(/oklch\(\s*([^/]+?)(?:\s*\/\s*([\d.]+))?\s*\)/)

            if (oklchMatch) {
                const baseValues = oklchMatch[1].trim()
                if (oklchMatch[2] !== undefined) {
                    return color.replace(/\/\s*[\d.]+/, ` / ${alpha}`)
                } else {
                    return `oklch(${baseValues} / ${alpha})`
                }
            }
        }

        return color
    }

    // 浅色
    const lightPalette = computed(() => ({
        primary: baseColor.value,
        onPrimary: '#FFFFFF',
        primaryContainer: adjustAlpha(baseColor.value, 0.12),
        onPrimaryContainer: baseColor.value,
        surface: '#FFFFFF',
        onSurface: '#1C1B1F',
        surfaceVariant: adjustAlpha('#E7E0EC', 1),
        outline: adjustAlpha('#79747E', 0.5),
        outlineVariant: adjustAlpha('#DFD8E0', 1),
        disabled: adjustAlpha('#A8A29E', 0.38),
        onDisabled: adjustAlpha('#1C1B1F', 0.38),
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
    }))

    // 深色
    const darkPalette = computed(() => ({
        primary: baseColor.value,
        onPrimary: '#000000',
        primaryContainer: adjustAlpha(baseColor.value, 0.3),
        onPrimaryContainer: '#EADDFF',
        surface: '#1C1B1F',
        onSurface: '#E6E1E5',
        surfaceVariant: adjustAlpha('#49454F', 1),
        outline: adjustAlpha('#938F99', 0.5),
        outlineVariant: adjustAlpha('#49454F', 1),
        disabled: adjustAlpha('#A8A29E', 0.38),
        onDisabled: adjustAlpha('#E6E1E5', 0.38),
        success: '#66BB6A',
        warning: '#FFB74D',
        error: '#EF5350',
        info: '#42A5F5'
    }))

    const colorPalette = computed(() =>
        isDark.value ? darkPalette.value : lightPalette.value
    )

    // 设置主色
    const setPrimaryColor = (color: string) => {
        baseColor.value = color
    }

    const cssVariables = computed(() => {
        const palette = colorPalette.value
        return Object.entries(palette).reduce((acc, [key, value]) => {
            acc[`--color-${key}`] = value
            return acc
        }, {} as Record<string, string>)
    })

    return {
        // 响应式调色板
        colorPalette,

        // 操作方法
        setPrimaryColor,

        isDark: readonly(isDark),
        baseColor: readonly(baseColor),
        cssVariables,

        adjustAlpha
    }
}
