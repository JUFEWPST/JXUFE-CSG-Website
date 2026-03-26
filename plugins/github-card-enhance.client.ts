type GithubCardType = "user" | "repo" | "issue" | "pull" | "release";

interface GithubCardDataset {
    key: string;
    type: GithubCardType;
    owner: string;
    repo?: string;
    number?: string;
    tag?: string;
}

interface GithubCardData {
    title?: string;
    subtitle?: string;
    description?: string;
    stats?: string[];
    state?: string;
    imageUrl?: string;
}

interface CachedGithubCardData {
    expiresAt: number;
    value: GithubCardData;
}

const CACHE_PREFIX = "gh-card:v1:";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const inFlight = new Map<string, Promise<GithubCardData | null>>();

const formatNumber = (value: number): string => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }
    return `${value}`;
};

const escapeHtml = (value: string): string => {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
};

const renderStatsHtml = (stats: string[]): string => {
    return stats
        .map((stat) => {
            const match = stat.match(/^(\S+)\s+(.+)$/);
            if (!match) {
                return `<span style="white-space:nowrap;"><strong style="font-weight:700;color:var(--md-sys-color-on-surface);">${escapeHtml(stat)}</strong></span>`;
            }

            const value = match[1] || stat;
            const label = match[2] || "";
            return `<span style="white-space:nowrap;"><strong style="font-weight:700;color:var(--md-sys-color-on-surface);">${escapeHtml(value)}</strong> ${escapeHtml(label)}</span>`;
        })
        .join('<span aria-hidden="true"> · </span>');
};

const getCache = (key: string): GithubCardData | null => {
    try {
        const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CachedGithubCardData;
        if (!parsed || typeof parsed.expiresAt !== "number") return null;
        if (parsed.expiresAt < Date.now()) {
            localStorage.removeItem(`${CACHE_PREFIX}${key}`);
            return null;
        }
        return parsed.value || null;
    } catch {
        return null;
    }
};

const setCache = (key: string, value: GithubCardData): void => {
    try {
        const payload: CachedGithubCardData = {
            expiresAt: Date.now() + CACHE_TTL_MS,
            value,
        };
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(payload));
    } catch {
        // Ignore quota and JSON errors.
    }
};

const fetchJson = async <T>(url: string): Promise<T | null> => {
    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json",
            },
        });

        if (!response.ok) return null;
        return (await response.json()) as T;
    } catch {
        return null;
    }
};

const buildApiUrl = (dataset: GithubCardDataset): string | null => {
    const owner = encodeURIComponent(dataset.owner);
    const repo = dataset.repo ? encodeURIComponent(dataset.repo) : "";

    if (dataset.type === "user") {
        return `https://api.github.com/users/${owner}`;
    }

    if (!dataset.repo) return null;

    if (dataset.type === "repo") {
        return `https://api.github.com/repos/${owner}/${repo}`;
    }

    if (dataset.type === "issue" && dataset.number) {
        return `https://api.github.com/repos/${owner}/${repo}/issues/${encodeURIComponent(dataset.number)}`;
    }

    if (dataset.type === "pull" && dataset.number) {
        return `https://api.github.com/repos/${owner}/${repo}/pulls/${encodeURIComponent(dataset.number)}`;
    }

    if (dataset.type === "release") {
        if (dataset.tag) {
            return `https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(dataset.tag)}`;
        }
        if (dataset.number && /^\d+$/.test(dataset.number)) {
            return `https://api.github.com/repos/${owner}/${repo}/releases/${encodeURIComponent(dataset.number)}`;
        }
        return `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
    }

    return null;
};

const mapGithubData = (
    dataset: GithubCardDataset,
    payload: any,
): GithubCardData | null => {
    if (!payload) return null;

    if (dataset.type === "user") {
        return {
            title: payload.name || `@${payload.login || dataset.owner}`,
            subtitle: `@${payload.login || dataset.owner}`,
            description: payload.bio || "GitHub User",
            stats: [
                `${formatNumber(payload.followers || 0)} followers`,
                `${formatNumber(payload.public_repos || 0)} repos`,
            ],
            imageUrl: payload.avatar_url,
        };
    }

    if (dataset.type === "repo") {
        return {
            title: payload.full_name,
            subtitle: payload.language || "Repository",
            description: payload.description || "GitHub repository",
            stats: [
                `${formatNumber(payload.stargazers_count || 0)} stars`,
                `${formatNumber(payload.forks_count || 0)} forks`,
                `${formatNumber(payload.open_issues_count || 0)} issues`,
            ],
        };
    }

    if (dataset.type === "issue") {
        if (payload.pull_request) return null;
        return {
            title: payload.title,
            subtitle: `${dataset.owner}/${dataset.repo} #${payload.number}`,
            description: payload.user?.login
                ? `opened by @${payload.user.login}`
                : "GitHub Issue",
            stats: [`${formatNumber(payload.comments || 0)} comments`],
            state: payload.state,
        };
    }

    if (dataset.type === "pull") {
        return {
            title: payload.title,
            subtitle: `${dataset.owner}/${dataset.repo} #${payload.number}`,
            description: payload.user?.login
                ? `opened by @${payload.user.login}`
                : "GitHub Pull Request",
            stats: [`${formatNumber(payload.comments || 0)} comments`],
            state: payload.merged_at ? "merged" : payload.state,
        };
    }

    if (dataset.type === "release") {
        return {
            title: payload.name || payload.tag_name,
            subtitle: `${dataset.owner}/${dataset.repo} ${payload.tag_name || "release"}`,
            description: payload.author?.login
                ? `published by @${payload.author.login}`
                : "GitHub Release",
            state: payload.draft
                ? "draft"
                : payload.prerelease
                  ? "prerelease"
                  : "released",
        };
    }

    return null;
};

const extractDataset = (card: HTMLElement): GithubCardDataset | null => {
    const key = card.dataset.ghKey || "";
    const type = card.dataset.ghType as GithubCardType | undefined;
    const owner = card.dataset.ghOwner || "";

    if (!key || !type || !owner) return null;

    return {
        key,
        type,
        owner,
        repo: card.dataset.ghRepo || undefined,
        number: card.dataset.ghNumber || undefined,
        tag: card.dataset.ghTag || undefined,
    };
};

const getGithubCardData = async (
    dataset: GithubCardDataset,
): Promise<GithubCardData | null> => {
    const cached = getCache(dataset.key);
    if (cached) return cached;

    const pending = inFlight.get(dataset.key);
    if (pending) return pending;

    const url = buildApiUrl(dataset);
    if (!url) return null;

    const task = fetchJson<any>(url)
        .then((payload) => {
            const mapped = mapGithubData(dataset, payload);
            if (mapped) {
                setCache(dataset.key, mapped);
            }
            return mapped;
        })
        .finally(() => {
            inFlight.delete(dataset.key);
        });

    inFlight.set(dataset.key, task);
    return task;
};

const bindImageFallback = (card: HTMLElement): void => {
    const images = card.querySelectorAll<HTMLImageElement>(".js-gh-image");
    images.forEach((img) => {
        if (img.dataset.ghErrorBound === "1") return;
        img.dataset.ghErrorBound = "1";

        img.addEventListener("error", () => {
            img.style.display = "none";
        });
    });
};

const applyDataToCard = (card: HTMLElement, data: GithubCardData): void => {
    const title = card.querySelector<HTMLElement>(".js-gh-title");
    const subtitle = card.querySelector<HTMLElement>(".js-gh-subtitle");
    const desc = card.querySelector<HTMLElement>(".js-gh-desc");
    const state = card.querySelector<HTMLElement>(".js-gh-state");
    const stats = card.querySelector<HTMLElement>(".js-gh-stats");
    const firstImage = card.querySelector<HTMLImageElement>(".js-gh-image");

    if (title && data.title) {
        title.textContent = data.title;
    }

    if (subtitle && data.subtitle) {
        subtitle.textContent = data.subtitle;
    }

    if (desc && data.description) {
        desc.textContent = data.description;
    }

    if (state) {
        state.textContent = data.state || "GitHub";
    }

    if (stats) {
        if (data.stats && data.stats.length > 0) {
            stats.style.display = "inline-flex";
            stats.innerHTML = renderStatsHtml(data.stats);
        } else {
            stats.style.display = "none";
            stats.textContent = "";
        }
    }

    if (firstImage && data.imageUrl) {
        firstImage.src = data.imageUrl;
        firstImage.style.display = "";
    }
};

const enhanceCard = async (card: HTMLElement): Promise<void> => {
    if (card.dataset.ghInit === "1") return;
    card.dataset.ghInit = "1";

    bindImageFallback(card);

    const dataset = extractDataset(card);
    if (!dataset) return;

    const detail = await getGithubCardData(dataset);
    if (!detail) return;

    applyDataToCard(card, detail);
};

const enhanceAllCards = (): void => {
    const cards = document.querySelectorAll<HTMLElement>(".js-gh-card");
    cards.forEach((card) => {
        void enhanceCard(card);
    });
};

export default defineNuxtPlugin((nuxtApp) => {
    if (!import.meta.client) return;

    let rafId = 0;
    const scheduleEnhance = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            enhanceAllCards();
        });
    };

    nuxtApp.hook("app:mounted", scheduleEnhance);
    nuxtApp.hook("page:finish", scheduleEnhance);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                scheduleEnhance();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
