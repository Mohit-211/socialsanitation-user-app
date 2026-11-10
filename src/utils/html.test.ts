import { htmlToBlocks, htmlToText } from './html';

describe('htmlToBlocks', () => {
  it('reads a service description as saved by the editor', () => {
    expect(
      htmlToBlocks(
        '<p>A cutting-edge cleaning method that uses charged particles&nbsp;to coat surfaces.</p>',
      ),
    ).toEqual([
      {
        type: 'paragraph',
        text: 'A cutting-edge cleaning method that uses charged particles to coat surfaces.',
      },
    ]);
  });

  it('keeps headings, paragraphs and list items apart, and drops inline tags', () => {
    expect(
      htmlToBlocks(
        '<h2>Who we are</h2><p>We clean <strong>offices</strong> &amp; <em>schools</em>.</p><ul><li>Daily</li><li>Weekly</li></ul><p>Call us.</p>',
      ),
    ).toEqual([
      { type: 'heading', text: 'Who we are' },
      { type: 'paragraph', text: 'We clean offices & schools.' },
      { type: 'bullet', text: 'Daily' },
      { type: 'bullet', text: 'Weekly' },
      { type: 'paragraph', text: 'Call us.' },
    ]);
  });

  it('turns line breaks into new lines and decodes numeric entities', () => {
    expect(
      htmlToBlocks('<p>Line one<br>Line two &#8211; &#x2014;</p>'),
    ).toEqual([{ type: 'paragraph', text: 'Line one\nLine two – —' }]);
  });

  it('drops scripts, styles and comments', () => {
    expect(
      htmlToBlocks(
        '<style>p{}</style><script>alert(1)</script><!-- note --><p>Safe</p>',
      ),
    ).toEqual([{ type: 'paragraph', text: 'Safe' }]);
  });

  it('splits plain text on blank lines', () => {
    expect(
      htmlToBlocks('First paragraph.\n\nSecond, with\na line break.'),
    ).toEqual([
      { type: 'paragraph', text: 'First paragraph.' },
      { type: 'paragraph', text: 'Second, with\na line break.' },
    ]);
  });
});

describe('htmlToText', () => {
  it('joins the blocks into one line of sentences', () => {
    expect(
      htmlToText(
        '<h2>Floors</h2><p>Strip<br>and wax.</p><ul><li>Lobby</li><li>Halls</li></ul>',
      ),
    ).toBe('Floors. Strip and wax. Lobby. Halls');
  });
});
