<script setup lang="ts">
import { ref } from 'vue'
import { useColorPalette } from '@/composables/useColorPalette'
import { PaintBrushIcon } from '@heroicons/vue/24/outline'

const { primaryColor, setPrimaryColor } = useColorPalette()

const showPicker = ref(false)

const presetColors = [
  '#6bb9f0', // Blue
  '#6750A4', // M3 Purple
  '#9C27B0', // Deep Purple
  '#E91E63', // Pink
  '#F44336', // Red
  '#FF9800', // Orange
  '#FFC107', // Amber
  '#4CAF50', // Green
  '#009688', // Teal
  '#00BCD4', // Cyan
  '#2196F3', // Blue
  '#3F51B5', // Indigo
  '#607D8B', // Blue Grey
]

const updateColor = (event: Event) => {
    const target = event.target as HTMLInputElement
    setPrimaryColor(target.value)
}

const selectPreset = (color: string) => {
    setPrimaryColor(color)
    showPicker.value = false
}
</script>

<template>
  <div class="relative inline-block text-left">
    <button 
        @click="showPicker = !showPicker"
        class="rounded-full w-[30px] h-[30px] flex items-center justify-center transition-colors duration-200 hover:bg-(--md-sys-color-surface-container-high) text-(--md-sys-color-on-surface)"
        title="Change Theme Color"
    >
      <PaintBrushIcon class="p-1.5 box-border w-full h-full" />
    </button>

    <div 
        v-if="showPicker"
        class="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-(--md-sys-color-surface-container) shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-4 border border-(--md-sys-color-outline-variant)"
    >
        <div class="mb-3">
            <label class="block text-xs font-medium text-(--md-sys-color-on-surface-variant) mb-2">Custom Color</label>
            <div class="flex items-center gap-2">
                 <div 
                    class="w-8 h-8 rounded-full border border-(--md-sys-color-outline-variant)" 
                    :style="{ background: primaryColor }"
                 ></div>
                <input 
                    type="color" 
                    :value="primaryColor" 
                    @input="updateColor"
                    class="opacity-0 absolute w-8 h-8 cursor-pointer"
                />
                <span class="text-sm font-mono text-(--md-sys-color-on-surface)">{{ primaryColor }}</span>
            </div>
        </div>

        <div>
            <label class="block text-xs font-medium text-(--md-sys-color-on-surface-variant) mb-2">Presets</label>
            <div class="grid grid-cols-5 gap-2">
                <button 
                    v-for="color in presetColors" 
                    :key="color"
                    @click="selectPreset(color)"
                    class="w-8 h-8 rounded-full border border-transparent hover:scale-110 transition-transform focus:outline-none focus:ring-2 ring-offset-1 ring-(--md-sys-color-primary)"
                    :style="{ backgroundColor: color }"
                    :class="{ 'ring-2 ring-(--md-sys-color-primary)': primaryColor === color }"
                ></button>
            </div>
        </div>
        <div 
            v-if="showPicker" 
            class="fixed inset-0 z-[-1]" 
            @click="showPicker = false"
        ></div>
    </div>
  </div>
</template>
