import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'

const alertTypeMap = {
    NOTE: { type: 'info', title: 'Note' },
    TIP: { type: 'succ', title: 'Tip' },
    IMPORTANT: { type: 'warn', title: 'Important' },
    WARNING: { type: 'warn', title: 'Warning' },
    CAUTION: { type: 'error', title: 'Caution' },
} as const

type AlertLabel = keyof typeof alertTypeMap
type AlertType = (typeof alertTypeMap)[AlertLabel]['type'] | 'plain'

const iconSvgs: Record<AlertType, string> = {
    info: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
    succ: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    plain: '',
}

const colorClassMap: Record<AlertType, string> = {
    info: 'alert-info',
    succ: 'alert-succ',
    warn: 'alert-warn',
    error: 'alert-error',
    plain: 'alert-plain',
}

export default function markdownItAlerts(md: MarkdownIt) {
    const alertStack: boolean[] = []

    md.core.ruler.after('block', 'github-alerts', (state) => {
        const tokens = state.tokens

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]
            if (!token || token.type !== 'blockquote_open') continue
            let firstInline: Token | null = null
            for (let j = i + 1; j < tokens.length; j++) {
                const current = tokens[j]
                if (!current || current.type === 'blockquote_close') break
                if (current.type === 'inline' && current.content) {
                    firstInline = current
                    break
                }
            }

            const match = firstInline?.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/)

            if (match && firstInline) {
                const alertType = match[1] as AlertLabel
                const alertConfig = alertTypeMap[alertType]

                // 标记这个 blockquote 为特定类型的 alert
                token.attrSet('data-alert-type', alertConfig.type)
                token.attrSet('data-alert-title', alertConfig.title)
                firstInline.content = firstInline.content.replace(match[0], '').trim()

                if (!firstInline.content) {
                    for (let j = i + 1; j < tokens.length; j++) {
                        const current = tokens[j]
                        if (!current || current.type === 'blockquote_close') break
                        if (current.type === 'inline' && current === firstInline) {
                            const prev = tokens[j - 1]
                            if (prev?.type === 'paragraph_open') {
                                tokens.splice(j - 1, 3)
                                break
                            }
                        }
                    }
                }
            } else {
                token.attrSet('data-alert-type', 'plain')
                token.attrSet('data-alert-title', '')
            }
        }

        return true
    })

    const defaultBlockquoteOpen = md.renderer.rules.blockquote_open || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
    }

    const defaultBlockquoteClose = md.renderer.rules.blockquote_close || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
    }

    md.renderer.rules.blockquote_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx]
        if (!token) {
            return defaultBlockquoteOpen(tokens, idx, options, env, self)
        }
        const alertType = token.attrGet('data-alert-type')
        const alertTitle = token.attrGet('data-alert-title')

        if (alertType) {
            const type = (alertType as AlertType) || 'plain'
            const icon = iconSvgs[type]
            const colorClass = colorClassMap[type]

            alertStack.push(true)
            if (alertTitle) {
                return `<div class="markdown-alert ${colorClass}">
          <div class="markdown-alert-title">
            ${icon}
            <span>${md.utils.escapeHtml(alertTitle)}</span>
          </div>
          <div class="markdown-alert-content">\n`
            } else {
                return `<div class="markdown-alert ${colorClass}">
          <div class="markdown-alert-content">\n`
            }
        }

        alertStack.push(false)
        return defaultBlockquoteOpen(tokens, idx, options, env, self)
    }

    md.renderer.rules.blockquote_close = function (tokens, idx, options, env, self) {
        const isAlert = alertStack.pop()

        if (isAlert) {
            return '</div></div>\n'
        }

        return defaultBlockquoteClose(tokens, idx, options, env, self)
    }
}
