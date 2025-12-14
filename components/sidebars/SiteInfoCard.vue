<template>
    <div class="space-y-4">
        <!--<div class="relative w-full overflow-hidden rounded-lg bg-transparent" style="aspect-ratio: 3 / 2">
      <img
        src="/MahouCsg.svg"
        alt="MahouCsg"
        class="h-full w-full object-contain"
        draggable="false"
      />
    </div>-->
        <div class="space-y-2">
            <div
                class="text-xs font-medium tracking-wide text-(--md-sys-color-on-surface-variant)"
            >
                {{ t("footer.contact") }}
            </div>

            <ul class="space-y-2">
                <li class="flex items-center gap-2">
                    <div
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-(--md-sys-color-secondary-container)"
                    >
                        <MapPinIcon
                            class="h-4 w-4 text-(--md-sys-color-on-secondary-container)"
                        />
                    </div>
                    <span
                        class="min-w-0 flex-1 text-sm leading-relaxed wrap-break-word text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("footer.address") }}
                    </span>
                </li>

                <li class="flex items-center gap-2">
                    <div
                        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-(--md-sys-color-secondary-container)"
                    >
                        <EnvelopeIcon
                            class="h-4 w-4 text-(--md-sys-color-on-secondary-container)"
                        />
                    </div>
                    <span
                        class="min-w-0 flex-1 text-sm leading-relaxed break-all text-(--md-sys-color-on-surface-variant)"
                    >
                        1834488130@qq.com
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MapPinIcon, EnvelopeIcon } from "@heroicons/vue/24/outline";

const { t } = useI18n();
</script>
