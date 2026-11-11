// Turns the HTML that the office's editor saves for service descriptions into plain blocks
// the app draws with its own text styles. Inline formatting is dropped.

export type Block = { type: 'heading' | 'paragraph' | 'bullet'; text: string };

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
  bull: '•',
};

const decode = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code.startsWith('#')) {
      const point =
        code[1] === 'x' || code[1] === 'X'
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(point) && point > 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });

const BLOCK_TAG =
  /^(p|div|h[1-6]|li|ul|ol|blockquote|section|article|table|tr|hr|pre)$/;
const TAG = /<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi;

export function htmlToBlocks(source: string): Block[] {
  // Text typed without any markup: blank lines separate paragraphs.
  if (!/<[a-z/!]/i.test(source)) {
    return source
      .split(/\n\s*\n/)
      .map(text => decode(text).trim())
      .filter(Boolean)
      .map(text => ({ type: 'paragraph', text }));
  }

  const html = source
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const blocks: Block[] = [];
  let type: Block['type'] = 'paragraph';
  let text = '';
  const flush = () => {
    const clean = decode(text)
      .replace(/[^\S\n]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .trim();
    if (clean) {
      blocks.push({ type, text: clean });
    }
    text = '';
  };

  let last = 0;
  for (const match of html.matchAll(TAG)) {
    text += html.slice(last, match.index).replace(/\s+/g, ' ');
    last = match.index + match[0].length;
    const name = match[2].toLowerCase();
    if (name === 'br') {
      text += '\n';
    } else if (BLOCK_TAG.test(name)) {
      flush();
      const closing = match[1] === '/';
      type = closing
        ? 'paragraph'
        : /^h\d$/.test(name)
          ? 'heading'
          : name === 'li'
            ? 'bullet'
            : 'paragraph';
    }
  }
  text += html.slice(last).replace(/\s+/g, ' ');
  flush();
  return blocks;
}

/** The text alone, in one line, for short previews. Blocks are joined as sentences. */
export const htmlToText = (source: string) =>
  htmlToBlocks(source).reduce((text, block) => {
    const next = block.text.replace(/\n/g, ' ');
    if (!text) {
      return next;
    }
    return /[.!?:;…]$/.test(text) ? `${text} ${next}` : `${text}. ${next}`;
  }, '');
