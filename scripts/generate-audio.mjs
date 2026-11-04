import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const SAMPLE_RATE = 44100;
const ASSETS_DIR = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets';
const SFX_DIR = path.join(ASSETS_DIR, 'sfx');
const FFMPEG = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/node_modules/@remotion/compositor-darwin-arm64/ffmpeg';
const LIB_DIR = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/node_modules/@remotion/compositor-darwin-arm64';

fs.mkdirSync(SFX_DIR, { recursive: true });

function writeWavAndConvertToMp3(samples, outMp3Path) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(1, 22);  // Mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  const tmpWav = outMp3Path.replace(/\.mp3$/, '.wav');
  fs.writeFileSync(tmpWav, buffer);

  execFileSync(FFMPEG, ['-y', '-i', tmpWav, '-codec:a', 'libmp3lame', '-b:a', '192k', outMp3Path], {
    env: { ...process.env, DYLD_LIBRARY_PATH: LIB_DIR },
    stdio: 'ignore',
  });
  fs.unlinkSync(tmpWav);
  console.log(`Generated ${outMp3Path}`);
}

// 1. alarm.mp3 - Classic 03:30 digital bedside alarm (beep-beep, pause, beep-beep)
{
  const dur = 2.8;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const cycle = t % 0.9;
    const beep1 = cycle >= 0.0 && cycle < 0.14;
    const beep2 = cycle >= 0.20 && cycle < 0.34;
    if (beep1 || beep2) {
      const env = Math.sin(((cycle - (beep1 ? 0 : 0.20)) / 0.14) * Math.PI);
      const tone =
        0.55 * Math.sin(2 * Math.PI * 2048 * t) +
        0.25 * Math.sin(2 * Math.PI * 4096 * t) +
        0.15 * Math.sign(Math.sin(2 * Math.PI * 2048 * t));
      samples[i] = tone * Math.pow(env, 0.3) * 0.45 * Math.max(0.2, 1 - t / dur);
    }
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'alarm.mp3'));
}

// 2. thud.mp3 - Heavy warm poster slam thud + paper rustle transient
{
  const dur = 1.2;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 140 * Math.exp(-t * 18) + 42;
    const sub = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 8.5);
    const punch = Math.sin(2 * Math.PI * (260 * Math.exp(-t * 30)) * t) * Math.exp(-t * 25);
    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 38) * 0.45;
    samples[i] = (sub * 0.75 + punch * 0.45 + noise) * 0.85;
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'thud.mp3'));
}

// 3. shutter.mp3 - Crisp mechanical SLR camera shutter click
{
  const dur = 0.8;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    // First curtain click at t=0.02, second curtain click at t=0.09
    let v = 0;
    if (t >= 0.01 && t < 0.08) {
      const dt = t - 0.01;
      v += ((Math.random() * 2 - 1) * 0.6 + Math.sin(2 * Math.PI * 1800 * dt) * 0.4) * Math.exp(-dt * 95);
    }
    if (t >= 0.085 && t < 0.18) {
      const dt = t - 0.085;
      v += ((Math.random() * 2 - 1) * 0.5 + Math.sin(2 * Math.PI * 1350 * dt) * 0.5) * Math.exp(-dt * 75);
    }
    samples[i] = v * 0.85;
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'shutter.mp3'));
}

// 4. scratch.mp3 - Record scratch / harsh buzzer stab for "50K Mall Drink" agitation
{
  const dur = 1.0;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  let phase = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    if (t < 0.42) {
      const sweep = 320 + 680 * Math.sin(t * 28) * (1 - t / 0.42);
      phase += (2 * Math.PI * sweep) / SAMPLE_RATE;
      const env = Math.sin((t / 0.42) * Math.PI);
      const grit = (Math.random() * 2 - 1) * 0.25;
      samples[i] = (Math.sin(phase) * 0.5 + Math.sign(Math.sin(phase * 0.5)) * 0.25 + grit) * env * 0.65;
    }
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'scratch.mp3'));
}

// 5. snap.mp3 - Crisp studio finger snap / rim click
{
  const dur = 0.6;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const body = Math.sin(2 * Math.PI * (2200 * Math.exp(-t * 45) + 900) * t) * Math.exp(-t * 55);
    const crack = (Math.random() * 2 - 1) * Math.exp(-t * 110);
    samples[i] = (body * 0.65 + crack * 0.55) * 0.9;
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'snap.mp3'));
}

// 6. sub_hit.mp3 - Deep cinematic sub-bass drop
{
  const dur = 1.8;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  let phase = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 95 * Math.exp(-t * 3.2) + 34;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.min(1, t / 0.012) * Math.exp(-t * 2.4);
    const transient = (Math.random() * 2 - 1) * Math.exp(-t * 60) * 0.25;
    samples[i] = (Math.sin(phase) * 0.8 + Math.sin(phase * 2) * 0.2 + transient) * env * 0.85;
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'sub_hit.mp3'));
}

// 7. whoosh.mp3 - Fast-forward transition air whoosh
{
  const dur = 1.1;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  let lp = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.pow(Math.sin(Math.min(1, t / 0.65) * Math.PI), 1.8) * (t < 0.65 ? 1 : 0);
    const cutoff = 0.04 + 0.28 * env;
    const white = Math.random() * 2 - 1;
    lp += cutoff * (white - lp);
    const doppler = Math.sin(2 * Math.PI * (180 + 340 * env) * t) * 0.25;
    samples[i] = (lp * 1.4 + doppler) * env * 0.8;
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'whoosh.mp3'));
}

// 8. impact.mp3 - Climax cinematic impact hit + warm brassy chime
{
  const dur = 2.4;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  let phase = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 130 * Math.exp(-t * 8) + 40;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const sub = Math.sin(phase) * Math.exp(-t * 2.2);
    const chord =
      (Math.sin(2 * Math.PI * 220 * t) +
        Math.sin(2 * Math.PI * 277.18 * t) +
        Math.sin(2 * Math.PI * 329.63 * t)) *
      0.16 *
      Math.exp(-t * 2.8);
    const punch = (Math.random() * 2 - 1) * Math.exp(-t * 35) * 0.45;
    samples[i] = (sub * 0.7 + chord + punch) * 0.85;
  }
  writeWavAndConvertToMp3(samples, path.join(SFX_DIR, 'impact.mp3'));
}

// 9. bg_music.mp3 - Warm lo-fi chillhop beat (40 seconds, 90 BPM -> 1 bar = 2.666s, 2 beats = 1.333s)
{
  const dur = 40.0;
  const samples = new Float32Array(Math.floor(SAMPLE_RATE * dur));
  const bpm = 90;
  const beatDur = 60 / bpm; // 0.6667s

  // Warm lo-fi Rhodes chord progression (4-bar loop: Fmaj7 - Em7 - Dm7 - G7)
  const chords = [
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [164.81, 196.0, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.0, 261.63], // Dm7
    [196.0, 246.94, 293.66, 349.23], // G7
  ];

  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const beatIdx = Math.floor(t / beatDur);
    const beatPos = (t % beatDur) / beatDur; // 0..1 within beat
    const barIdx = Math.floor(beatIdx / 4);
    const chord = chords[barIdx % chords.length];

    // Warm electric piano pad
    let pad = 0;
    const barTime = t % (beatDur * 4);
    const padEnv = Math.min(1, barTime / 0.08) * Math.exp(-barTime * 0.55);
    for (const f of chord) {
      pad += Math.sin(2 * Math.PI * f * t + 0.2 * Math.sin(2 * Math.PI * 4.5 * t)) * 0.12;
    }
    pad *= padEnv;

    // Sub bass root note
    const bassFreq = chord[0] * 0.5;
    const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.22 * Math.exp(-beatPos * 2.2);

    // Soft lo-fi kick on beats 0 and 2, snare on beats 1 and 3
    const beatInBar = beatIdx % 4;
    const bt = t % beatDur;
    let drums = 0;
    if (beatInBar === 0 || beatInBar === 2) {
      const kFreq = 110 * Math.exp(-bt * 28) + 45;
      drums += Math.sin(2 * Math.PI * kFreq * bt) * Math.exp(-bt * 11) * 0.38;
    } else {
      const sNoise = (Math.random() * 2 - 1) * Math.exp(-bt * 28) * 0.18;
      const sBody = Math.sin(2 * Math.PI * 185 * bt) * Math.exp(-bt * 22) * 0.15;
      drums += sNoise + sBody;
    }

    // Eighth-note soft hi-hat
    const eighthTime = t % (beatDur * 0.5);
    drums += (Math.random() * 2 - 1) * Math.exp(-eighthTime * 65) * 0.05;

    // Subtle vinyl crackle
    const vinyl = Math.random() > 0.9985 ? (Math.random() * 2 - 1) * 0.06 : 0;

    samples[i] = (pad + bass + drums + vinyl) * 0.7;
  }
  writeWavAndConvertToMp3(samples, path.join(ASSETS_DIR, 'bg_music.mp3'));
}
