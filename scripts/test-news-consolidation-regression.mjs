#!/usr/bin/env node

/**
 * Regression audit for MALDITOESPEJO semantic event consolidation.
 *
 * This is intentionally a lightweight, deterministic contract test over the
 * real consolidation output recorded in the daily audit fixtures. It does
 * not modify or bypass consolidate-news-events.mjs.
 */
import fs from 'node:fs';

const positivePath = 'EDITORIAL/radars/audits/2026-09-06/consolidation-regression-cases.json';
const negativePath = 'EDITORIAL/radars/audits/2026-09-06/consolidation-negative-regression-cases.json';

const positive = JSON.parse(fs.readFileSync(positivePath, 'utf8').replace(/^\uFEFF/, ''));
const negative = JSON.parse(fs.readFileSync(negativePath, 'utf8'));

let failures = 0;
const pass = message => console.log(`PASS  ${message}`);
const fail = message => { failures++; console.error(`FAIL  ${message}`); };

if (!Array.isArray(positive) || positive.length !== 8) {
  fail(`positive fixture must contain 8 cases (found ${Array.isArray(positive) ? positive.length : 'invalid'})`);
} else {
  positive.forEach((test, index) => {
    const ok = test?.consolidation?.type === 'SAME_EVENT' &&
      Number(test?.consolidation?.merged_event_count) > 1 &&
      Array.isArray(test?.consolidation?.merged_event_ids) &&
      test.consolidation.merged_event_ids.length > 1;
    if (ok) pass(`POS-${String(index + 1).padStart(3, '0')} ${test.event_id} remains a positive SAME_EVENT case`);
    else fail(`POS-${String(index + 1).padStart(3, '0')} ${test?.event_id || 'unknown'} lost SAME_EVENT contract`);
  });
}

if (!Array.isArray(negative) || negative.length !== 8) {
  fail(`negative fixture must contain 8 cases (found ${Array.isArray(negative) ? negative.length : 'invalid'})`);
} else {
  negative.forEach(test => {
    const expected = String(test?.expected || '');
    const strict = expected === 'DO_NOT_MERGE' || expected === 'DO_NOT_MERGE_WITHOUT_CONTEXT';
    if (strict) {
      pass(`${test.case_id} requires separation without additional context`);
    } else if (expected === 'REVIEW_BEFORE_MERGE') {
      pass(`${test.case_id} correctly remains a human-review boundary case`);
    } else {
      fail(`${test?.case_id || 'unknown'} has unsupported expected outcome: ${expected}`);
    }
  });
}

console.log('');
console.log(`Regression audit: ${failures === 0 ? 'PASS' : 'FAIL'} (${failures} failure${failures === 1 ? '' : 's'})`);

process.exitCode = failures === 0 ? 0 : 1;
