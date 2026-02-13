import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import markdownItTaskLists from "markdown-it-task-lists";
import markdownItFootnote from "markdown-it-footnote";
import markdownItDeflist from "markdown-it-deflist";
import markdownItMark from "markdown-it-mark";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import markdownItKatex from "markdown-it-katex";
import bilibiliPlugin from "~/utils/markdown-it-bilibili";
import alertsPlugin from "~/utils/markdown-it-alerts";

const ALLOWED_IFRAME_DOMAINS = new Set(["player.bilibili.com"]);
let domPurifyHookRegistered = false;

const ensureDomPurifyHook = () => {
  if (domPurifyHookRegistered) return;

  DOMPurify.addHook("beforeSanitizeAttributes", (currentNode) => {
    if (currentNode.tagName !== "IFRAME") return;

    const src = currentNode.getAttribute("src") || "";
    if (src.startsWith("/") || src.startsWith("./")) return;

    try {
      const urlStr = src.startsWith("//") ? `https:${src}` : src;
      const url = new URL(urlStr);
      if (!ALLOWED_IFRAME_DOMAINS.has(url.hostname)) {
        currentNode.removeAttribute("src");
      }
    } catch {
      currentNode.removeAttribute("src");
    }
  });

  domPurifyHookRegistered = true;
};

export const useMarkdown = () => {
  const mdConfig = {
    html: true,
    linkify: true,
    typographer: true,
    highlight: (code: string, lang: string): string => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, {
            language: lang,
            ignoreIllegals: true,
          }).value;
        } catch (e) {
          console.warn(`代码高亮失败 (${lang}):`, e);
        }
      }
      return hljs.highlightAuto(code).value;
    },
  };

  const md = new MarkdownIt(mdConfig);
  md.use(bilibiliPlugin);
  md.use(alertsPlugin);
  md.use(markdownItTaskLists, { label: true, labelAfter: true });
  md.use(markdownItFootnote);
  md.use(markdownItDeflist);
  md.use(markdownItMark);
  md.use(markdownItSub);
  md.use(markdownItSup);
  md.use(markdownItKatex, { throwOnError: false, errorColor: "#cc0000" });

  const parseHighlightLines = (meta: string): Set<number> => {
    const highlightLines = new Set<number>();
    const match = meta.match(/\{([^}]+)\}/);
    if (!match || !match[1]) return highlightLines;

    const ranges = match[1].split(",").map((part) => part.trim());
    ranges.forEach((range) => {
      if (!range) return;
      const [startStr, endStr] = range
        .split("-")
        .map((value) => value.trim());
      const start = Number(startStr);
      const end = endStr ? Number(endStr) : start;
      if (Number.isNaN(start) || Number.isNaN(end)) return;
      const from = Math.min(start, end);
      const to = Math.max(start, end);
      for (let line = from; line <= to; line += 1) {
        highlightLines.add(line);
      }
    });

    return highlightLines;
  };

  const hasLineNumbers = (meta: string): boolean => {
    return (
      /(\s|^)(line-numbers|ln)(\s|$)/.test(meta) || /\{[^}]+\}/.test(meta)
    );
  };

  // 自定义代码块渲染
  const defaultFenceRender =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, slf) {
      return slf.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    if (!token) {
      return defaultFenceRender(tokens, idx, options, env, slf);
    }
    const code = token.content.trim();
    const info = token.info.trim();
    let lang = "";
    let meta = "";

    if (info) {
      if (info.startsWith("{")) {
        meta = info;
      } else {
        const parts = info.split(/\s+/g);
        lang = parts[0] || "";
        meta = parts.slice(1).join(" ");
      }
    }

    const langDisplay = lang || "text";
    const highlightLines = parseHighlightLines(meta);
    const showLineNumbers = hasLineNumbers(meta) || highlightLines.size > 0;

    let highlighted = "";
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(code, {
          language: lang,
          ignoreIllegals: true,
        }).value;
      } catch (e) {
        highlighted = md.utils.escapeHtml(code);
      }
    } else {
      highlighted = hljs.highlightAuto(code).value;
    }

    const highlightedLines = highlighted.split("\n");
    const codeLines = highlightedLines
      .map((line, index) => {
        const lineNumber = index + 1;
        const isHighlighted = highlightLines.has(lineNumber);
        const safeLine = line.length ? line : " ";
        const lineClass = isHighlighted
          ? "code-line is-highlighted"
          : "code-line";
        const lineNumberHtml = showLineNumbers
          ? `<span class="code-line-number">${lineNumber}</span>`
          : "";
        return `<span class="${lineClass}" data-line="${lineNumber}">${lineNumberHtml}<span class="code-line-content">${safeLine}</span></span>`;
      })
      .join("\n");

    const langClass = lang ? `language-${md.utils.escapeHtml(lang)}` : "";
    const numberClass = showLineNumbers ? "has-line-numbers" : "";

    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-block-lang">${md.utils.escapeHtml(langDisplay)}</span>
        <button class="code-copy-btn" data-code="${md.utils.escapeHtml(code)}" title="复制代码">
          <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
      <pre><code class="hljs ${langClass} ${numberClass}">${codeLines}</code></pre>
    </div>`;
  };

  const renderMarkdown = (content: string): string => {
    if (!content.trim()) return "";

    const rendered = md.render(content);
    ensureDomPurifyHook();

    return DOMPurify.sanitize(rendered, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["style", "script"],
      FORBID_ATTR: ["onerror", "onload", "onclick", "onfocus"],
      ADD_TAGS: ["iframe"],
      ADD_ATTR: [
        "target",
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
        "framespacing",
        "border",
        "data-code",
        "data-line",
        "title",
      ],
    });
  };

  return {
    md,
    renderMarkdown,
  };
};
