module.exports = {
  name: 'noMarkdown',
  enabled: true,
  async execute (_, string) {
    const unescaped = string.replace(/\\(\||@|>|<|:|\*|_|`|~|\\)/g, '$1') // COMMENT: unescape any "backslashed" markdown
    const escaped = unescaped.replace(/(\||@|>|<|:|\*|_|`|~|\\)/g, '\\$1') // COMMENT: escape the markdown
    return escaped
  }
}
