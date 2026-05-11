<template>
    <div
        v-if="parsed"
        class="js-gh-card my-3 block"
        :data-gh-key="linkKey"
        :data-gh-type="parsed.type"
        :data-gh-owner="parsed.owner"
        :data-gh-repo="parsed.repo || ''"
        :data-gh-number="parsed.number || ''"
        :data-gh-tag="parsed.tag || ''"
        data-gh-renderer="mdc"
    >
        <a
            :href="parsed.href"
            target="_blank"
            rel="noopener noreferrer"
            class="gh-card-link"
        >
            <span class="gh-card-row">
                <img
                    v-if="parsed.type === 'user'"
                    class="js-gh-image gh-card-avatar"
                    :src="previewImage"
                    alt="GitHub avatar"
                    loading="lazy"
                />
                <span class="gh-card-info">
                    <span class="js-gh-title gh-card-title">
                        {{ cardTitle }}
                    </span>
                    <span class="js-gh-desc gh-card-desc">
                        {{ parsed.href }}
                    </span>
                </span>
            </span>

            <img
                v-if="parsed.type !== 'user'"
                class="js-gh-image gh-card-preview"
                :src="previewImage"
                alt="GitHub preview"
                loading="lazy"
            />

            <span class="gh-card-footer">
                <span class="js-gh-subtitle gh-card-badge">
                    {{ cardSubtitle }}
                </span>
                <span class="gh-card-meta">
                    <span class="js-gh-stats gh-card-stats" />
                    <span class="js-gh-state gh-card-state">
                        GitHub
                    </span>
                </span>
            </span>
        </a>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
    getCardSubTitle,
    getCardTitle,
    getLinkKey,
    getPreviewImage,
    parseGithubLink,
} from "~/utils/markdown-github-card";

const props = defineProps<{
    href: string;
}>();

const parsed = computed(() => parseGithubLink(props.href));
const linkKey = computed(() => (parsed.value ? getLinkKey(parsed.value) : ""));
const previewImage = computed(() =>
    parsed.value ? getPreviewImage(parsed.value) : "",
);
const cardTitle = computed(() =>
    parsed.value ? getCardTitle(parsed.value) : props.href,
);
const cardSubtitle = computed(() =>
    parsed.value ? getCardSubTitle(parsed.value) : "GitHub",
);
</script>

<style scoped>
.gh-card-link {
    display: block;
    text-decoration: none;
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.12));
    padding: 0.88rem 0.95rem;
    color: var(--md-sys-color-on-surface, #1c1b1f);
    transition:
        border-color 0.2s;
}

.gh-card-link:hover {
    border-color: var(--md-sys-color-primary, #4f46e5);
}

.gh-card-row {
    display: flex;
    align-items: center;
    gap: 0.68rem;
}

.gh-card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0;
    box-shadow: none;
    flex-shrink: 0;
}

.gh-card-info {
    min-width: 0;
    display: block;
    flex: 1;
}

.gh-card-title {
    display: block;
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--md-sys-color-on-surface, #1c1b1f);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.gh-card-desc {
    display: block;
    margin: 0.14rem 0 0;
    font-size: 0.82rem;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.gh-card-preview {
    width: 100%;
    height: auto;
    max-height: 240px;
    object-fit: contain;
    border-radius: 12px;
    margin: 0.65rem 0 0;
    box-shadow: none;
}

@media (max-width: 639px) {
    .gh-card-preview {
        display: none;
    }
}

.gh-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.7rem;
    margin-top: 0.56rem;
}

.gh-card-badge {
    display: inline-block;
    line-height: 1.2;
    font-size: 0.73rem;
    font-weight: 600;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    border: 1px solid var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.12));
    border-radius: 999px;
    padding: 0.2rem 0.52rem;
}

.gh-card-meta {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    min-width: 0;
    justify-content: flex-end;
}

.gh-card-stats {
    display: none;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.42rem;
    font-size: 0.78rem;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    text-align: right;
}

.gh-card-state {
    font-size: 0.74rem;
    color: var(--md-sys-color-on-surface-variant, #49454f);
    text-transform: capitalize;
}

@media (min-width: 640px) {
    .gh-card-stats {
        display: inline-flex;
    }
}
</style>
