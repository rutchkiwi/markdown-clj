// Entry point of the standalone browser bundle built from the squint output.
// Exposes the same globals as the ClojureScript build: markdown.core.mdToHtml
import { mdToHtml, mdToHtmlWithMeta } from '../../target/squint/markdown/core.mjs';

globalThis.markdown = { core: { mdToHtml, mdToHtmlWithMeta } };
