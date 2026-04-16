// Applies a .sql migration against DATABASE_URL by splitting on statement
// boundaries and executing each in autocommit mode (required for TimescaleDB
// continuous aggregate DDL, which cannot run inside a transaction block).
//
// Usage: node scripts/apply-migration.mjs supabase/migrations/001_schema.sql

import 'dotenv/config';
import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('usage: apply-migration.mjs <path.sql>'); process.exit(1); }

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const raw = readFileSync(resolve(file), 'utf8');
const statements = splitStatements(raw);
console.log(`[apply] ${file} -> ${statements.length} statements`);

const sql = postgres(DATABASE_URL, {
  max: 1,
  idle_timeout: 10,
  prepare: false, // DDL; no value in prepared statements, avoids caching weirdness
});

let ok = 0;
try {
  for (const [i, stmt] of statements.entries()) {
    const preview = stmt.slice(0, 80).replace(/\s+/g, ' ');
    try {
      await sql.unsafe(stmt);
      ok++;
      if ((i + 1) % 10 === 0 || i === statements.length - 1) {
        console.log(`[apply] ${i + 1}/${statements.length} ${preview}...`);
      }
    } catch (err) {
      console.error(`[apply] FAILED at statement ${i + 1}/${statements.length}`);
      console.error(`  ${preview}...`);
      console.error(`  ${err.message}`);
      if (err.hint) console.error(`  hint: ${err.hint}`);
      throw err;
    }
  }
  console.log(`[apply] OK (${ok} statements)`);
} catch {
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}

// ---------------------------------------------------------------
// Naive SQL statement splitter.
// Strips /* */ block comments and -- line comments, then splits on
// semicolons. Does NOT handle dollar-quoted strings ($$...$$) or
// semicolons inside string literals — our migration has neither.
// ---------------------------------------------------------------
function splitStatements(sqlText) {
  let text = sqlText.replace(/\/\*[\s\S]*?\*\//g, '');   // block comments
  text = text.replace(/--[^\n]*/g, '');                  // line comments
  return text
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}
