import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import bilibiliPlugin from '~/utils/markdown-it-bilibili'

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
  md.use(bilibiliPlugin)

  const renderMarkdown = (content: string): string => {
    if (!content.trim()) return ''

    const rendered = md.render(content)

    DOMPurify.addHook('beforeSanitizeAttributes', (currentNode) => {
      if (currentNode.tagName === 'IFRAME') {
        const src = currentNode.getAttribute('src') || ''
        if (src.startsWith('/') || src.startsWith('./')) return

        const allowedDomains = ['player.bilibili.com']
        try {
          const urlStr = src.startsWith('//') ? `https:${src}` : src
          const url = new URL(urlStr)
          if (!allowedDomains.includes(url.hostname)) {
            currentNode.removeAttribute('src')
          }
        } catch (e) {
          currentNode.removeAttribute('src')
        }
      }
    })

    return DOMPurify.sanitize(rendered, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'script'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onfocus'],
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'framespacing', 'border'],
    })
  }

  return {
    md,
    renderMarkdown
  }
}
