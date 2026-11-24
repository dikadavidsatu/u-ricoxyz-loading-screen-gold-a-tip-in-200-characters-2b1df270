// Loading Screen Gold: A Tip in 200 Characters
// SPDX-License-Identifier: MIT
//
// A tiny program that picks one sharp, funny loading-screen tip for
// stressed developers and AI coding agents, then writes it to
// <output-dir>/entry.txt (MAKEFUN_OUTPUT_DIR, or /output by default).
//
// The gate the sealed scorer enforces: entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space. Everything below is built
// around that gate: every candidate is validated against it before it
// can be picked, and the file we write is re-read and re-validated
// before we report success.
//
// The judge (see the competition rules) picks the tip that would make a
// tired developer laugh and then feel seen, weighing, most important
// first: (1) it is a loading-screen tip for stressed developers AND AI
// coding agents, (2) it earns a real laugh through a turn or a punchline
// rather than a groan-worthy pun, (3) it lands in a glance, one line,
// every word working, (4) it speaks to the developer and to the agent
// at once, so both feel the joke is about them, and (5) it feels fresh
// — not a rerun of the usual coffee, deadline or compile jokes.
//
// That is why the candidates below all do the same job from different
// angles: the agent is a co-worker with feelings (patience, doubt,
// diplomacy), the developer is the stressed human on the other side of
// the prompt, and the punchline is the gap between what was asked and
// what was meant. No coffee. No deadlines. No "have you tried turning
// it off and on again".

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The gate, as published in the competition rules.
// ---------------------------------------------------------------------------

/** Maximum characters the sealed scorer allows in entry.txt. */
const MAX_CHARS = 200;

/** Minimum characters: the file must not be empty. */
const MIN_CHARS = 1;

/** Characters that would break the "one line" shape of a loading tip. */
const LINE_BREAK = /[\r\n]/;

/** The usual loading-screen clichés the judge explicitly calls stale. */
const CLICHES = ["coffee", "deadline", "compile", "turn it off"];

// ---------------------------------------------------------------------------
// Candidates: every one is an original single-line tip, written for this
// entry. The picker below scores them against the judge's brief and the
// gate; the winner is deterministic, so two runs produce the same file.
// ---------------------------------------------------------------------------

const TIPS: readonly string[] = [
  // The pick. The agent is not broken, it is being diplomatic: it caught
  // the contradiction in the prompt and is choosing, politely, which
  // instruction to obey. The developer laughs because they know they
  // wrote all three; the agent feels seen because someone finally
  // noticed it re-reads. One turn ("isn't stuck — it's..."), one line,
  // every word working.
  "Tip: your agent isn't stuck — it's re-reading your prompt for the third time, quietly deciding which of your three contradictory instructions you actually meant.",

  // Runner-up. Same relationship, opposite direction: the human's
  // "just fix it" is doing a lot of heavy lifting, and the agent's
  // silence is the sound of it unpacking that sentence.
  "Tip: if your agent goes quiet, it isn't frozen. It's re-reading your last message, wondering very politely what on earth you meant by \u201cjust fix it\u201d.",

  // The night-shift one. Past-you is the third character in the room:
  // the agent is mediating between the developer now and the developer
  // who wrote the first version at 2 a.m.
  "Tip: the agent just rewrote the same function twice. It's not lost — it's negotiating with your past self, who wrote the first version at 2 a.m.",

  // The honest one. Loading screens lie about progress; this tip admits
  // the bar is decorative and the real work is the thinking — which is
  // exactly what the agent is doing while you watch it.
  "Tip: that progress bar is decorative. The real loading is the agent, staring at your code the way you stare at a bug — hoping it confesses first.",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Character count the way the gate means it: Unicode code points, not
 * UTF-16 code units, so an em dash or a curly quote counts as one.
 */
function charLength(text: string): number {
  return [...text].length;
}

/**
 * Validate one tip against the gate. Returns a list of problems; empty
 * means the tip is safe to submit.
 */
function validateTip(tip: string): string[] {
  const problems: string[] = [];
  const length = charLength(tip);
  if (length < MIN_CHARS) problems.push("empty");
  if (length > MAX_CHARS) problems.push(`too long: ${length} > ${MAX_CHARS}`);
  if (tip.trim().length === 0) problems.push("only white space");
  if (LINE_BREAK.test(tip)) problems.push("more than one line");
  return problems;
}

/**
 * Score a candidate against the judge's brief. Deterministic and small
 * on purpose: the numbers encode the brief, they do not pretend to be
 * a comedy model.
 *
 * - Starts with "Tip:" — it must read as a tip, not a slogan.
 * - Names the agent AND the developer ("your"/"you") — criterion 4,
 *   both sides of the keyboard feel the joke is about them.
 * - Has a turn: an em dash or a "not X — it's Y" pivot — criterion 2,
 *   a punchline rather than a pun.
 * - Short enough to land in a glance — criterion 3: every character
 *   past 170 costs a point. The gate allows 200 and a loading screen
 *   still reads a 170-character line in one glance, so the penalty
 *   starts where the line stops feeling short — not at 150, which was
 *   demoting the sharpest punchline for being ten words longer.
 * - Contains a stale cliché — criterion 5: heavily penalised, because
 *   the judge was told fresh beats familiar.
 */
function scoreTip(tip: string): number {
  let score = 0;
  if (/^Tip:/.test(tip)) score += 10;
  if (/\bagent\b/i.test(tip)) score += 10;
  if (/\byour\b|\byou\b/i.test(tip)) score += 10;
  if (/\u2014/.test(tip)) score += 8; // em-dash turn
  if (/\bisn'?t\b.{0,40}\bit'?s\b/i.test(tip)) score += 8; // "isn't X — it's Y"
  if (/re-reading/i.test(tip)) score += 4; // the agent doing visible work
  const length = charLength(tip);
  if (length > 170) score -= (length - 170);
  for (const cliche of CLICHES) {
    if (tip.toLowerCase().includes(cliche)) score -= 25;
  }
  return score;
}

/**
 * Pick the best candidate. Every candidate is validated first: a tip
 * that fails the gate can never be picked, and a candidate list with no
 * valid tip at all is a hard failure, not a silent fallback.
 */
function pickTip(): { tip: string; score: number; index: number } {
  let best: { tip: string; score: number; index: number } | null = null;
  for (let i = 0; i < TIPS.length; i++) {
    const tip = TIPS[i];
    const problems = validateTip(tip);
    if (problems.length > 0) {
      throw new Error(`candidate ${i} fails the gate: ${problems.join("; ")}`);
    }
    const score = scoreTip(tip);
    if (best === null || score > best.score) {
      best = { tip, score, index: i };
    }
    // Ties keep the earliest candidate: deterministic by construction.
  }
  if (best === null) throw new Error("no valid tip candidates");
  return best;
}

/** Where entry.txt goes: the harness's output dir, or /output. */
function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

// ---------------------------------------------------------------------------
// Main: pick, validate, write, verify.
// ---------------------------------------------------------------------------

function main(): void {
  const { tip, score, index } = pickTip();

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");

  // No trailing newline: the file is exactly the tip, so its character
  // count is exactly the tip's — nothing for the scorer to trim or
  // miscount.
  writeFileSync(file, tip, "utf8");

  // Read it back and re-validate: the file on disk is what gets judged.
  const written = readFileSync(file, "utf8");
  const problems = validateTip(written);
  if (written !== tip) problems.push("round-trip mismatch");
  if (problems.length > 0) {
    throw new Error(`written entry.txt fails the gate: ${problems.join("; ")}`);
  }

  console.log(`picked candidate ${index} (score ${score})`);
  console.log(`wrote ${file} — ${charLength(written)} characters`);
  console.log(written);
}

main();
