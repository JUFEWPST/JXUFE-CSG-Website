import { inject, type ComputedRef } from 'vue'

interface ButtonGroupContext {
    selectedValue: ComputedRef<string | number | undefined>
    select: (value: string | number) => void
    direction: ComputedRef<'horizontal' | 'vertical'>
    gap: ComputedRef<'none' | 'sm' | 'md' | 'lg'>
}

export const useButtonGroup = () => {
    const context = inject<ButtonGroupContext>('buttonGroup')

    if (!context) {
        console.warn('useButtonGroup must be used within an AnzuButtonGroup')
        return null
    }

    return context
}
