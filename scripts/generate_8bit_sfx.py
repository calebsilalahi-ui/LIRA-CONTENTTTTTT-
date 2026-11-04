import math
import os
import struct
import wave

OUT_DIR = "/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets/sfx"
os.makedirs(OUT_DIR, exist_ok=True)
SR = 44100


def save_wav(filename: str, samples: list[float]):
    path = os.path.join(OUT_DIR, filename)
    with wave.open(path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        raw = bytearray()
        for s in samples:
            clamped = max(-0.98, min(0.98, s))
            raw.extend(struct.pack("<h", int(clamped * 32767)))
        wf.writeframes(bytes(raw))
    print(f"Saved {path} ({len(samples)/SR:.2f}s)")


def square_wave(phase: float, duty: float = 0.5) -> float:
    return 1.0 if (phase % 1.0) < duty else -1.0


def triangle_wave(phase: float) -> float:
    p = phase % 1.0
    return 4.0 * p - 1.0 if p < 0.5 else 3.0 - 4.0 * p


# 1. 1-Star Error Buzzer (descending 8-bit two-tone buzz)
def make_1star_buzz():
    dur = 0.45
    n = int(SR * dur)
    samples = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        freq = 220.0 if t < 0.18 else 146.83
        phase += freq / SR
        env = max(0.0, 1.0 - (t / dur) * 0.6)
        val = 0.45 * square_wave(phase, 0.25) * env
        samples.append(val)
    save_wav("eightbit_1star_buzz.wav", samples)


# 2. Clock Gear Spin & Shift Swap (rapid ticking + rising pitch sweep)
def make_clock_spin():
    dur = 0.65
    n = int(SR * dur)
    samples = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        tick_idx = int(t * 24)
        base_freq = 320.0 + tick_idx * 42.0
        phase += base_freq / SR
        sub_t = (t * 24) % 1.0
        env = math.exp(-sub_t * 6.5)
        val = 0.4 * square_wave(phase, 0.5) * env
        samples.append(val)
    save_wav("eightbit_clock_spin.wav", samples)


# 3. Bottle Pop / Bounce Impact (8-bit pitch jump)
def make_bottle_pop():
    dur = 0.28
    n = int(SR * dur)
    samples = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        freq = 260.0 + 680.0 * math.pow(t / dur, 0.65)
        phase += freq / SR
        env = math.exp(-t * 11.0)
        val = 0.5 * triangle_wave(phase) * env + 0.25 * square_wave(phase, 0.5) * env
        samples.append(val)
    save_wav("eightbit_pop.wav", samples)


# 4. Frost / Flavor Particle Shimmer (sparkling 8-bit arpeggio)
def make_portal_shimmer():
    notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]
    note_dur = 0.075
    samples = []
    phase = 0.0
    for idx, freq in enumerate(notes):
        n = int(SR * note_dur)
        for i in range(n):
            t = i / SR
            phase += freq / SR
            env = math.exp(-t * 14.0) * (1.0 - idx * 0.06)
            samples.append(0.38 * square_wave(phase, 0.25) * env)
    save_wav("eightbit_portal_shimmer.wav", samples)


# 5. 5-Star Gold Fanfare Chime (classic 8-bit level-up / 5-star unlock)
def make_5star_fanfare():
    notes = [
        (523.25, 0.09),
        (659.25, 0.09),
        (783.99, 0.09),
        (1046.50, 0.11),
        (1318.51, 0.35),
    ]
    samples = []
    phase = 0.0
    for freq, d in notes:
        n = int(SR * d)
        for i in range(n):
            t = i / SR
            phase += freq / SR
            env = math.exp(-t * (5.0 if d > 0.2 else 10.0))
            samples.append(0.45 * square_wave(phase, 0.5) * env)
    save_wav("eightbit_5star_fanfare.wav", samples)


if __name__ == "__main__":
    make_1star_buzz()
    make_clock_spin()
    make_bottle_pop()
    make_portal_shimmer()
    make_5star_fanfare()
