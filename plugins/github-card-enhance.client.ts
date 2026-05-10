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

const fetchJson = <T>(url: string): Promise<T | null> => {
    return fetch(url, {
        headers: {
            Accept: "application/vnd.github+json",
        },
    })
        .then((response) => {
            if (!response.ok) return null;
            return response.json() as Promise<T>;
        })
        .catch(() => null);
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

const asRecord = (payload: unknown): Record<string, unknown> | null => {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    return payload as Record<string, unknown>;
};

const getUserLogin = (value: unknown): string | null => {
    const record = asRecord(value);
    if (!record || typeof record.login !== "string" || !record.login) {
        return null;
    }

    return `@${record.login}`;
};

const mapUserData = (
    dataset: GithubCardDataset,
    data: Record<string, unknown>,
): GithubCardData => {
    const login = typeof data.login === "string" ? data.login : dataset.owner;
    const title =
        typeof data.name === "string" && data.name ? data.name : `@${login}`;
    const description =
        typeof data.bio === "string" && data.bio ? data.bio : "GitHub User";
    const avatarUrl =
        typeof data.avatar_url === "string" ? data.avatar_url : "";
    const followers = typeof data.followers === "number" ? data.followers : 0;
    const repos = typeof data.public_repos === "number" ? data.public_repos : 0;

    return {
        title,
        subtitle: `@${login}`,
        description,
        stats: [
            `${formatNumber(followers)} followers`,
            `${formatNumber(repos)} repos`,
        ],
        imageUrl: avatarUrl,
    };
};

const mapRepoData = (data: Record<string, unknown>): GithubCardData => {
    const fullName = typeof data.full_name === "string" ? data.full_name : "";
    const language =
        typeof data.language === "string" ? data.language : "Repository";
    const description =
        typeof data.description === "string" && data.description
            ? data.description
            : "GitHub repository";
    const stars =
        typeof data.stargazers_count === "number" ? data.stargazers_count : 0;
    const forks = typeof data.forks_count === "number" ? data.forks_count : 0;
    const issues =
        typeof data.open_issues_count === "number" ? data.open_issues_count : 0;

    return {
        title: fullName,
        subtitle: language,
        description,
        stats: [
            `${formatNumber(stars)} stars`,
            `${formatNumber(forks)} forks`,
            `${formatNumber(issues)} issues`,
        ],
    };
};

const mapIssueData = (
    dataset: GithubCardDataset,
    data: Record<string, unknown>,
): GithubCardData | null => {
    if (data.pull_request) {
        return null;
    }

    const comments = typeof data.comments === "number" ? data.comments : 0;
    const state = typeof data.state === "string" ? data.state : "open";
    const title = typeof data.title === "string" ? data.title : "";
    const number =
        typeof data.number === "number"
            ? `${data.number}`
            : dataset.number || "";
    const userLogin = getUserLogin(data.user);

    return {
        title,
        subtitle: `${dataset.owner}/${dataset.repo} #${number}`,
        description: userLogin ? `opened by ${userLogin}` : "GitHub Issue",
        stats: [`${formatNumber(comments)} comments`],
        state,
    };
};

const mapPullData = (
    dataset: GithubCardDataset,
    data: Record<string, unknown>,
): GithubCardData => {
    const comments = typeof data.comments === "number" ? data.comments : 0;
    const state =
        typeof data.merged_at === "string" && data.merged_at
            ? "merged"
            : typeof data.state === "string"
              ? data.state
              : "open";
    const title = typeof data.title === "string" ? data.title : "";
    const number =
        typeof data.number === "number"
            ? `${data.number}`
            : dataset.number || "";
    const userLogin = getUserLogin(data.user);

    return {
        title,
        subtitle: `${dataset.owner}/${dataset.repo} #${number}`,
        description: userLogin
            ? `opened by ${userLogin}`
            : "GitHub Pull Request",
        stats: [`${formatNumber(comments)} comments`],
        state,
    };
};

const mapReleaseData = (
    dataset: GithubCardDataset,
    data: Record<string, unknown>,
): GithubCardData => {
    const name = typeof data.name === "string" && data.name ? data.name : "";
    const tagName =
        typeof data.tag_name === "string" ? data.tag_name : "release";
    const authorLogin = getUserLogin(data.author);
    const draft = Boolean(data.draft);
    const prerelease = Boolean(data.prerelease);

    return {
        title: name || tagName,
        subtitle: `${dataset.owner}/${dataset.repo} ${tagName}`,
        description: authorLogin
            ? `published by ${authorLogin}`
            : "GitHub Release",
        state: draft ? "draft" : prerelease ? "prerelease" : "released",
    };
};

const mapGithubData = (
    dataset: GithubCardDataset,
    payload: unknown,
): GithubCardData | null => {
    const data = asRecord(payload);
    if (!data) return null;

    if (dataset.type === "user") {
        return mapUserData(dataset, data);
    }

    if (dataset.type === "repo") {
        return mapRepoData(data);
    }

    if (dataset.type === "issue") {
        return mapIssueData(dataset, data);
    }

    if (dataset.type === "pull") {
        return mapPullData(dataset, data);
    }

    if (dataset.type === "release") {
        return mapReleaseData(dataset, data);
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
        repo: card.dataset.ghRepo,
        number: card.dataset.ghNumber,
        tag: card.dataset.ghTag,
    };
};

const getGithubCardData = (
    dataset: GithubCardDataset,
): Promise<GithubCardData | null> => {
    const cached = getCache(dataset.key);
    if (cached) return Promise.resolve(cached);

    const pending = inFlight.get(dataset.key);
    if (pending) return pending;

    const url = buildApiUrl(dataset);
    if (!url) return Promise.resolve(null);

    const task = fetchJson<unknown>(url)
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
    for (const img of images) {
        if (!img || img.dataset.ghErrorBound === "1") continue;
        img.dataset.ghErrorBound = "1";

        img.addEventListener("error", () => {
            img.style.display = "none";
        });
    }
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

const enhanceCard = (card: HTMLElement): Promise<void> => {
    if (card.dataset.ghInit === "1") return Promise.resolve();
    card.dataset.ghInit = "1";

    bindImageFallback(card);

    const dataset = extractDataset(card);
    if (!dataset) return Promise.resolve();

    return getGithubCardData(dataset).then((detail) => {
        if (detail) {
            applyDataToCard(card, detail);
        }
    });
};

const enhanceAllCards = (): void => {
    const cards = document.querySelectorAll<HTMLElement>(".js-gh-card");
    for (const card of cards) {
        enhanceCard(card).catch(() => {
            // Silent catch for enhancement errors
        });
    }
};

export default defineNuxtPlugin((nuxtApp) => {
    if (!import.meta.client) return;

    let rafId = 0;
    const scheduleEnhance = (): void => {
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
