// composables/useMarkdown.ts
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

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
          }).value
        } catch (e) {
          console.warn(`代码高亮失败 (${lang}):`, e)
        }
      }
      return hljs.highlightAuto(code).value
    },
  }

  const md = new MarkdownIt(mdConfig)

  const renderMarkdown = (content: string): string => {
    if (!content.trim()) return ''

    const rendered = md.render(content)

    return DOMPurify.sanitize(rendered, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'script'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onfocus'],
      ADD_ATTR: ['target'],
    })
  }

  return {
    md,
    renderMarkdown
  }
}
