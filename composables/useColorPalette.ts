import { ref, computed, watchEffect } from 'vue'
import { generateTheme, applyThemeToRoot, type ColorScheme } from '@/utils/material-theme'
import useTheme from './useTheme'

const primaryColor = ref('#A61E33') 

const isValidHexColor = (color: string) =>
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)

export const useColorPalette = () => {
  const { isDark } = useTheme()
  const safePrimary = computed(() => {
    return isValidHexColor(primaryColor.value) ? primaryColor.value : '#A61E33'
  })

  const currentTheme = computed<ColorScheme>(() => {
    return generateTheme(safePrimary.value, isDark.value)
  })

  const colorPalette = computed(() => {
    const base = currentTheme.value

    return {
      ...base,
      disabled: isDark.value ? base.surfaceContainerHigh : base.surfaceContainerLow,
      onDisabled: base.onSurfaceVariant,
    }
  })

  const setPrimaryColor = (color: string) => {
    if (typeof color === 'string' && isValidHexColor(color)) {
      primaryColor.value = color
    }
  }

  if (import.meta.client) {
    watchEffect(() => {
      applyThemeToRoot(currentTheme.value)
    })
  }

  return {
    primaryColor,
    setPrimaryColor,
    currentTheme,
    colorPalette,
  }
}
