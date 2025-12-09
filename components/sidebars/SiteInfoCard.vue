<template>
  <div>
    <div class="flex items-center mb-4 group">
      <h3 class="text-xl font-bold">
        {{ t('meta.fullName') }}
      </h3>
      <span
        class="ml-2 text-(--md-sys-color-tertiary) opacity-0 group-hover:opacity-100 transition-opacity">✧</span>
    </div>

    <div>
      <h4 class="text-(--md-sys-color-on-surface) font-bold mb-2 flex items-center">
        {{ t('footer.contact') }}
      </h4>
      <ul class="space-y-3">
        <li class="flex items-center group">
          <div
            class="w-8 h-8 rounded-lg bg-(--md-sys-color-secondary-container) flex items-center justify-center mr-3 group-hover:bg-(--md-sys-color-primary-container) transition-colors shrink-0"
          >
            <MapPinIcon
              class="shrink-0 h-5 w-5 text-(--md-sys-color-on-secondary-container) group-hover:text-(--md-sys-color-on-primary-container)"
            />
          </div>
          <span class="text-(--md-sys-color-on-surface-variant) wrap-break-word flex-1 min-w-0">
            {{ t('footer.address') }}
          </span>
        </li>
        <li class="flex items-center group">
          <div
            class="w-8 h-8 rounded-lg bg-(--md-sys-color-secondary-container) flex items-center justify-center mr-3 group-hover:bg-(--md-sys-color-primary-container) transition-colors shrink-0"
          >
            <EnvelopeIcon
              class="shrink-0 h-5 w-5 text-(--md-sys-color-on-secondary-container) group-hover:text-(--md-sys-color-on-primary-container)"
            />
          </div>
          <span class="text-(--md-sys-color-on-surface-variant) wrap-break-word flex-1 min-w-0">
            1834488130@qq.com
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPinIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
</script>
