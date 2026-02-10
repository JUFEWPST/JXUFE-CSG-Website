declare module 'markdown-it-task-lists' {
    import type MarkdownIt from 'markdown-it'
    const plugin: (md: MarkdownIt, options?: Record<string, any>) => void
    export default plugin
}

declare module 'markdown-it-footnote' {
    import type MarkdownIt from 'markdown-it'
    const plugin: (md: MarkdownIt) => void
    export default plugin
}

declare module 'markdown-it-deflist' {
    import type MarkdownIt from 'markdown-it'
    const plugin: (md: MarkdownIt) => void
    export default plugin
}

declare module 'markdown-it-mark' {
    import type MarkdownIt from 'markdown-it'
    const plugin: (md: MarkdownIt) => void
    export default plugin
}

declare module 'markdown-it-sub' {
    import type MarkdownIt from 'markdown-it'
    const plugin: (md: MarkdownIt) => void
    export default plugin
}

declare module 'markdown-it-sup' {
    import type MarkdownIt from 'markdown-it'
    const plugin: (md: MarkdownIt) => void
    export default plugin
}

declare module 'markdown-it-katex' {
    import type MarkdownIt from 'markdown-it'
    interface KatexOptions {
        throwOnError?: boolean
        errorColor?: string
        maxExpand?: number
        maxSize?: number
        maxGroupSize?: number
    }
    const plugin: (md: MarkdownIt, options?: KatexOptions) => void
    export default plugin
}
