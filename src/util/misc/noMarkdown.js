// Code taken from https://github.com/discordjs/discord.js/blob/stable/src/util/Util.js#L124
//

async function noMarkdown (text) {
  text = await escapeInlineCode(text)
  text = await escapeCodeBlock(text)
  text = await escapeItalic(text)
  text = await escapeBold(text)
  text = await escapeUnderline(text)
  text = await escapeStrikethrough(text)
  text = await escapeSpoiler(text)
  text = await escapeLink(text)
  return text
}

function escapeCodeBlock (text) {
  return text.replaceAll('```', '\\`\\`\\`')
}
function escapeInlineCode (text) {
  return text.replace(/(?<=^|[^`])`(?=[^`]|$)/g, '\\`')
}
function escapeItalic (text) {
  let i = 0
  text = text.replace(/(?<=^|[^*])\*([^*]|\*\*|$)/g, (_, match) => {
    if (match === '**') return ++i % 2 ? `\\*${match}` : `${match}\\*`
    return `\\*${match}`
  })
  i = 0
  return text.replace(/(?<=^|[^_])_([^_]|__|$)/g, (_, match) => {
    if (match === '__') return ++i % 2 ? `\\_${match}` : `${match}\\_`
    return `\\_${match}`
  })
}
function escapeBold (text) {
  let i = 0
  return text.replace(/\*\*(\*)?/g, (_, match) => {
    if (match) return ++i % 2 ? `${match}\\*\\*` : `\\*\\*${match}`
    return '\\*\\*'
  })
}
function escapeUnderline (text) {
  let i = 0
  return text.replace(/__(_)?/g, (_, match) => {
    if (match) return ++i % 2 ? `${match}\\_\\_` : `\\_\\_${match}`
    return '\\_\\_'
  })
}
function escapeStrikethrough (text) {
  return text.replaceAll('~~', '\\~\\~')
}
function escapeSpoiler (text) {
  return text.replaceAll('||', '\\|\\|')
}
function escapeLink (text) {
  return text.replaceAll(/https?:/g, '')
}

module.exports = { noMarkdown }
