import {
    argbFromHex,
    themeFromSourceColor,
    hexFromArgb,
    type Theme,
} from "@material/material-color-utilities";

export interface ColorScheme {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    surfaceDim: string;
    surfaceBright: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
}

export function generateTheme(sourceColorHex: string, isDark: boolean): ColorScheme {
    const argb = argbFromHex(sourceColorHex);
    const theme: Theme = themeFromSourceColor(argb);
    const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
    const palettes = theme.palettes;

    // Helper to get hex from Tone
    // const getTone = (palette: any, tone: number) => hexFromArgb(palette.tone(tone));

    // Mapping MD3 Scheme to CSS Variables structure
    return {
        primary: hexFromArgb(scheme.primary),
        onPrimary: hexFromArgb(scheme.onPrimary),
        primaryContainer: hexFromArgb(scheme.primaryContainer),
        onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
        secondary: hexFromArgb(scheme.secondary),
        onSecondary: hexFromArgb(scheme.onSecondary),
        secondaryContainer: hexFromArgb(scheme.secondaryContainer),
        onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
        tertiary: hexFromArgb(scheme.tertiary),
        onTertiary: hexFromArgb(scheme.onTertiary),
        tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
        onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
        error: hexFromArgb(scheme.error),
        onError: hexFromArgb(scheme.onError),
        errorContainer: hexFromArgb(scheme.errorContainer),
        onErrorContainer: hexFromArgb(scheme.onErrorContainer),
        background: hexFromArgb(scheme.background),
        onBackground: hexFromArgb(scheme.onBackground),
        surface: hexFromArgb(scheme.surface),
        onSurface: hexFromArgb(scheme.onSurface),
        surfaceVariant: hexFromArgb(scheme.surfaceVariant),
        onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
        outline: hexFromArgb(scheme.outline),
        outlineVariant: hexFromArgb(scheme.outlineVariant),
        shadow: hexFromArgb(scheme.shadow),
        scrim: hexFromArgb(scheme.scrim),
        inverseSurface: hexFromArgb(scheme.inverseSurface),
        inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
        inversePrimary: hexFromArgb(scheme.inversePrimary),
        // Additional Surface roles (approximated from standard tones if not directly in scheme object in this version)
        // Note: material-color-utilities 0.3.0 might strictly follow scheme props.
        // If some props are missing in TS defs, we map them from palettes or available scheme props.
        // For simplicity and compatibility, we use standard mapping:
        surfaceDim: hexFromArgb(palettes.neutral.tone(isDark ? 6 : 87)), 
        surfaceBright: hexFromArgb(palettes.neutral.tone(isDark ? 24 : 98)),
        surfaceContainerLowest: hexFromArgb(palettes.neutral.tone(isDark ? 4 : 100)),
        surfaceContainerLow: hexFromArgb(palettes.neutral.tone(isDark ? 10 : 96)),
        surfaceContainer: hexFromArgb(palettes.neutral.tone(isDark ? 12 : 94)),
        surfaceContainerHigh: hexFromArgb(palettes.neutral.tone(isDark ? 17 : 92)),
        surfaceContainerHighest: hexFromArgb(palettes.neutral.tone(isDark ? 22 : 90)),
    };
}

export function applyThemeToRoot(theme: ColorScheme) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
        // Convert camelCase to kebab-case for CSS variables: primaryContainer -> --md-sys-color-primary-container
        const cssVarName = `--md-sys-color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
    });
}
