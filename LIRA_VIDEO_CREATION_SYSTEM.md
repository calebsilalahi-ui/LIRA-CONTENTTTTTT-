# LIRA VIDEO CREATION SKILL & SYSTEM GUIDE

> **Core Mandate:** This skill governs the end-to-end production of Lira short-form video reels (Remotion, pixel-art visuals, dynamic typography, audio design, and delivery). Every reel must feel alive, emotionally resonant, visually dynamic, and continuously improve upon prior benchmark reels.

---

## 0. MANDATORY STEP 0: OBSERVE EXISTING REELS IN "LIRA REELS" FOLDER

> [!IMPORTANT]
> **BEFORE generating any assets, writing any Remotion code, or planning scenes**, the agent **MUST** inspect the existing rendered videos inside the `lira reels` directory. Ground yourself in the exact visual fidelity, animation pacing, dynamic captions, sound design, and brand energy established in previous reels.

- **Primary Video Directory:** `$HOME/Desktop/lira reels/` (path: `/Users/caleb/Desktop/lira reels/`)
- **Key Benchmark Reels to Observe:**
  1. `01_lira_founder_story.mp4` — Brand origin story baseline, 37s pacing, warm bedroom/kitchen lighting, character turnaround consistency.
  2. `02_sapa_mart_blackout.mp4` — Retail beverage chiller scene, high-contrast narrative drama, snappy transitions.
  3. `03_referral_leaderboard.mp4` — Glowing green spreadsheet terminal, real-time community leaderboard UI card, bottle clinking.
  4. `04_order_tutorial.mp4` — Retro smartphone Instagram bio click, Tally.so interactive form selection with 2 Choco + 2 Matcha real bottles, snappy 15-second auto-fill, Gojek delivery scooter scene, and clear call-to-action button.
- **What to Observe Before Making Any New Video:**
  - **Pacing & Animation:** Note how Caleb holds calm, deliberate poses (NO syllable-by-syllable mouth flapping or rapid twitching) with a subtle ~3.3s breathing cycle (`Math.sin((frame / 50) * Math.PI) * 1.8px`). Poses switch only on key narrative beats.
  - **Dynamic Eye-Tracking Captions:** Notice how captions float borderless directly on the video at natural eye-level (e.g. on clean desk surfaces, driveway asphalt, or framed below cards), using font-switching (`Inter` for base words, `Silkscreen` for punchlines) with multi-layered neon glow shadows (`#FFE566`, `#39FF88`, `#00F0FF`, `#FF2E63`, active `#FFF566`).
  - **Real Bottle Appearance:** Observe how real transparent bottle cutouts are used with zero sticker modifications, recognized purely by their authentic liquid color (Matcha = green, Choco = dark brown, Milk Tea = caramel-tan).
  - **Clean Canvas:** Verify that there are zero black bars and zero clunky HUD scene tags (no "Scene 1/6").
- **Agent Pre-Flight Inspection Command:**
  ```bash
  # Check directory contents and previous renders
  ls -lh "$HOME/Desktop/lira reels/"
  # Inspect Remotion compositions in:
  # /Users/caleb/.gemini/antigravity/scratch/lira-remotion/src/
  ```

---

## 1. FIRST 3 SECONDS: PATTERN INTERRUPTION VISUAL HOOK (MANDATORY)

> [!CRITICAL]
> **Every single Lira reel MUST stop the feed scroll in the first 0:00 – 0:03 seconds.**
> A viewer makes their stay/swipe decision in under 1.5 seconds. Never start on a slow, static, or lukewarm opening frame.

### Pattern Interruption Techniques (Combine at least 2 in 0:00 – 0:03):
1. **Dynamic Camera Snap-In / Micro-Crash Zoom:**
   - Frame 0 to 20: Rapid snap-in easing (`interpolate(frame, [0, 20], [1.14, 1.0], { easing: Easing.out(Easing.cubic) })`).
   - Gives immediate momentum and pulls the viewer straight into the scene.
2. **Immediate Frame-1 Audio Hook:**
   - Synchronize Frame 0/1 with an impactful sound cue: a deep tactile sub-thud, a crisp tape-rewind whoosh, or a retro terminal power-on hum paired instantly with Caleb's opening spoken word.
3. **High-Contrast Visual Anomaly:**
   - A stark contrast element that disrupts typical feed patterns: an emerald-glowing spreadsheet in a pitch-black room, a sudden glitching retro phone screen, or a rapid hand movement snapping into focus.
4. **Scroll-Stopping Contrarian Text Hook:**
   - Dynamic eye-level hook subtitle that poses a provocative question or insider secret (e.g., *"Gua matiin Lira di minimarket."*, *"Siapa yang pesen Lira jam 2 pagi?"*, *"Cara dapet jatah Lira rahasia."*).

---

## 2. CONTINUOUS FLUID ANIMATION & DYNAMIC SCRIPT-DRIVEN INTERACTIONS (KILL "STOP-AND-GO" CUTS)

> [!IMPORTANT]
> **No More "Stop-and-Go" Slide Shows:** 
> Videos must NEVER feel like a static slideshow of frozen images separated by hard cuts ("one stop, one stop"). 
> Instead, **Caleb and the scene must move dynamically and continuously across the video** with fluid spatial traversal, active script-driven object interactions, continuous camera tracking, and organic micro-movements.

---

### 1. Eliminate "Stop-and-Go" Cuts (Continuous Kinetic Flow):
- **Continuous Camera & Scene Motion:**
  - Avoid abrupt, jarring hard cuts between static backdrops.
  - Connect narrative beats using **continuous tracking pans**, smooth push-ins, match-cuts on character actions (e.g. Caleb reaches for a bottle in Beat 1 $\rightarrow$ continuous pan places it into a box in Beat 2), or natural environmental wipes (walking past a doorway, pillar, or tree).
- **Subtle Ongoing Micro-Movements (Zero Frozen Frames):**
  - Even when Caleb pauses to speak or deliver a key punchline, he is **never a static frozen PNG**:
    - Organic human breathing cycle: `Math.sin((frame / 50) * Math.PI) * 1.8px`.
    - Living micro-movements: subtle weight shifting between feet, head turning to glance at an on-screen element, hand adjusting round glasses, fingers resting on laptop keys, curly hair softly bouncing with movement.
    - Environmental life: pulsing laptop screen glow, cold bottle condensation glints, passing street shadows, soft lamp flicker.

---

### 2. Caleb Moving Dynamically Across the Video (Spatial Traversal):
Caleb must actively navigate and move *through* the environment rather than staying glued to the center of the frame:
- **Walking & Running Across the Canvas:**
  - Caleb enters from left or right, walking briskly, jogging, or running across the screen to reflect script urgency (e.g. rushing to brew morning batches, hurrying to catch a delivery rider, walking across campus).
  - **Procedural Walk & Run Mechanics in Remotion:**
    ```ts
    // Horizontal traversal across the canvas
    const walkX = interpolate(frame, [startF, endF], [-150, 480], {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    // Natural bipedal walking bob (rhythmic rise and fall)
    const walkBobY = Math.abs(Math.sin((frame / 6) * Math.PI)) * 10;
    // Dynamic forward stride lean and secondary hair bounce
    const bodyTilt = Math.sin((frame / 6) * Math.PI) * 2.5;
    ```
- **Parallax Background Scrolling:**
  - As Caleb moves horizontally, the scene scrolls with multi-layer depth:
    - *Far background (skyscrapers/sky):* shifts at `0.2x` speed.
    - *Midground (counters/room walls):* shifts at `0.6x` speed.
    - *Foreground (counter edges/pavement):* shifts at `1.0x` speed.
  - Gives the viewer an immersive sense of continuous motion and journey.

---

### 3. Script-Driven Object & Environmental Interactions:
Every scene must feature Caleb physically interacting with objects, props, and environments directly tied to what the script is saying:
- **Arm & Hand Movements:**
  - 🧪 **Brewing & Pouring:** Tilting a kettle, pouring rich matcha green or oat milk into a mixing pitcher with subtle pixel steam/splashes.
  - 🧊 **Inspecting & Sealing:** Grasping an ice-cold PET bottle from a chiller, twisting/inspecting the gold cap, turning the bottle to admire the condensation.
  - 💻 **Laptop & Terminal Hacking:** Both hands actively typing across the olive-green laptop keyboard with rapid finger flutter, screen green glow reflecting off round glasses.
  - 👆 **Directing Focus & Pointing:** Snappy arm gestures pointing directly at on-screen UI cards, Tally checkboxes, leaderboard points, or bio links.
  - 🤝 **Handoffs & Toasts:** Handing cold delivery boxes over to Gojek couriers, handing a fresh bottle across a study table to a friend, clinking bottles in a celebration toast.
- **Environmental Interactions:**
  - Pushing open heavy glass refrigerator/chiller doors.
  - Stepping out from a dark hallway into bright morning sunlight.
  - Checking a glowing retro smartphone on the go while walking.
  - Stepping up to a parked Gojek scooter at a residential front gate.

---

### 4. Layered Asset Production & Sprite Rigging:
To achieve fluid movement without monolithic static images:
- **Layered Generation Workflow:**
  1. **Background Plates:** Clean, wide environments generated *without* character bake-in (e.g. empty modern white kitchen, empty late-night desk room, empty minimarket aisle, empty street).
  2. **Transparent Character Sprites (Caleb Cutouts):** Generate Caleb on pure transparent backgrounds in dynamic poses:
     - Walk/stride cycle frames (contact, passing, reach).
     - Running sprint frames.
     - Arm gesture frames (reaching, pointing, typing, holding bottle, raising bottle in toast).
  3. **Foreground Props:** Transparent PNGs of cold Lira bottles, insulated cooler boxes, glowing laptop screens, and smartphones.
- **Remotion Assembly:**
  - Composite sprites as separate JSX layers with independent translation, spring rotation, and anchor points (`transformOrigin: 'bottom center'`).
  - Swapping sprite frames on specific sub-beats creates fluid hand-drawn feel without jarring scene cuts.

---

### 5. Multi-Frame Character Action Animation (8–10 FPS Sequences):
- For high-impact physical interactions (e.g. **throwing the Lira bottle into a tote bag**, **turning the bottle upside down 180° over a laptop**, **pulling open a door**, or **lifting a tote bag**), **frame-by-frame character animation at 8–10 FPS is explicitly required**.
- Instead of static poses, animate Caleb's entire arm, hand, torso, and prop across 4 to 8 sequential frames.
- This gives authentic physical weight, follow-through, and fluid cartoon/anime momentum that makes the action deeply satisfying to watch.

---

### 6. Measured Pacing (Zero Chaos / High-Status Founder Demeanor):
- Dynamic movement must remain **cinematic and confident**, not twitchy or chaotic.
- **NO Mouth Flapping:** Never flap Caleb's mouth for every syllable. Poses and gestures trigger on key narrative phrases and emotional pivots.
- Caleb exudes the calm, locked-in demeanor of a 17yo founder with swagger. Movements have purposeful weight, anticipation, and follow-through.

---

## 3. CONTINUOUS QUALITY ESCALATION LOOP

> **The Iterative Bar:** No reel should ever be worse or equal to the previous one. Each new reel must actively benchmark against prior renders in `$HOME/Desktop/lira reels/` and push higher fidelity across all 5 dimensions:

1. **Art & Visual Depth:**
   - Richer layered pixel backgrounds (foreground, midground character, background ambient depth).
   - Flawless character consistency (messy curly black hair, round glasses, olive cardigan over cream shirt).
2. **Music Scoring & Dynamic Ducking:**
   - Premium lofi chillhop / cozy synthwave background track.
   - **MANDATORY Audio Ducking:** Background music sits at `-16dB to -18dB` during voiceover dialogue, swelling smoothly by `+4dB to +6dB` during intentional pauses, dramatic beats, or transitions.
3. **Tactile Foley & SFX Synchronization:**
   - Every on-screen event has an audio twin:
     - Phone tap / link click $\rightarrow$ subtle retro click or UI chime.
     - Form auto-fill $\rightarrow$ fast mechanical keyboard clatter.
     - Delivery arrival $\rightarrow$ distant scooter hum and cold cooler box thud.
     - Bottle cheers/toast $\rightarrow$ crisp glass/PET clink.
4. **Pacing & Narrative Timing:**
   - Tight edits where visual events anticipate speech by ~3–5 frames so the eye lands right as the voice speaks.
5. **Visual Hooks & Graphic Polish:**
   - Seamless font switching between clean Sans and pixel font accents with zero text jitter.

## 4. BRAND TONALITY: ALWAYS PREMIUM & CLASSY (VIBE SET AS INITIAL BRIEF)

> [!IMPORTANT]
> **The Golden Tone Rule:** 
> Every Lira video must **ALWAYS have an upscale, premium, classy, and refined aesthetic feel**.
> While the **vibe** (atmosphere, story angle, emotional mood) is decided by the user as the initial creative brief, that vibe must **always be filtered through a lens of quiet luxury and high-end design**. Never tacky, never cheap, never chaotic meme-spam.

### 1. The "Premium & Classy" Standard Across All Dimensions:
- **Visual Polish & Quiet Luxury:**
  - Rich, cohesive color harmonies: deep matcha greens (`#1D4A38`), rich cocoa browns, warm cream/ivory (`#FAF7F0`), brushed brass/gold (`#D4AF37`), slate charcoal (`#1F2421`).
  - Sophisticated cinematic lighting: volumetric sunbeams, warm golden-hour rim lights, soft atmospheric bokeh, subtle glowing lens flares, and realistic condensation droplets.
  - Generous negative space and balanced composition: frames feel intentional, curated, and uncluttered like high-end editorial magazines or boutique indie video game cutscenes (e.g. Studio Ghibli or A24).
- **Acoustic & Musical Refinement:**
  - High-fidelity background music: smooth lo-fi jazz, warm vinyl Rhodes chords, boutique neo-soul chillhop, or sophisticated atmospheric synth lounge.
  - Tactile, crisp sound design: warm tape clicks, satisfying mechanical key clacks, subtle ambient cafe clatter, and crisp glass bottle clinks.
- **Caleb's High-Status Presence:**
  - Caleb exudes quiet founder charisma: calm, locked-in, intellectually curious, and composed.
  - Sartorial consistency: knit olive-green cardigan, crisp cream shirt collar, polished round glasses, natural messy curls.

### 2. The Initial Creative Vibe as the Narrative Engine:
- **User Sets the Vibe:** The user specifies the initial vibe for each reel (e.g., *"mysterious insider-only 2:00 AM secret database"*, *"sunlit morning campus rush"*, *"hectic artisan kitchen batch"*, *"secret society drop"*).
- **How to Harmonize Vibe + Premium Classy:**
  - *If the vibe is "hectic/rush":* Frame it as dedicated artisan craftsmanship under high demand, not messy slapstick panic.
  - *If the vibe is "mysterious insider":* Frame it as exclusive, high-status private access with moody emerald terminal screens and deep shadows.
  - *If the vibe is "how to order/tutorial":* Frame it as a sleek, effortless VIP concierge booking ritual.

---

## 5. STRICT PRODUCT & REAL BOTTLE RULES (ZERO MODIFICATIONS)

> [!CAUTION]
> **DO NOT EDIT ANY LABELS, STICKERS, OR REAL BOTTLE PHOTOS.**

- **Do NOT Edit Any Stickers or Labels:** 
  - Never add text like *"Matcha Latte"*, *"Choco Hazelnut"*, or flavor names to the bottle.
  - The bottle label is strictly the official circular cream Lira logo with its cursive script, green double border, and three leaf accents.
- **Real Bottle Picture Usage:**
  - **Do NOT edit the bottle graphic.**
  - **Do NOT alter stickers, proportions, caps, or liquid colors.**
  - **The ONLY allowed operation on real bottle photos is clean background removal.** Use it as-is with a transparent background. People recognize flavors entirely by liquid color:
    - 🌿 **Green** = Matcha Latte
    - 🍫 **Dark Brown** = Choco Hazelnut
    - 🧋 **Caramel-Tan** = Milk Tea

---

## 6. COMPOSITION & CLEAN CANVAS (NO BARS / NO HUD BLOCKS)

- **NO Letterbox Bars:** Absolutely get rid of black bars, top letterboxes, or bottom letterboxes.
- **NO Clunky Header/Footer HUD Blocks:** 
  - Do NOT include things like *"Lira Labs • Origin Story Scene 1/6"*, *"Scene 01 / 06"*, or *"2 AM founder room glowing database"*.
  - Keep the canvas 100% clean, edge-to-edge, immersive video.
- **Canvas Dimensions:** Standard 4:5 vertical feed ratio: `1080 x 1440` @ `30 fps`.

---

## 7. DYNAMIC EYE-TRACKING & WORD-BY-WORD POP CAPTION SYSTEM

> [!IMPORTANT]
> **Viewers must be able to read captions effortlessly at first glance.**
> Captions must pop up word-by-word with tactile spring physics, adopt high-contrast popping colors against the scene, and be shielded by a multi-layered contrast outline so they never wash out on light or busy backgrounds.

### 1. Word-by-Word Kinetic Pop-Up Mechanics (Mandatory):
- **Bite-Sized Chunking (2 to 3 Words at a Time):**
  - Captions MUST be burned in and displayed in **tight, punchy chunks of 2 to 3 words at a time** (e.g. *"Pernah nggak lo sadar"* $\rightarrow$ *"beli matcha cup plastik"* $\rightarrow$ *"nyusahin hidup"*).
  - Never display long 6+ word lines or static sentences. 2–3 word bursts match natural TikTok/Reels eye movement, keeping viewer attention sharp and energetic.
- **Sequential Word Reveal:** Words pop into existence one by one precisely as spoken in the audio:
  ```ts
  // In Remotion: words reveal strictly when current frame reaches word.from
  if (frame < word.from) return null;
  ```
- **Snappy Spring Scale-In:**
  Each word pops in with an energetic scale burst that settles quickly:
  ```ts
  const wordAge = frame - word.from;
  const wordPop = spring({
    frame: wordAge,
    fps: 30,
    config: { damping: 16, stiffness: 220, mass: 0.5 },
  }); // Scales smoothly from 0 -> 1.15 -> 1.0
  ```
- **Active Spoken Word Highlighting:**
  The currently active word being spoken is accentuated with:
  - Larger scale punch (`scale: 1.08x - 1.12x`).
  - High-contrast active glow & color switch (`#FFE566` / `#FFF566`).
  - Settled words transition smoothly to crisp contrast ivory (`#FFFFFF`).

### 2. High-Contrast Colors That POP (Guaranteed Readability):
- **Active Spoken Word:** Ultra-high-contrast **Electric Pop Yellow** (`#FFE566` or `#FFF566`) or **Neon Emerald** (`#39FF88`).
- **Brand / Punchline Accents:**
  - ⚡ Electric Gold: `#FFE566`
  - 🌿 Neon Emerald: `#39FF88`
  - 💎 Cyber Cyan: `#00F0FF`
  - 🔥 Vibrant Crimson / Coral: `#FF2E63`
- **Base / Settled Words:** Pure Crisp White (`#FFFFFF`).
- **Adaptive Contrast Against Backgrounds:**
  - On **Dark Scenes** (night desk, bedroom): Words pop brightly with electric neon glow.
  - On **Bright / White Scenes** (white marble kitchen counter, sunlit morning pavement, bright sky): Words MUST maintain high contrast using the **Multi-Layer Contrast Shield** below so the text never washes out or blurs into the background.

### 3. Multi-Layer Contrast Shield (Outline & Shadow):
Every caption must be wrapped in a multi-layered contrast barrier so letters are 100% legible over ANY backdrop:
```ts
textShadow: [
  // 4-directional solid contrast outline (prevents blend-in with bright backgrounds)
  '-2px -2px 0 #000',
  '2px -2px 0 #000',
  '-2px 2px 0 #000',
  '2px 2px 0 #000',
  // Deep ambient drop shadow for cinematic depth
  '0 4px 16px rgba(0, 0, 0, 0.98)',
  '0 2px 6px rgba(0, 0, 0, 0.95)',
  // Vibrant neon colored aura
  `0 0 24px ${activeGlowColor}`,
].join(', '),
WebkitTextStroke: '1px rgba(0, 0, 0, 0.85)',
```

### 4. Dynamic Eye-Tracking Placement:
- Default Anchor: **Center or slightly below center** (approx. `top: 700px – 780px` on a 1440px canvas).
- Dynamic Adjustment: Shift vertically to track the viewer's focal interest (e.g. above or below interactive cards, resting naturally on desk surfaces, or on driveway asphalt).
- **NO Heavy Opaque Modal / Capsule Boxes:** Captions float borderless directly on the video, exactly like modern top-tier creator reels.

### 5. Typography & Font Switching:
- **Base Words:** Clean, modern, crisp sans-serif (`-apple-system`, `Inter`, `SF Pro Display`) in natural sentence casing (never ALL CAPS).
- **Accent & Punchline Words:** Retro 8-bit pixel font (`Silkscreen`) for emphasis, punchlines, numbers, and brand terms.

---

## 8. CHARACTER IDENTITY (PIXEL-CALEB)

- **Visual Baseline:**
  - 17-year-old Indonesian student founder.
  - Voluminous messy curly black hair.
  - Thin round black-rimmed glasses.
  - Knit olive-green button-up cardigan over a cream collared shirt, charcoal trousers.
  - Reference file: `public/assets/pixel/character/caleb_character_turnaround.png`.

---

## 9. USER PRIVACY & ANONYMIZATION

- **Zero Fake Names:** Never use fake full names (e.g. "Sarah M.", "Dimas K.", "Vania R.").
- **Privacy Standard:** Always use anonymized initials or handles:
  - Format: `C---` or `Cxxx` (e.g., `S--- @sxxx`, `D--- @dxxx`, `V--- @vxxx`, `C--- @cxxx`).

---

## 10. TECHNICAL ENVIRONMENT & RENDERING

- **Output Directory:** `$HOME/Desktop/lira reels/` (path: `/Users/caleb/Desktop/lira reels/`)
- **Resolution:** `1080 x 1440` (H.264, 30fps, CRF 18).
- **Remotion Project Root:** `/Users/caleb/.gemini/antigravity/scratch/lira-remotion`
- **Render Execution:**
  ```bash
  # Inside /Users/caleb/.gemini/antigravity/scratch/lira-remotion
  ./node_modules/.bin/remotion render src/index.ts <CompositionName> "$HOME/Desktop/lira reels/<output_name>.mp4"
  ```
- **Automatic Multi-Turn Workflow:**
  Whenever an audio recording (`.mp3`) and vibe description are supplied, parse timestamps with whisper/ffmpeg, generate corresponding storyboard art matching character turnaround, build the Remotion composition, render the `.mp4`, verify quality, and deliver to `/Users/caleb/Desktop/lira reels/`.
- **Audio Polishing Protocol (Mandatory):**
  - Use `ffmpeg` and timestamp analysis to inspect the raw recording.
  - **Cut filler words, sighs, and false starts.**
  - **Trim pauses longer than 0.3s** so speech flows with crisp, high-retention momentum.
  - **Zero Clipping Rule:** Cut strictly at zero-crossing silence intervals between words so no syllable starts or ends abruptly.

---

## 11. ONE-COMMAND AUTOMATED INSTAGRAM REEL PUBLISHING (BUFFER)

> [!IMPORTANT]
> **Universal Cross-Chat Availability & Mandatory Review Gate:**
> Any chat session can publish rendered videos directly to `@drinklira` on Instagram Reels.
> **REVIEW GATE:** The agent **MUST** present the rendered video to the user for review and confirmation first. Only execute the Buffer auto-post once the user reviews and confirms it fits.

- **Connected Instagram Channel:** **`@drinklira`** (Channel ID: `6ad933a2778b240e2f81b45d`)
- **Associated Buffer Account:** `drink.lira@gmail.com`
- **Publishing Script Path:** `/Users/caleb/.gemini/antigravity/scratch/lira-remotion/scripts/post_reel.js`
- **Execution Command (Universal across all conversations):**
  ```bash
  /Users/caleb/.gemini/antigravity/scratch/.node/bin/node /Users/caleb/.gemini/antigravity/scratch/lira-remotion/scripts/post_reel.js \
    --file "/Users/caleb/Desktop/lira reels/<filename>.mp4" \
    --caption "<caption with hashtags>" \
    --firstComment "Link in bio: bit.ly/LiraVault 🌿" \
    --mode shareNow
  ```
- **Parameters:**
  - `--file`: Absolute path to rendered `.mp4`.
  - `--caption`: Full caption text with hashtags.
  - `--firstComment`: Optional automatic first comment (e.g. order link).
  - `--mode`: `shareNow` (publish immediately), `addToQueue` (add to Buffer queue), or `customScheduled` (requires `--dueAt "YYYY-MM-DDTHH:mm:ssZ"`).
- **Automated Tunnel & Security:**
  The script automatically handles local HTTP file streaming, spins up a temporary secure Cloudflare tunnel for Buffer to pull the video, submits the GraphQL Reel mutation, verifies transmission, and tears down the tunnel upon completion.


