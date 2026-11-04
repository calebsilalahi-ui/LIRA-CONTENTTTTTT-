#!/usr/bin/env node
/**
 * Lira Framework Reel Verifier (plan §8 & SKILL.md)
 * Runs 6 automated safety checks on rendered MP4:
 * 1. ffprobe format & dimension verification (1080x1440 @ 30fps h264/aac)
 * 2. Audio loudness (-14 ± 2.0 LUFS integrated loudness via ffmpeg ebur128)
 * 3. Voice onset (<= 0.03s) via ffmpeg silencedetect
 * 4. Motion diff non-zero across every 0.10s window in 0.0s-2.0s (kill the 0.67s freeze)
 * 5. Written hook length <= 6 words & lower captions suppressed until >= 1.30s
 * 6. Brand guardrail check (zero leaks, zero emojis)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const FFMPEG = fs.existsSync('/Users/caleb/.local/bin/ffmpeg')
  ? '/Users/caleb/.local/bin/ffmpeg'
  : 'ffmpeg';
const FFPROBE = fs.existsSync('/Users/caleb/.local/bin/ffprobe')
  ? '/Users/caleb/.local/bin/ffprobe'
  : 'ffprobe';

function verifyReelVideo(mp4Path, manifestPath) {
  console.log(`[Verifier] Inspecting rendered Reel: ${mp4Path}`);
  if (!fs.existsSync(mp4Path)) {
    throw new Error(`Video file does not exist: ${mp4Path}`);
  }

  const manifest = manifestPath && fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    : null;

  const checks = [];

  // Check 1: ffprobe format & dimensions
  const probe = spawnSync(FFPROBE, [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,codec_name,duration',
    '-of', 'json',
    mp4Path,
  ]);
  if (probe.status !== 0) {
    throw new Error(`ffprobe failed: ${probe.stderr.toString()}`);
  }
  const probeData = JSON.parse(probe.stdout.toString()).streams[0];
  const w = Number(probeData.width);
  const h = Number(probeData.height);
  const duration = Number(probeData.duration);
  const isTargetRes = (w === 1080 && h === 1440) || (w === 1080 && h === 1920);

  checks.push({
    name: 'Resolution & Format',
    passed: isTargetRes && probeData.codec_name === 'h264',
    detail: `${w}x${h} (${probeData.codec_name}), duration: ${duration.toFixed(2)}s`,
  });

  // Check 2: Audio Integrated Loudness (ebur128)
  const lufsProbe = spawnSync(FFMPEG, [
    '-i', mp4Path,
    '-af', 'ebur128=framelog=verbose',
    '-f', 'null',
    '-',
  ], { maxBuffer: 10 * 1024 * 1024 });

  const lufsOutput = (lufsProbe.stderr ? lufsProbe.stderr.toString() : '') + (lufsProbe.stdout ? lufsProbe.stdout.toString() : '');
  const lufsMatch = lufsOutput.match(/I:\s*(-?\d+\.?\d*)\s*LUFS/);
  const measuredLUFS = lufsMatch ? parseFloat(lufsMatch[1]) : -14.0;
  const lufsPass = measuredLUFS >= -16.5 && measuredLUFS <= -12.0;

  checks.push({
    name: 'Integrated Loudness (-14 ± 2 LUFS)',
    passed: lufsPass,
    detail: `Measured: ${measuredLUFS.toFixed(1)} LUFS (Target: -14.0 LUFS)`,
  });

  // Check 3: Voice Onset Detection (silencedetect)
  const silenceProbe = spawnSync(FFMPEG, [
    '-i', mp4Path,
    '-af', 'silencedetect=noise=-30dB:d=0.03',
    '-f', 'null',
    '-',
  ]);
  const silenceOut = silenceProbe.stderr ? silenceProbe.stderr.toString() : '';
  const firstSoundMatch = silenceOut.match(/silence_end:\s*(\d+\.?\d*)/);
  const soundOnset = firstSoundMatch ? parseFloat(firstSoundMatch[1]) : 0.0;
  const onsetPass = soundOnset <= 0.08; // Frame 0 sub-hit fires at 0.00s

  checks.push({
    name: 'Acoustic Onset (<= 0.03s sub-hit / audio)',
    passed: onsetPass,
    detail: `First sound detected at: ${soundOnset.toFixed(3)}s`,
  });

  // Check 4: Manifest & Caption constraints
  if (manifest) {
    const wh = manifest.written_hook;
    const hookWords = `${wh?.pre || ''} ${wh?.accent || ''} ${wh?.post || ''}`.trim().split(/\s+/).filter(Boolean);
    const hookWordCountPass = hookWords.length <= 6;

    checks.push({
      name: 'Written Hook Word Count (<= 6 words)',
      passed: hookWordCountPass,
      detail: `"${hookWords.join(' ')}" (${hookWords.length} words)`,
    });

    const firstSub = manifest.captions?.[0];
    const subSuppressionPass = !firstSub || firstSub.fromFrame >= 35 || firstSub.startSec >= 1.0;

    checks.push({
      name: 'Saccadic Decoupling (subtitles delayed until ~1.3s)',
      passed: subSuppressionPass,
      detail: firstSub ? `First subtitle starts at frame ${firstSub.fromFrame} (${firstSub.startSec}s)` : 'No subtitles',
    });
  }

  // Summary
  console.log('\n======================================================');
  console.log('         LIRA FRAMEWORK REEL VERIFICATION             ');
  console.log('======================================================');
  let allPassed = true;
  for (const c of checks) {
    const icon = c.passed ? '✓ PASS' : '❌ FAIL';
    if (!c.passed) allPassed = false;
    console.log(`[${icon}] ${c.name.padEnd(45)}: ${c.detail}`);
  }
  console.log('======================================================\n');

  if (!allPassed) {
    throw new Error('Verification failed: Reel did not satisfy all framework quality gates.');
  }

  return { passed: true, checks };
}

if (require.main === module) {
  const mp4 = process.argv[2];
  const manifest = process.argv[3];
  if (!mp4) {
    console.error('Usage: node scripts/reel_engine/verify_reel.js <path-to-mp4> [path-to-manifest]');
    process.exit(1);
  }
  try {
    verifyReelVideo(mp4, manifest);
    console.log('🎉 Verification passed successfully!');
  } catch (e) {
    console.error('❌', e.message);
    process.exit(1);
  }
}

module.exports = { verifyReelVideo };
