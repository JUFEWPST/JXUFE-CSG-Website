import type { PluginSimple } from 'markdown-it'

const bilibiliPlugin: PluginSimple = (md) => {
  const BILIBILI_REGEX = /^@\[bilibili\]\(([^)]+)\)/

  md.inline.ruler.push('bilibili', (state, silent) => {
    const src = state.src.slice(state.pos)
    const match = BILIBILI_REGEX.exec(src)

    if (!match) return false

    if (!silent) {
      const content = match[1] ? match[1].trim() : ''
      const idMatch = content.match(/(BV[a-zA-Z0-9]+)|(av[0-9]+)/)

      if (idMatch) {
        const token = state.push('bilibili_embed', 'iframe', 0)
        const id = idMatch[0]
        const isBv = id.startsWith('BV')
        const srcUrl = isBv
          ? `//player.bilibili.com/player.html?bvid=${id}&page=1&high_quality=1&danmaku=0`
          : `//player.bilibili.com/player.html?aid=${id.substring(2)}&page=1&high_quality=1&danmaku=0`

        token.attrs = [
          ['src', srcUrl],
          ['scrolling', 'no'],
          ['border', '0'],
          ['frameborder', 'no'],
          ['framespacing', '0'],
          ['allowfullscreen', 'true'],
          ['style', 'width: 100%; aspect-ratio: 16/9; margin: 1em 0; display: block; border-radius: 4px;'],
        ]
      } else {
        const token = state.push('text', '', 0)
        token.content = match[0]
      }
    }

    state.pos += match[0].length
    return true
  })
}

export default bilibiliPlugin
