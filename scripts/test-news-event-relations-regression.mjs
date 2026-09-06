#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const fixture = 'EDITORIAL/radars/audits/2026-09-06/event-relation-regression-cases.json';
const cases = JSON.parse(fs.readFileSync(fixture, 'utf8'));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'malditoespejo-relations-'));
const input = path.join(dir, 'input.json');
const output = path.join(dir, 'output.json');
const events = cases.flatMap(c => [c.event_a, c.event_b]);
fs.writeFileSync(input, JSON.stringify({ events }, null, 2));

const run = spawnSync(process.execPath, ['scripts/analyze-news-event-relations.mjs', input, output], {
  encoding: 'utf8',
  stdio: 'pipe'
});

let failures = 0;
if (run.status !== 0) {
  console.error(run.stderr || run.stdout);
  process.exit(run.status || 1);
}

const result = JSON.parse(fs.readFileSync(output, 'utf8'));
for (const test of cases) {
  const pair = result.relations.find(r =>
    (r.event_a === test.event_a.event_id && r.event_b === test.event_b.event_id) ||
    (r.event_a === test.event_b.event_id && r.event_b === test.event_a.event_id)
  );
  const actual = pair?.classification || 'NONE';
  if (actual !== test.expected) {
    failures++;
    console.error(`FAIL ${test.case_id}: expected ${test.expected}, got ${actual}`);
  } else {
    console.log(`PASS ${test.case_id}: ${actual}`);
  }
}

fs.rmSync(dir, { recursive: true, force: true });
if (failures) process.exit(1);
console.log(`\nEvent relation regression: PASS (0 failures, ${cases.length}/${cases.length})`);
