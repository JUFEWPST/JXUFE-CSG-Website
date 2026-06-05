import type { MarkdownPlugin } from "../plugin";

export type GithubLinkType = "user" | "repo" | "issue" | "pull" | "release";

export interface ParsedGithubLink {
    href: string;
    type: GithubLinkType;
    owner: string;
    repo?: string;
    number?: string;
    tag?: string;
}

const RESERVED_PATHS = new Set([
    "login",
    "logout",
    "signup",
    "settings",
    "notifications",
    "explore",
    "marketplace",
    "sponsors",
    "codespaces",
    "organizations",
    "pricing",
    "features",
    "new",
    "import",
    "search",
    "dashboard",
    "stars",
    "gists",
    "discussions",
    "topics",
    "trending",
    "collections",
    "events",
    "about",
    "blog",
    "contact",
    "security",
    "pull",
    "issues",
    "pulls",
    "releases",
    "tags",
    "tree",
    "blob",
    "commit",
    "commits",
    "watchers",
    "stargazers",
    "forks",
    "branches",
    "account",
    "copilot",
    "orgs",
]);

const STANDALONE_GITHUB_LINK_REGEX =
    /^(?:\[(?<label>[^\]]+)\]\((?<markdownUrl>https?:\/\/(?:www\.)?github\.com\/[^)\s]+)\)|<(?<angleUrl>https?:\/\/(?:www\.)?github\.com\/[^>\s]+)>|(?<rawUrl>https?:\/\/(?:www\.)?github\.com\/\S+))$/;

/** 行内 markdown 链接 [text](github-url)，允许前后都有其他文本 */
const INLINE_GITHUB_MARKDOWN_LINK_REGEX =
    /^(?<prefix>.*?)\[(?<label>[^\]]+)\]\((?<markdownUrl>https?:\/\/(?:www\.)?github\.com\/[^)\s]+)\)(?<suffix>[\s\S]*)$/;

const TRAILING_GITHUB_URL_REGEX =
    /^(?<prefix>.+?)\s*(?:\[(?<label>[^\]]+)\]\((?<markdownUrl>https?:\/\/(?:www\.)?github\.com\/[^)\s]+)\)|(?<rawUrl>https?:\/\/(?:www\.)?github\.com\/\S+))\s*$/;

export const getLinkKey = (link: ParsedGithubLink): string =>
    [
        link.type,
        link.owner,
        link.repo || "",
        link.number || "",
        link.tag || "",
    ].join(":");

export const parseGithubLink = (href: string): ParsedGithubLink | null => {
    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return null;
    }

    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
        return null;
    }

    const segments = url.pathname
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .filter(Boolean);

    const owner = segments[0];
    if (!owner || RESERVED_PATHS.has(owner)) return null;

    if (segments.length === 1) {
        return { href: url.toString(), type: "user", owner };
    }

    const repo = segments[1] ? segments[1].replace(/\.git$/i, "") : null;
    if (!repo || RESERVED_PATHS.has(repo)) return null;

    if (segments.length === 2) {
        return { href: url.toString(), type: "repo", owner, repo };
    }

    const marker = segments[2];
    const id = segments[3];

    if (marker === "issues" && id && /^\d+$/.test(id)) {
        return { href: url.toString(), type: "issue", owner, repo, number: id };
    }

    if ((marker === "pull" || marker === "pulls") && id && /^\d+$/.test(id)) {
        return { href: url.toString(), type: "pull", owner, repo, number: id };
    }

    if (marker === "releases") {
        if (segments[3] === "tag" && segments[4]) {
            return {
                href: url.toString(),
                type: "release",
                owner,
                repo,
                tag: decodeURIComponent(segments.slice(4).join("/")),
            };
        }
        return {
            href: url.toString(),
            type: "release",
            owner,
            repo,
            number: id,
        };
    }

    if (marker && RESERVED_PATHS.has(marker)) {
        return null;
    }

    return { href: url.toString(), type: "repo", owner, repo };
};

const toGithubCardBlock = (href: string): string =>
    `::github-card{href="${href}"}\n::`;

interface ExtractedUrl {
    prefix: string;
    href: string;
    suffix: string;
    // 来源是否为 markdown 链接语法 [text](url)
    isMarkdownLink: boolean;
}

const extractGithubUrl = (line: string): ExtractedUrl | null => {
    // 优先匹配行内 markdown 链接：[text](github-url)，前后可能有其他文本
    let match = line.match(INLINE_GITHUB_MARKDOWN_LINK_REGEX);
    if (match?.groups?.markdownUrl) {
        return {
            prefix: (match.groups.prefix || "").trim(),
            href: match.groups.markdownUrl,
            suffix: (match.groups.suffix || "").trim(),
            isMarkdownLink: true,
        };
    }

    // 落在行尾的 github 链接（裸 URL 或 markdown 语法）
    match = line.match(TRAILING_GITHUB_URL_REGEX);
    if (match?.groups) {
        const prefix = match.groups.prefix || "";
        const href = match.groups.markdownUrl || match.groups.rawUrl || "";
        if (href)
            return {
                prefix,
                href,
                suffix: "",
                isMarkdownLink: !!match.groups.markdownUrl,
            };
    }

    // 独占整行的 github 链接
    match = line.match(STANDALONE_GITHUB_LINK_REGEX);
    if (match?.groups) {
        const href =
            match.groups.markdownUrl ||
            match.groups.angleUrl ||
            match.groups.rawUrl ||
            "";
        if (href)
            return {
                prefix: "",
                href,
                suffix: "",
                isMarkdownLink: !!match.groups.markdownUrl,
            };
    }

    return null;
};

const transform = (segment: string): string =>
    segment
        .split("\n")
        .map((line) => {
            const trimmed = line.trim();
            if (!trimmed) return line;

            const extracted = extractGithubUrl(trimmed);
            if (!extracted) return line;

            if (!parseGithubLink(extracted.href)) return line;

            const cardBlock = toGithubCardBlock(extracted.href);

            // 使用了 markdown 链接语法：保留原始链接文本，追加卡片
            if (extracted.isMarkdownLink) {
                return `${trimmed}\n${cardBlock}`;
            }

            // 裸 URL：替换为卡片，保留前后的其他文本
            const parts: string[] = [];
            if (extracted.prefix) parts.push(extracted.prefix);
            parts.push(cardBlock);
            if (extracted.suffix) parts.push(extracted.suffix);
            return parts.join("\n");
        })
        .join("\n");

export const getCardTitle = (link: ParsedGithubLink): string => {
    if (link.type === "user") return `@${link.owner}`;
    if (!link.repo) return link.owner;
    if (link.type === "issue" || link.type === "pull") {
        return `${link.owner}/${link.repo}#${link.number}`;
    }
    if (link.type === "release") {
        return link.tag
            ? `${link.owner}/${link.repo}@${link.tag}`
            : `${link.owner}/${link.repo} release`;
    }
    return `${link.owner}/${link.repo}`;
};

export const getCardSubTitle = (link: ParsedGithubLink): string => {
    if (link.type === "user") return "GitHub User";
    if (link.type === "repo") return "Repository";
    if (link.type === "issue") return "Issue";
    if (link.type === "pull") return "Pull Request";
    return "Release";
};

export const getPreviewImage = (link: ParsedGithubLink): string => {
    if (link.type === "user") {
        return `https://github.com/${encodeURIComponent(link.owner)}.png?size=96`;
    }

    if (!link.repo) return "";

    if (link.type === "issue" && link.number) {
        return `https://opengraph.githubassets.com/1/${encodeURIComponent(link.owner)}/${encodeURIComponent(link.repo)}/issues/${encodeURIComponent(link.number)}`;
    }

    if (link.type === "pull" && link.number) {
        return `https://opengraph.githubassets.com/1/${encodeURIComponent(link.owner)}/${encodeURIComponent(link.repo)}/pull/${encodeURIComponent(link.number)}`;
    }

    if (link.type === "release") {
        if (link.tag) {
            return `https://opengraph.githubassets.com/1/${encodeURIComponent(link.owner)}/${encodeURIComponent(link.repo)}/releases/tag/${encodeURIComponent(link.tag)}`;
        }
        return `https://opengraph.githubassets.com/1/${encodeURIComponent(link.owner)}/${encodeURIComponent(link.repo)}/releases/${encodeURIComponent(link.number || "latest")}`;
    }

    return `https://opengraph.githubassets.com/githubcard/${encodeURIComponent(link.owner)}/${encodeURIComponent(link.repo)}`;
};

export const githubCardPlugin: MarkdownPlugin = {
    name: "github-card",
    transform,
    components: ["github-card"],
};
