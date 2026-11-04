/**
 * Media Verifier Oracle
 * Uses ffprobe, ffmpeg (ebur128, silencedetect) and sharp to verify:
 * - 1080x1920 9:16 resolution, 30fps, h264/aac, 22-35s duration
 * - Integrated loudness -14 ± 2.0 LUFS
 * - Voice onset <= 0.03s and zero mid-hook silence > 0.20s in 0.0s-3.0s
 * - Carousel 1080x1350 JPEG dimensions
 */

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { TOOLING, REEL_SPECS, CAROUSEL_SPECS, AUDIO_SPECS } = require('./test_constants');

/**
 * Probe video format, streams, duration, dimensions
 */
function probeMedia(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Media file not found: ${filePath}`);
  }

  const args = [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_format',
    '-show_streams',
    filePath,
  ];

  const rawOutput = execFileSync(TOOLING.FFPROBE_BIN, args, { encoding: 'utf-8' });
  const meta = JSON.parse(rawOutput);

  const videoStream = meta.streams.find(s => s.codec_type === 'video') || {};
  const audioStream = meta.streams.find(s => s.codec_type === 'audio') || {};

  // Parse FPS from r_frame_rate (e.g. "30/1")
  let fps = 0;
  if (videoStream.r_frame_rate) {
    const parts = videoStream.r_frame_rate.split('/');
    if (parts.length === 2 && Number(parts[1]) > 0) {
      fps = Math.round(Number(parts[0]) / Number(parts[1]));
    }
  }

  const duration = Number(meta.format.duration || videoStream.duration || 0);

  return {
    formatName: meta.format.format_name,
    duration,
    width: videoStream.width || 0,
    height: videoStream.height || 0,
    fps,
    videoCodec: videoStream.codec_name || '',
    audioCodec: audioStream.codec_name || '',
    hasAudio: !!audioStream.codec_name,
  };
}

/**
 * Measure EBU R128 integrated loudness via ffmpeg
 */
function measureLoudness(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found for loudness measurement: ${filePath}`);
  }

  const args = [
    '-i', filePath,
    '-filter:a', 'ebur128=framelog=verbose',
    '-f', 'null',
    '-',
  ];

  const res = spawnSync(TOOLING.FFMPEG_BIN, args, { encoding: 'utf-8' });
  const stderr = res.stderr || '';

  // Look for Integrated loudness line in summary: "  I:         -14.2 LUFS"
  const match = stderr.match(/Integrated loudness:\s+I:\s+([-\d.]+)\s+LUFS/i) ||
                stderr.match(/\bI:\s+([-\d.]+)\s+LUFS/i);

  if (!match) {
    throw new Error(`Could not parse EBU R128 integrated loudness from ffmpeg output:\n${stderr.slice(-1000)}`);
  }

  const integratedLufs = parseFloat(match[1]);
  const minLufs = AUDIO_SPECS.TARGET_LUFS - AUDIO_SPECS.LUFS_TOLERANCE;
  const maxLufs = AUDIO_SPECS.TARGET_LUFS + AUDIO_SPECS.LUFS_TOLERANCE;
  const isCompliant = integratedLufs >= minLufs && integratedLufs <= maxLufs;

  return {
    integratedLufs,
    targetLufs: AUDIO_SPECS.TARGET_LUFS,
    tolerance: AUDIO_SPECS.LUFS_TOLERANCE,
    minLufs,
    maxLufs,
    isCompliant,
  };
}

/**
 * Detect first speech onset and mid-hook silence via ffmpeg silencedetect
 */
function detectSilence(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found for silence detection: ${filePath}`);
  }

  const args = [
    '-i', filePath,
    '-filter:a', 'silencedetect=noise=-30dB:d=0.02',
    '-f', 'null',
    '-',
  ];

  const res = spawnSync(TOOLING.FFMPEG_BIN, args, { encoding: 'utf-8' });
  const stderr = res.stderr || '';

  // Silence logs appear like:
  // [silencedetect @ ...] silence_start: 0
  // [silencedetect @ ...] silence_end: 0.015 | silence_duration: 0.015
  const silenceIntervals = [];
  const lines = stderr.split('\n');

  let currentStart = null;
  for (const line of lines) {
    const startMatch = line.match(/silence_start:\s+([\d.]+)/);
    if (startMatch) {
      currentStart = parseFloat(startMatch[1]);
    }
    const endMatch = line.match(/silence_end:\s+([\d.]+)\s+\|\s+silence_duration:\s+([\d.]+)/);
    if (endMatch) {
      const end = parseFloat(endMatch[1]);
      const duration = parseFloat(endMatch[2]);
      silenceIntervals.push({
        start: currentStart !== null ? currentStart : end - duration,
        end,
        duration,
      });
      currentStart = null;
    }
  }

  // Calculate first audio onset:
  // If the file starts with silence, speech onset is silence_end. If no leading silence, onset is 0.00s.
  let firstSpeechOnsetSec = 0.0;
  if (silenceIntervals.length > 0 && silenceIntervals[0].start <= 0.01) {
    firstSpeechOnsetSec = silenceIntervals[0].end;
  }

  // Check for any silence > 0.20s in the first 3.0s (mid-hook silence)
  const midHookSilences = silenceIntervals.filter(s => s.start < 3.0 && s.duration > AUDIO_SPECS.MAX_MID_HOOK_SILENCE_SEC);

  return {
    firstSpeechOnsetSec,
    isOnsetCompliant: firstSpeechOnsetSec <= AUDIO_SPECS.MAX_SPEECH_ONSET_SEC,
    silenceIntervals,
    midHookSilences,
    isMidHookCompliant: midHookSilences.length === 0,
  };
}

/**
 * Verify image dimensions for Carousel slides
 */
function verifyImageSpecs(imagePath) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }

  const args = [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_streams',
    imagePath,
  ];

  const rawOutput = execFileSync(TOOLING.FFPROBE_BIN, args, { encoding: 'utf-8' });
  const meta = JSON.parse(rawOutput);
  const stream = meta.streams[0] || {};

  const width = stream.width || 0;
  const height = stream.height || 0;
  const isCarouselStandard = width === CAROUSEL_SPECS.WIDTH && height === CAROUSEL_SPECS.HEIGHT;

  return {
    width,
    height,
    format: stream.codec_name || path.extname(imagePath).replace('.', ''),
    isCarouselStandard,
  };
}

module.exports = {
  probeMedia,
  measureLoudness,
  detectSilence,
  verifyImageSpecs,
};
