import { transformOutsideFencedBlocks } from "~/utils/markdown-preprocess";

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
    "login", "logout", "signup", "settings", "notifications", "explore",
    "marketplace", "sponsors", "codespaces", "organizations", "pricing",
    "features", "new", "import", "search", "dashboard", "stars", "gists",
    "discussions", "topics", "trending", "collections", "events", "about",
    "blog", "contact", "security", "pull", "issues", "pulls", "releases",
    "tags", "tree", "blob", "commit", "commits", "watchers", "stargazers",
    "forks", "branches", "account", "copilot", "orgs",
]);

const STANDALONE_GITHUB_LINK_REGEX =
    /^(?:\[(?<label>[^\]]+)\]\((?<markdownUrl>https?:\/\/(?:www\.)?github\.com\/[^)\s]+)\)|<(?<angleUrl>https?:\/\/(?:www\.)?github\.com\/[^>\s]+)>|(?<rawUrl>https?:\/\/(?:www\.)?github\.com\/\S+))$/;

const TRAILING_GITHUB_URL_REGEX =
    /^(?<prefix>.+?)\s*(?:\[(?<label>[^\]]+)\]\((?<markdownUrl>https?:\/\/(?:www\.)?github\.com\/[^)\s]+)\)|(?<rawUrl>https?:\/\/(?:www\.)?github\.com\/\S+))\s*$/;

export const getLinkKey = (link: ParsedGithubLink): string => {
    return [
        link.type,
        link.owner,
        link.repo || "",
        link.number || "",
        link.tag || "",
    ].join(":");
};

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
    if (!owner || RESERVED_PATHS.has(owner.toLowerCase())) return null;

    if (segments.length === 1) {
        return {
            href: url.toString(),
            type: "user",
            owner,
        };
    }

    const repo = segments[1] ? segments[1].replace(/\.git$/i, "") : null;
    if (!repo || RESERVED_PATHS.has(repo.toLowerCase())) return null;

    if (segments.length === 2) {
        return {
            href: url.toString(),
            type: "repo",
            owner,
            repo,
        };
    }

    const marker = segments[2];
    const id = segments[3];

    if (marker === "issues" && id && /^\d+$/.test(id)) {
        return {
            href: url.toString(),
            type: "issue",
            owner,
            repo,
            number: id,
        };
    }

    if ((marker === "pull" || marker === "pulls") && id && /^\d+$/.test(id)) {
        return {
            href: url.toString(),
            type: "pull",
            owner,
            repo,
            number: id,
        };
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

    if (segments.length >= 3 && marker && RESERVED_PATHS.has(marker.toLowerCase())) {
        return null;
    }

    return {
        href: url.toString(),
        type: "repo",
        owner,
        repo,
    };
};

const toGithubCardBlock = (href: string): string => {
    return `::github-card{href="${href}"}\n::`;
};

interface ExtractedUrl {
    prefix: string;
    href: string;
}

const extractGithubUrl = (line: string): ExtractedUrl | null => {
    let match = line.match(TRAILING_GITHUB_URL_REGEX);
    if (match?.groups) {
        const prefix = match.groups.prefix || "";
        const href =
            match.groups.markdownUrl ||
            match.groups.rawUrl ||
            "";
        if (href) {
            return { prefix, href };
        }
    }

    match = line.match(STANDALONE_GITHUB_LINK_REGEX);
    if (match?.groups) {
        const href =
            match.groups.markdownUrl ||
            match.groups.angleUrl ||
            match.groups.rawUrl ||
            "";
        if (href) {
            return { prefix: "", href };
        }
    }

    return null;
};

const transformGithubCardEmbeds = (content: string): string => {
    return transformOutsideFencedBlocks(content, (segment) => {
        return segment
            .split("\n")
            .map((line) => {
                const trimmed = line.trim();
                if (!trimmed) {
                    return line;
                }

                const extracted = extractGithubUrl(trimmed);
                if (!extracted) {
                    return line;
                }

                const href = extracted.href;
                if (!parseGithubLink(href)) {
                    return line;
                }

                const cardBlock = toGithubCardBlock(href);
                if (extracted.prefix) {
                    return `${extracted.prefix}\n${cardBlock}`;
                }
                return cardBlock;
            })
            .join("\n");
    });
};

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

export default transformGithubCardEmbeds;
