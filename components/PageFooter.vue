<template>
  <footer
    class="bg-(--md-sys-color-surface-container) dark:bg-(--md-sys-color-surface-container) border-t border-(--md-sys-color-outline-variant)/10 py-4 text-center text-(--md-sys-color-on-surface-variant)/70 text-sm transition-colors duration-300">
    <div class="max-w-5xl mx-auto border-t border-dashed border-(--md-sys-color-outline-variant)/60 pt-3">
      <p>
        © {{ new Date().getFullYear() === 2025 ? `2025` : `2025-${new Date().getFullYear()}` }}
        <span class="text-(--md-sys-color-primary) font-medium">
          {{ t("meta.fullName") }}
        </span>
        All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const { t } = useI18n()
</script>
