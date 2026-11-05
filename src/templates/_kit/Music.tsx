"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicId } from "../types";
import { MUSIC_NAMES, musicForOccasion } from "./music-meta";

// ─────────────────────────────────────────────────────────────────────────────
// Generative ambient music for published celebration sites.
// Everything is synthesised live with WebAudio — no audio files, no licensing — and it never repeats exactly.
// Off by default; guests opt in with the floating "♪ Play our song" toggle. Gentle 4 s fade-in, fades out on pause,
// and politely pauses while the tab is hidden.
// ─────────────────────────────────────────────────────────────────────────────

export { MUSIC_NAMES, musicForOccasion };

// ── Synthesis primitives ─────────────────────────────────────────────────────
const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];
const chance = (p: number) => Math.random() < p;

type Bus = { ac: AudioContext; dry: GainNode; wet: GainNode; master: GainNode; tone: BiquadFilterNode; noise: AudioBuffer; ks: Map<string, AudioBuffer>; keep: AudioScheduledSourceNode[] };

function makeBus(ac: AudioContext): Bus {
  const master = ac.createGain();
  master.gain.value = 0;
  const tone = ac.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 9000;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -20; comp.knee.value = 24; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.4;
  master.connect(tone).connect(comp).connect(ac.destination);
  // Hall reverb from a generated, exponentially decaying stereo impulse.
  const verb = ac.createConvolver();
  const len = Math.floor(ac.sampleRate * 3.6);
  const ir = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2) * (i < 400 ? i / 400 : 1);
  }
  verb.buffer = ir;
  const dry = ac.createGain();
  const wet = ac.createGain();
  wet.gain.value = 0.9;
  dry.connect(master);
  wet.connect(verb).connect(master);
  const noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  return { ac, dry, wet, master, tone, noise, ks: new Map(), keep: [] };
}

/** Route a voice to the dry bus and the reverb with a given send. */
function out(b: Bus, node: AudioNode, gain: number, send = 0.35, pan = 0) {
  const g = b.ac.createGain();
  g.gain.value = gain;
  let last: AudioNode = node.connect(g);
  if (pan) { const p = b.ac.createStereoPanner(); p.pan.value = pan; last = last.connect(p); }
  last.connect(b.dry);
  if (send) { const s = b.ac.createGain(); s.gain.value = send; last.connect(s).connect(b.wet); }
}

function env(g: AudioParam, t: number, peak: number, a: number, d: number) {
  g.setValueAtTime(0.0001, t);
  g.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
  g.exponentialRampToValueAtTime(0.0001, t + a + d);
}

/** Grand-ish piano: inharmonic partials, a brightness filter that closes as the note decays. */
function piano(b: Bus, m: number, t: number, vel = 0.5, len = 3, send = 0.4, pan = 0) {
  const { ac } = b;
  const f = mtof(m);
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(Math.min(9000, f * (6 + vel * 10)), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(f * 1.6, 300), t + len * 0.7);
  const vca = ac.createGain();
  env(vca.gain, t, vel, 0.004, len);
  [1, 2, 3, 4.02, 5.05].forEach((h, i) => {
    const o = ac.createOscillator();
    o.type = i === 0 ? "triangle" : "sine";
    o.frequency.value = f * h * (1 + i * 0.0004);
    const g = ac.createGain();
    g.gain.value = [0.7, 0.35, 0.16, 0.08, 0.04][i];
    o.connect(g).connect(lp);
    o.start(t);
    o.stop(t + len + 0.1);
  });
  lp.connect(vca);
  out(b, vca, 0.42, send, pan);
}

/** Electric-piano tine (two-op FM) for lo-fi. */
function rhodes(b: Bus, m: number, t: number, vel = 0.4, len = 2.6, pan = 0) {
  const { ac } = b;
  const f = mtof(m);
  const car = ac.createOscillator();
  const mod = ac.createOscillator();
  const idx = ac.createGain();
  car.frequency.value = f;
  mod.frequency.value = f;
  idx.gain.setValueAtTime(f * 1.4 * vel, t);
  idx.gain.exponentialRampToValueAtTime(f * 0.05, t + 0.6);
  mod.connect(idx).connect(car.frequency);
  const vca = ac.createGain();
  env(vca.gain, t, vel, 0.006, len);
  // gentle tremolo
  const trem = ac.createOscillator();
  const tg = ac.createGain();
  trem.frequency.value = 4.2;
  tg.gain.value = vel * 0.12;
  trem.connect(tg).connect(vca.gain);
  car.connect(vca);
  [car, mod, trem].forEach((o) => { o.start(t); o.stop(t + len + 0.1); });
  out(b, vca, 0.4, 0.3, pan);
}

/** Music-box comb: a sine with an inharmonic bell partial. */
function bell(b: Bus, m: number, t: number, vel = 0.4, len = 2.2, pan = 0, send = 0.5) {
  const { ac } = b;
  const f = mtof(m);
  [[1, 1, len], [2.0, 0.22, len * 0.5], [4.16, 0.32, len * 0.25], [5.43, 0.12, len * 0.15]].forEach(([h, g0, d]) => {
    const o = ac.createOscillator();
    o.frequency.value = f * h;
    const g = ac.createGain();
    env(g.gain, t, vel * g0, 0.002, d);
    o.connect(g);
    o.start(t);
    o.stop(t + d + 0.05);
    out(b, g, 0.32, send, pan);
  });
}

/** Bowed strings: detuned saws, vibrato that arrives late, a soft bow attack. */
function strings(b: Bus, m: number, t: number, len: number, vel = 0.3, pan = 0, attack = 0.35) {
  const { ac } = b;
  const f = mtof(m);
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = Math.min(4200, f * 5);
  lp.Q.value = 0.6;
  const vca = ac.createGain();
  vca.gain.setValueAtTime(0.0001, t);
  vca.gain.linearRampToValueAtTime(vel, t + attack);
  vca.gain.setValueAtTime(vel, t + Math.max(attack, len - 0.2));
  vca.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.9);
  const vib = ac.createOscillator();
  const vg = ac.createGain();
  vib.frequency.value = 5.4;
  vg.gain.setValueAtTime(0, t);
  vg.gain.linearRampToValueAtTime(f * 0.004, t + 0.6);
  vib.connect(vg);
  [-7, 6].forEach((cents) => {
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.detune.value = cents;
    vg.connect(o.frequency);
    o.connect(lp);
    o.start(t);
    o.stop(t + len + 1);
  });
  vib.start(t);
  vib.stop(t + len + 1);
  lp.connect(vca);
  out(b, vca, 0.16, 0.55, pan);
}

/** Warm pad (triangle + sine), slow in, slow out. */
function pad(b: Bus, notes: number[], t: number, len: number, vel = 0.12, attack = 2.5) {
  const { ac } = b;
  notes.forEach((m, i) => {
    const o = ac.createOscillator();
    o.type = i % 2 ? "sine" : "triangle";
    o.frequency.value = mtof(m);
    o.detune.value = rnd(-5, 5);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vel, t + attack);
    g.gain.setValueAtTime(vel, t + Math.max(attack, len - attack));
    g.gain.linearRampToValueAtTime(0.0001, t + len + attack);
    o.connect(g);
    o.start(t);
    o.stop(t + len + attack + 0.1);
    out(b, g, 0.22, 0.7, (i / Math.max(1, notes.length - 1) - 0.5) * 0.6);
  });
}

/** Karplus–Strong plucked string, rendered once per pitch into a cached buffer. */
function ksBuffer(b: Bus, m: number, kind: "nylon" | "bright" | "sitar" | "bass") {
  const key = `${kind}:${m}`;
  const hit = b.ks.get(key);
  if (hit) return hit;
  const sr = b.ac.sampleRate;
  const f = mtof(m);
  const dur = kind === "sitar" ? 3.2 : kind === "bass" ? 1.6 : kind === "bright" ? 1.1 : 2;
  const len = Math.floor(sr * dur);
  const buf = b.ac.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const N = Math.max(2, Math.round(sr / f));
  const ring = new Float32Array(N);
  let prev = 0;
  const soft = kind === "bass" ? 0.25 : kind === "nylon" ? 0.55 : 0.92;
  for (let i = 0; i < N; i++) { const w = Math.random() * 2 - 1; prev = prev + soft * (w - prev); ring[i] = prev; }
  const decay = kind === "sitar" ? 0.9992 : kind === "bass" ? 0.996 : kind === "bright" ? 0.994 : 0.997;
  let k = 0;
  for (let i = 0; i < len; i++) {
    const a = ring[k];
    const n = ring[(k + 1) % N];
    ring[k] = ((a + n) / 2) * decay;
    let v = a;
    if (kind === "sitar") v = Math.tanh(a * 2.2) * 0.7 + Math.abs(a) * 0.18; // jawari buzz
    d[i] = v;
    k = (k + 1) % N;
  }
  b.ks.set(key, buf);
  return buf;
}

function pluck(b: Bus, m: number, t: number, vel = 0.5, kind: "nylon" | "bright" | "sitar" | "bass" = "nylon", pan = 0, glide?: number, send = 0.3) {
  const src = b.ac.createBufferSource();
  src.buffer = ksBuffer(b, m, kind);
  if (glide) { src.playbackRate.setValueAtTime(1, t + 0.18); src.playbackRate.linearRampToValueAtTime(2 ** (glide / 12), t + 0.5); }
  const g = b.ac.createGain();
  g.gain.value = vel;
  let node: AudioNode = src.connect(g);
  if (kind === "sitar") { const bp = b.ac.createBiquadFilter(); bp.type = "peaking"; bp.frequency.value = 2400; bp.gain.value = 6; node = node.connect(bp); }
  out(b, node, 0.55, send, pan);
  src.start(t);
}

function hat(b: Bus, t: number, vel = 0.05, len = 0.05, freq = 8000) {
  const src = b.ac.createBufferSource();
  src.buffer = b.noise;
  const hp = b.ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = freq;
  const g = b.ac.createGain();
  env(g.gain, t, vel, 0.001, len);
  src.connect(hp).connect(g);
  out(b, g, 1, 0.12, 0.25);
  src.start(t, Math.random() * 0.5);
  src.stop(t + len + 0.05);
}

function brush(b: Bus, t: number, vel = 0.06) {
  const src = b.ac.createBufferSource();
  src.buffer = b.noise;
  const bp = b.ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2200;
  bp.Q.value = 0.7;
  const g = b.ac.createGain();
  env(g.gain, t, vel, 0.01, 0.18);
  src.connect(bp).connect(g);
  out(b, g, 1, 0.2, -0.15);
  src.start(t, Math.random() * 0.5);
  src.stop(t + 0.3);
}

function kick(b: Bus, t: number, vel = 0.5) {
  const o = b.ac.createOscillator();
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
  const g = b.ac.createGain();
  env(g.gain, t, vel, 0.003, 0.32);
  o.connect(g);
  out(b, g, 0.7, 0.05);
  o.start(t);
  o.stop(t + 0.4);
}

/** Looping noise beds (sea, vinyl) — kept so they can be stopped. */
function bed(b: Bus, kind: "sea" | "vinyl") {
  const { ac } = b;
  const len = ac.sampleRate * (kind === "sea" ? 6 : 3);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "sea") { b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048; d[i] = (b0 + b1 + b2) * 0.9; }
      else d[i] = w * 0.012 + (Math.random() < 0.0004 ? (Math.random() - 0.5) * 0.9 : 0);
    }
  }
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = kind === "sea" ? 700 : 5200;
  const g = ac.createGain();
  g.gain.value = kind === "sea" ? 0.55 : 0.5;
  src.connect(lp).connect(g);
  if (kind === "sea") {
    // waves: slow swell of volume and brightness
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.085;
    const lg = ac.createGain();
    lg.gain.value = 0.38;
    lfo.connect(lg).connect(g.gain);
    const lf2 = ac.createGain();
    lf2.gain.value = 420;
    lfo.connect(lf2).connect(lp.frequency);
    lfo.start();
    b.keep.push(lfo);
  }
  out(b, g, kind === "sea" ? 0.5 : 0.35, kind === "sea" ? 0.3 : 0);
  src.start();
  b.keep.push(src);
}

// ── Harmony helpers ──────────────────────────────────────────────────────────
type Chord = { root: number; q: number[] }; // root = semitones from key; q = intervals
const voice = (key: number, c: Chord, oct: number) => c.q.map((i) => key + c.root + i + oct * 12);
const pcs = (key: number, c: Chord) => c.q.map((i) => (((key + c.root + i) % 12) + 12) % 12);

/** A singing melody: mostly stepwise through a scale, landing on chord tones on strong beats. */
class Walker {
  i: number;
  notes: number[];
  constructor(notes: number[], start = 0.5) { this.notes = notes; this.i = Math.floor(notes.length * start); }
  next(chordPcs?: number[], strong = false) {
    const step = pick([-2, -1, -1, 0, 1, 1, 2, -3, 3]);
    this.i = Math.min(this.notes.length - 1, Math.max(0, this.i + step));
    if (this.i < 2) this.i += 2;
    if (this.i > this.notes.length - 3) this.i -= 2;
    if (strong && chordPcs) {
      for (const d of [0, 1, -1, 2, -2]) {
        const j = this.i + d;
        if (j >= 0 && j < this.notes.length && chordPcs.includes(this.notes[j] % 12)) { this.i = j; break; }
      }
    }
    return this.notes[this.i];
  }
}
const scale = (root: number, steps: number[], lo: number, hi: number) => {
  const out: number[] = [];
  for (let m = lo; m <= hi; m++) if (steps.includes((((m - root) % 12) + 12) % 12)) out.push(m);
  return out;
};
const MAJ = [0, 2, 4, 5, 7, 9, 11];
const PENTA = [0, 2, 4, 7, 9];
const M = [0, 4, 7], m3 = [0, 3, 7], M7 = [0, 4, 7, 11], m7 = [0, 3, 7, 10], D7 = [0, 4, 7, 10], M9 = [0, 4, 7, 11, 14], m9 = [0, 3, 7, 10, 14], add9 = [0, 4, 7, 14], six = [0, 4, 7, 9];

// ── Scores ───────────────────────────────────────────────────────────────────
type Score = { bpm: number; grid: number; swing?: number; init?: (b: Bus) => void; tick: (b: Bus, step: number, t: number, beat: number) => void };

function makeScore(id: MusicId): Score {
  switch (id) {
    case "piano-romance": {
      const key = 50; // D
      const prog: Chord[] = [{ root: 0, q: M7 }, { root: 9, q: m7 }, { root: 5, q: M7 }, { root: 7, q: [0, 5, 7, 10] }, { root: 0, q: add9 }, { root: 4, q: m7 }, { root: 5, q: M7 }, { root: 7, q: D7 }];
      const mel = new Walker(scale(key, MAJ, 69, 88), 0.4);
      return {
        bpm: 66, grid: 2,
        tick(b, s, t, beat) {
          const bar = Math.floor(s / 8), pos = s % 8;
          const c = prog[bar % prog.length];
          const lh = voice(key, c, -1);
          if (pos === 0) piano(b, key + c.root - 12, t, 0.42, 4.5, 0.35, -0.2);
          const arp = [lh[0], lh[2] ?? lh[1], lh[1] + 12, lh[2] ?? lh[1], lh[3] ?? lh[1] + 12, lh[2] ?? lh[1], lh[1] + 12, lh[0] + 12];
          piano(b, arp[pos], t, pos === 0 ? 0.3 : 0.2 + Math.random() * 0.06, 2.6, 0.4, -0.15);
          if (pos % 2 === 0 && chance(pos === 0 ? 0.85 : 0.5)) piano(b, mel.next(pcs(key, c), pos === 0), t + rnd(0, 0.02), 0.34 + Math.random() * 0.1, 3.2, 0.45, 0.2);
          if (bar % 8 === 7 && pos === 7) piano(b, mel.next(pcs(key, c)) + 12, t, 0.18, 4, 0.6, 0.3);
          void beat;
        },
      };
    }
    case "strings-waltz": {
      const key = 53; // F
      const prog: Chord[] = [{ root: 0, q: M }, { root: 9, q: m3 }, { root: 5, q: M }, { root: 7, q: D7 }, { root: 2, q: m3 }, { root: 7, q: D7 }, { root: 0, q: M }, { root: 7, q: [0, 5, 7] }];
      const mel = new Walker(scale(key, MAJ, 67, 86), 0.45);
      return {
        bpm: 138, grid: 1,
        tick(b, s, t) {
          const bar = Math.floor(s / 3), pos = s % 3;
          const c = prog[bar % prog.length];
          const beat = 60 / 138;
          if (pos === 0) {
            pluck(b, key + c.root - 24, t, 0.75, "bass", -0.2, undefined, 0.25);
            if (bar % 2 === 0) pad(b, voice(key, c, 0), t, beat * 6, 0.05, 0.8);
            if (chance(0.9)) strings(b, mel.next(pcs(key, c), true), t, beat * (chance(0.6) ? 3 : 2) * 0.95, 0.26, 0.25, 0.25);
          } else {
            voice(key, c, 0).slice(0, 3).forEach((m, i) => pluck(b, m, t + i * 0.008, 0.22, "nylon", 0.1 * i - 0.1, undefined, 0.35));
            if (pos === 2 && chance(0.35)) strings(b, mel.next(pcs(key, c)), t, beat * 0.95, 0.2, 0.25, 0.12);
          }
        },
      };
    }
    case "sitar-dawn": {
      const sa = 50; // D — raag Bhupali flavour (Sa Re Ga Pa Dha)
      const notes = scale(sa, PENTA, 62, 81);
      const mel = new Walker(notes, 0.3);
      return {
        bpm: 64, grid: 2,
        init(b) { b.tone.frequency.value = 7000; },
        tick(b, s, t) {
          const pos = s % 8;
          // Tanpura cycle: Pa · Sa' · Sa' · Sa — never stops.
          const tan = [sa - 5, sa + 12, sa + 12, sa][pos % 4];
          if (pos % 2 === 0) pluck(b, tan - 12, t, 0.32, "sitar", (pos % 4) * 0.12 - 0.2, undefined, 0.5);
          // Alap: unhurried phrases with meend (glides) between notes.
          if (chance(pos % 2 === 0 ? 0.55 : 0.22)) {
            const n = mel.next(undefined, false);
            const glide = chance(0.3) ? pick([2, -2, 3, -1]) : undefined;
            pluck(b, n, t + rnd(0, 0.04), 0.5, "sitar", 0.15, glide, 0.45);
            if (chance(0.2)) pluck(b, n, t + 0.16, 0.25, "sitar", 0.15, undefined, 0.45);
          }
          if (s % 64 === 0) pad(b, [sa - 12, sa - 5], t, 14, 0.05, 4);
        },
      };
    }
    case "music-box": {
      const key = 67; // G
      const prog: Chord[] = [{ root: 0, q: M }, { root: 4, q: m3 }, { root: 5, q: M }, { root: 7, q: M }, { root: 0, q: M }, { root: 9, q: m3 }, { root: 2, q: m3 }, { root: 7, q: M }];
      const mel = new Walker(scale(key, MAJ, 79, 98), 0.4);
      return {
        bpm: 80, grid: 2,
        tick(b, s, t) {
          const bar = Math.floor(s / 6), pos = s % 6; // 3/4 in eighths
          const c = prog[bar % prog.length];
          const ch = voice(key, c, 0);
          if (pos === 0) bell(b, ch[0] - 12, t, 0.36, 2.6, -0.3);
          if (pos === 2 || pos === 4) bell(b, pick(ch.slice(1)), t, 0.18, 1.6, -0.15);
          if (pos !== 5 && chance(pos === 0 ? 0.95 : 0.55)) bell(b, mel.next(pcs(key, c), pos === 0), t, 0.32 + Math.random() * 0.08, 2, 0.25);
        },
      };
    }
    case "lofi-glow": {
      const key = 48; // C
      const prog: Chord[] = [{ root: 5, q: M9 }, { root: 4, q: m7 }, { root: 2, q: m9 }, { root: 0, q: M7 }];
      const mel = new Walker(scale(key, PENTA, 72, 88), 0.5);
      return {
        bpm: 74, grid: 2, swing: 0.16,
        init(b) { b.tone.frequency.value = 3800; bed(b, "vinyl"); },
        tick(b, s, t) {
          const bar = Math.floor(s / 8), pos = s % 8;
          const c = prog[bar % prog.length];
          if (pos === 0 || pos === 5) kick(b, t, pos === 0 ? 0.42 : 0.28);
          if (pos === 2 || pos === 6) brush(b, t, 0.07);
          hat(b, t, pos % 2 ? 0.018 : 0.03, 0.04, 7500);
          if (pos === 0) { voice(key, c, 0).forEach((m, i) => rhodes(b, m, t + i * 0.012, 0.22, 3.4, (i - 2) * 0.12)); rhodes(b, key + c.root - 12, t, 0.3, 3); }
          if (pos === 3 && chance(0.5)) voice(key, c, 0).slice(1, 4).forEach((m) => rhodes(b, m, t, 0.12, 1.2));
          if (chance(pos % 2 ? 0.18 : 0.32)) rhodes(b, mel.next(pcs(key, c), pos === 0), t, 0.26, 1.8, 0.3);
        },
      };
    }
    case "folk-balalaika": {
      const key = 57; // A minor
      const prog: Chord[] = [{ root: 0, q: m3 }, { root: 5, q: m3 }, { root: 7, q: M }, { root: 0, q: m3 }, { root: 3, q: M }, { root: 10, q: M }, { root: 7, q: M }, { root: 0, q: m3 }];
      const harm = [0, 2, 3, 5, 7, 8, 11];
      const mel = new Walker(scale(key, harm, 69, 88), 0.4);
      let held = 0;
      return {
        bpm: 92, grid: 4,
        tick(b, s, t) {
          const bar = Math.floor(s / 8), pos = s % 8; // 2/4 in sixteenths
          const c = prog[bar % prog.length];
          if (pos === 0 || pos === 4) pluck(b, key + c.root - 24 + (pos === 4 ? 7 : 0), t, 0.7, "bass", -0.25);
          if (pos === 2 || pos === 6) voice(key, c, -1).forEach((m, i) => pluck(b, m + 12, t + i * 0.012, 0.22, "bright", -0.05 + i * 0.05));
          // Melody with the balalaika's signature tremolo on long notes.
          if (pos % 4 === 0) held = chance(0.85) ? mel.next(pcs(key, c), pos === 0) : 0;
          if (held) {
            const trem = chance(0.5) || pos % 4 === 0;
            if (trem) pluck(b, held, t, pos % 4 === 0 ? 0.42 : 0.26, "bright", 0.2, undefined, 0.25);
          }
        },
      };
    }
    case "ambient-sea": {
      const key = 50; // D lydian
      const prog: Chord[] = [{ root: 0, q: [0, 4, 7, 11, 14] }, { root: 9, q: [0, 3, 7, 10, 17] }, { root: 7, q: [0, 4, 7, 11, 18] }, { root: 4, q: [0, 3, 7, 10] }];
      const chime = scale(key, [0, 2, 4, 6, 7, 9, 11], 74, 93);
      return {
        bpm: 60, grid: 1,
        init(b) { bed(b, "sea"); },
        tick(b, s, t) {
          const c = prog[Math.floor(s / 10) % prog.length];
          if (s % 10 === 0) pad(b, voice(key, c, -1).concat([key + c.root - 24]), t, 10, 0.07, 3.5);
          if (chance(0.16)) bell(b, pick(chime), t + rnd(0, 0.5), 0.14, 3.5, rnd(-0.6, 0.6), 0.85);
        },
      };
    }
    case "celebration-swing": {
      const key = 46; // B♭
      const prog: Chord[] = [{ root: 0, q: six }, { root: 9, q: D7 }, { root: 2, q: m7 }, { root: 7, q: D7 }, { root: 0, q: six }, { root: 5, q: D7 }, { root: 2, q: m7 }, { root: 7, q: D7 }];
      const blues = [0, 2, 3, 4, 7, 9];
      const mel = new Walker(scale(key, blues, 70, 89), 0.5);
      return {
        bpm: 128, grid: 2, swing: 0.33,
        tick(b, s, t) {
          const bar = Math.floor(s / 8), pos = s % 8;
          const c = prog[bar % prog.length];
          const nxt = prog[(bar + 1) % prog.length];
          // Walking bass: root, third, fifth, chromatic approach.
          if (pos % 2 === 0) {
            const r = key + c.root - 12;
            const walk = [r, r + c.q[1], r + c.q[2], key + nxt.root - 12 + pick([-1, 1])][pos / 2];
            pluck(b, walk, t, 0.85, "bass", -0.2, undefined, 0.15);
          }
          // Ride: ting, ting-a ting.
          if (pos % 2 === 0 || pos === 3 || pos === 7) hat(b, t, pos % 2 ? 0.025 : 0.045, 0.12, 6000);
          if (pos === 2 || pos === 6) brush(b, t, 0.08);
          // Charleston comping.
          if (pos === 0 || pos === 3) voice(key, c, 0).forEach((m, i) => piano(b, m, t + i * 0.006, 0.18, 0.5, 0.25, 0.1));
          if (chance(pos === 0 ? 0.7 : pos % 2 ? 0.4 : 0.5)) piano(b, mel.next(pcs(key, c), pos === 0), t, 0.3, 0.9, 0.3, 0.25);
        },
      };
    }
  }
}

// ── Engine ───────────────────────────────────────────────────────────────────
class Engine {
  bus: Bus | null = null;
  timer: ReturnType<typeof setInterval> | null = null;
  id: MusicId;
  constructor(id: MusicId) { this.id = id; }
  start() {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    if (!this.bus) this.bus = makeBus(new AC({ latencyHint: "playback" }));
    const b = this.bus;
    void b.ac.resume();
    const score = makeScore(this.id);
    score.init?.(b);
    const stepDur = 60 / score.bpm / score.grid;
    let next = b.ac.currentTime + 0.12;
    let step = 0;
    const now = b.ac.currentTime;
    b.master.gain.cancelScheduledValues(now);
    b.master.gain.setValueAtTime(Math.max(b.master.gain.value, 0.0001), now);
    b.master.gain.linearRampToValueAtTime(0.75, now + 4); // gentle fade-in
    this.timer = setInterval(() => {
      while (next < b.ac.currentTime + 0.3) {
        const t = next + (score.swing && step % 2 ? score.swing * stepDur : 0);
        try { score.tick(b, step, t, Math.floor(step / score.grid)); } catch { /* a dropped note never breaks the song */ }
        next += stepDur;
        step++;
      }
    }, 60);
    return true;
  }
  stop(fade = 1.4) {
    const b = this.bus;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (!b) return;
    const now = b.ac.currentTime;
    b.master.gain.cancelScheduledValues(now);
    b.master.gain.setValueAtTime(b.master.gain.value, now);
    b.master.gain.linearRampToValueAtTime(0.0001, now + fade);
    const keep = b.keep.splice(0);
    setTimeout(() => { keep.forEach((n) => { try { n.stop(); } catch {} }); if (!this.timer) void b.ac.suspend(); }, fade * 1000 + 80);
  }
  dispose() { this.stop(0.2); const ac = this.bus?.ac; setTimeout(() => void ac?.close().catch(() => {}), 400); this.bus = null; }
}

const LABELS = {
  en: { play: "Play our song", playing: "Our song", pause: "Pause music", made: "composed live, just for you" },
  ru: { play: "Включить нашу песню", playing: "Наша песня", pause: "Пауза", made: "сочиняется вживую, для вас" },
  hi: { play: "हमारा गीत सुनें", playing: "हमारा गीत", pause: "संगीत रोकें", made: "आपके लिए, अभी रचा गया" },
};

/**
 * Floating sound toggle for published sites. Off by default; tap to begin a gentle, endless, live-composed score.
 * `accent`/`ink`/`bg` let it sit naturally on any template.
 */
export function Music({ id, lang = "en", accent = "#c06c78", ink = "#2a1a1f", bg = "rgba(255,252,248,.72)", className = "" }: { id: MusicId; lang?: string; accent?: string; ink?: string; bg?: string; className?: string }) {
  const L = LABELS[(lang as keyof typeof LABELS) in LABELS ? (lang as keyof typeof LABELS) : "en"];
  const engine = useRef<Engine | null>(null);
  const [on, setOn] = useState(false);
  const [shown, setShown] = useState(false);
  const wasOn = useRef(false);

  // Appear a moment after the page settles (after an envelope opening), never in the first frame.
  useEffect(() => { const t = setTimeout(() => setShown(true), 2200); return () => clearTimeout(t); }, []);
  useEffect(() => () => engine.current?.dispose(), []);
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && on) { wasOn.current = true; engine.current?.stop(0.4); setOn(false); }
      else if (!document.hidden && wasOn.current) { wasOn.current = false; if (engine.current?.start()) setOn(true); }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [on]);

  const toggle = useCallback(() => {
    if (on) { engine.current?.stop(); setOn(false); wasOn.current = false; return; }
    engine.current ??= new Engine(id);
    if (engine.current.start()) setOn(true);
  }, [on, id]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? L.pause : L.play}
      title={`${MUSIC_NAMES[id]} — ${L.made}`}
      className={`fv-music no-print group fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] right-4 z-[45] flex items-center gap-3 rounded-full py-2 pl-2 pr-4 text-left backdrop-blur-xl transition-all duration-700 md:right-6 ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"} ${className}`}
      style={{ background: bg, color: ink, boxShadow: `0 18px 40px -22px ${ink}88, inset 0 0 0 1px ${accent}33` }}
    >
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: on ? accent : "transparent", boxShadow: on ? "none" : `inset 0 0 0 1px ${accent}66` }}>
        {on ? (
          <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => <span key={i} className="fv-eq w-[2.5px] rounded-full bg-white" style={{ animationDelay: `${i * -0.27}s` }} />)}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={accent} strokeWidth="1.6" aria-hidden><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" fill={accent} stroke="none" /><circle cx="16.5" cy="16" r="2.5" fill={accent} stroke="none" /></svg>
        )}
        {!on && <span className="fv-music-ring absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 1px ${accent}` }} aria-hidden />}
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[15px] italic">{on ? L.playing : `♪ ${L.play}`}</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] opacity-55">{on ? MUSIC_NAMES[id] : L.made}</span>
      </span>
    </button>
  );
}
