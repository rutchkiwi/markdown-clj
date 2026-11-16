// Runs the squint-compiled test suite: `npm run test:squint`
import { run_tests } from 'squint-cljs/src/squint/test.js';
import '../../target/squint/markdown/md_test.mjs';

run_tests('markdown.md-test');
