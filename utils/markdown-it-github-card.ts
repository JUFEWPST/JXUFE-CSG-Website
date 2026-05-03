import type MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";

type GithubLinkType = "user" | "repo" | "issue" | "pull" | "release";

interface ParsedGithubLink {
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

const getLinkKey = (link: ParsedGithubLink): string => {
    return [
        link.type,
        link.owner,
        link.repo || "",
        link.number || "",
        link.tag || "",
    ].join(":");
};

const parseGithubLink = (href: string): ParsedGithubLink | null => {
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

    const repo = segments[1]?.replace(/\.git$/i, "");
    if (!repo) return null;

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

    return {
        href: url.toString(),
        type: "repo",
        owner,
        repo,
    };
};

const getCardTitle = (link: ParsedGithubLink): string => {
    if (link.type === "user") return `@${link.owner}`;
    if (!link.repo) return link.owner;
    if (link.type === "issue")
        return `${link.owner}/${link.repo}#${link.number}`;
    if (link.type === "pull")
        return `${link.owner}/${link.repo}#${link.number}`;
    if (link.type === "release") {
        return link.tag
            ? `${link.owner}/${link.repo}@${link.tag}`
            : `${link.owner}/${link.repo} release`;
    }
    return `${link.owner}/${link.repo}`;
};

const getCardSubTitle = (link: ParsedGithubLink): string => {
    if (link.type === "user") return "GitHub User";
    if (link.type === "repo") return "Repository";
    if (link.type === "issue") return "Issue";
    if (link.type === "pull") return "Pull Request";
    return "Release";
};

const getPreviewImage = (link: ParsedGithubLink): string => {
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

const renderGithubCard = (md: MarkdownIt, link: ParsedGithubLink): string => {
    const escapedHref = md.utils.escapeHtml(link.href);
    const escapedTitle = md.utils.escapeHtml(getCardTitle(link));
    const escapedSubTitle = md.utils.escapeHtml(getCardSubTitle(link));
    const escapedType = md.utils.escapeHtml(link.type);
    const escapedOwner = md.utils.escapeHtml(link.owner);
    const escapedRepo = md.utils.escapeHtml(link.repo || "");
    const escapedNumber = md.utils.escapeHtml(link.number || "");
    const escapedTag = md.utils.escapeHtml(link.tag || "");
    const escapedKey = md.utils.escapeHtml(getLinkKey(link));
    const previewImage = getPreviewImage(link);
    const escapedPreviewImage = md.utils.escapeHtml(previewImage);

    const imageHtml =
        link.type === "user"
            ? `<img class="js-gh-image" src="${escapedPreviewImage}" alt="GitHub avatar" loading="lazy" style="width:48px;height:48px;border-radius:50%;object-fit:cover;margin:0;box-shadow:none;" />`
            : `<img class="js-gh-image" src="${escapedPreviewImage}" alt="GitHub preview" loading="lazy" style="width:100%;height:auto;max-height:240px;object-fit:contain;border-radius:12px;margin:0.65rem 0 0;box-shadow:none;" />`;

    return `<span class="js-gh-card" data-gh-key="${escapedKey}" data-gh-type="${escapedType}" data-gh-owner="${escapedOwner}" data-gh-repo="${escapedRepo}" data-gh-number="${escapedNumber}" data-gh-tag="${escapedTag}" style="display:block;margin:0.72rem 0 1rem;">
        <a href="${escapedHref}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;border-radius:16px;border:1px solid var(--md-sys-color-outline-variant);padding:0.88rem 0.95rem;color:var(--md-sys-color-on-surface);">
            <span style="display:flex;align-items:center;gap:0.68rem;">
                ${link.type === "user" ? imageHtml : ""}
                <span style="min-width:0;display:block;">
                    <span class="js-gh-title" style="display:block;margin:0;font-size:1rem;font-weight:700;color:var(--md-sys-color-on-surface);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapedTitle}</span>
                    <span class="js-gh-desc" style="display:block;margin:0.14rem 0 0;font-size:0.82rem;color:var(--md-sys-color-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapedHref}</span>
                </span>
            </span>
            ${link.type === "user" ? "" : imageHtml}
            <span style="display:flex;align-items:center;justify-content:space-between;gap:0.7rem;margin-top:0.56rem;">
                <span class="js-gh-subtitle" style="display:inline-block;line-height:1.2;font-size:0.73rem;font-weight:600;color:var(--md-sys-color-on-surface-variant);border:1px solid var(--md-sys-color-outline-variant);border-radius:999px;padding:0.2rem 0.52rem;">${escapedSubTitle}</span>
                <span style="display:inline-flex;align-items:center;gap:0.55rem;min-width:0;justify-content:flex-end;">
                    <span class="js-gh-stats" style="display:none;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:0.42rem;font-size:0.78rem;color:var(--md-sys-color-on-surface-variant);text-align:right;"></span>
                    <span class="js-gh-state" style="font-size:0.74rem;color:var(--md-sys-color-on-surface-variant);text-transform:capitalize;">GitHub</span>
                </span>
            </span>
    </a>
  </span>`;
};

const markdownItGithubCard = (md: MarkdownIt): void => {
    const defaultLinkOpen =
        md.renderer.rules.link_open ||
        ((tokens, idx, options, env, self) =>
            self.renderToken(tokens, idx, options));

    const defaultLinkClose =
        md.renderer.rules.link_close ||
        ((tokens, idx, options, env, self) =>
            self.renderToken(tokens, idx, options));

    const stack: Array<ParsedGithubLink | null> = [];

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const token: Token | undefined = tokens[idx];
        const href = token?.attrGet("href") || "";
        const parsed = parseGithubLink(href);
        stack.push(parsed);
        return defaultLinkOpen(tokens, idx, options, env, self);
    };

    md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
        const closing = defaultLinkClose(tokens, idx, options, env, self);
        const parsed = stack.pop();
        if (!parsed) return closing;
        return `${closing}${renderGithubCard(md, parsed)}`;
    };
};

export default markdownItGithubCard;
