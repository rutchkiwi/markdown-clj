// Runs the fixture files the JVM file tests use through the squint build.
import { readFileSync } from 'node:fs';
import { md__GT_html, md__GT_html_with_meta } from '../../target/squint/markdown/core.mjs';

const read = (name) => readFileSync(new URL(`../files/${name}`, import.meta.url), 'utf8');

let failures = 0;
const check = (label, expected, actual) => {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  if (!ok) {
    failures++;
    console.log(`FAIL ${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  } else {
    console.log(`ok   ${label}`);
  }
};

const cases = [
  ['references', ['reference-links?', true], false],
  ['img_references', ['reference-links?', true], true],
  ['footnotes', ['footnotes?', true], false],
  ['test', [], false],
  ['tables', [], false],
];
for (const [name, params, trim] of cases) {
  const expected = read(`${name}.html`);
  check(name, trim ? expected.replace(/\n+$/, '') : expected, md__GT_html(read(`${name}.md`), ...params));
}

const wiki = md__GT_html_with_meta(read('metadata.md'));
check('metadata html', '<h1>The Document</h1>', wiki.html);
check('metadata', {
  title: ['My Document'],
  summary: ['A brief description of my document.'],
  authors: ['Justin May', 'Spooky Mulder', 'End Line At End\n'],
  date: ['October 31, 2015'],
  'blank-value': [],
  base_url: ['http://example.com'],
}, wiki.metadata);

const edn = md__GT_html_with_meta(read('metadata-edn.md'));
check('metadata-edn html', '<h1>The Document</h1>', edn.html);
check('metadata-edn', {
  title: 'My Document',
  summary: 'A brief description of my document.',
  authors: ['Justin May', 'Spooky Mulder', 'End Line At End'],
  date: 'October 31, 2015',
  base_url: 'http://example.com',
}, edn.metadata);

// more than nine footnotes: ids must sort numerically, not as strings
const notes = Array.from({ length: 11 }, (_, i) => i + 1);
const many = md__GT_html(
  notes.map((n) => `a[^n${n}]`).join(' ') + '\n\n' + notes.map((n) => `[^n${n}]: note ${n}`).join('\n'),
  'footnotes?', true);
check('footnote order', notes.map(String), [...many.matchAll(/<li id='fn-(\d+)'>/g)].map((m) => m[1]));

process.exit(failures ? 1 : 0);
