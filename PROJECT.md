# Project: Lira Viral Content Engine & Publishing Automation

## Architecture
The system consists of an end-to-end autonomous content creation, verification, and publishing pipeline for Instagram Reels and Carousels for Lira F&B (`@drinklira`).

```
                         [Content Ledger: data/content_ledger.json]
                                       │ (history & cooldowns)
                                       ▼
                       [Automator: scripts/lira_content_automator.js]
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        [Reel Engine (Remotion 9:16)]         [Carousel Engine (4:5)]
         • 1080×1920 @ 30fps                   • 1080×1350, 6–8 slides
         • Frame-0 4-layer hook                • Slide 2 standalone re-serve hook
         • ElevenLabs v3 VO (-14 LUFS)         • High-save comparison sheet
         • Universal safe box                  • Editorial typography & SSOT assets
                    │                                     │
                    └──────────────────┬──────────────────┘
                                       ▼
                   [Guardrail Gate: scripts/validate_guardrails.js]
                     • Strictly non-numeric scarcity
                     • Zero financial / school / recipe leaks
                     • Zero emojis
                                       │
                                       ▼ (passes guardrails)
                   [Buffer GraphQL Publisher: scripts/publish_now.js]
                     • mode: "shareNow", PostType: reel / carousel
                     • cloudflared tunnel lifecycle
                     • --dry-run (verification) / --live (sidecar only)
                                       ▲
                                       │
           [Daily WIB Rush-Hour Sidecar: 30 7,12,18 * * * Asia/Jakarta]
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | 8 Forensic Drop-Off Fixes | Code/script fixes for the 8 forensic causes of the 53% 0:01 viewer drop-off | M1 | ORIGINAL_REQUEST §R1, R2 |
| 2 | 4-Layer Frame-0 Hook Stacking | Synchronized Visual, Written, Verbal, Foley hook layers at 0.00s | M1, M2 | ORIGINAL_REQUEST §R1, R2 |
| 3 | 7 PBL Hook Taxonomy | Educational, Comparison, Myth Busting, Storytelling, Random, Authority, DITL | M1, M4 | ORIGINAL_REQUEST §R1, R4 |
| 4 | Open Loops & Seamless Loop Splice | Nested curiosity loops and seamless grammatical/visual loop-back ending | M1, M2 | ORIGINAL_REQUEST §R1, R2 |
| 5 | Master Guide Bible | Definitive specification at `Desktop/lira reels/LIRA_ULTIMATE_REEL_AND_CAROUSEL_BIBLE.md` | M1 | ORIGINAL_REQUEST §R1 |
| 6 | Skill Reconciliation | Update `/Users/caleb/.gemini/config/skills/lira-video/SKILL.md` to remove contradictions | M1 | ORIGINAL_REQUEST §R1 |
| 7 | Archify HTML Explainer | Standalone interactive HTML explainer in `.archify/` passing `archify.mjs finalize` | M1 | ORIGINAL_REQUEST §R1 |
| 8 | 1080×1920 9:16 30fps Remotion Rig | Parameterized composition with universal safe box `x:[84,888], y:[288,1248]` | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Continuous Motion in 0.0s–3.0s | Unclamped camera drift + sprite breathing (fixing 0.67s freeze & stripping particle spam) | M2 | ORIGINAL_REQUEST §R2 |
| 10 | Saccadic Eye-Flow Decoupling | Borderless headline (≤6 words, 1 accent) + subtitles delayed until ≥1.30s | M2 | ORIGINAL_REQUEST §R2 |
| 11 | Audio Pipeline Optimization | ElevenLabs v3 synthesis, silence stripping onset ≤0.02s, -14 ± 2.0 LUFS, royalty-free BGM | M2 | ORIGINAL_REQUEST §R2 |
| 12 | 1080×1350 4:5 Carousel Engine | Parameterized pipeline generating 6–8 crisp JPEG slides per post | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Standalone Slide 2 Re-serve Hook | Slide 2 conversion hook (≤12 words) for 2nd feed impressions | M3 | ORIGINAL_REQUEST §R3 |
| 14 | High-Save Comparison Sheet | High-utility, high-save reference/cheat-sheet/comparison slide | M3 | ORIGINAL_REQUEST §R3 |
| 15 | Editorial Art Direction | Zero glow blobs, zero 48px grids, zero 01/04 badges, zero emojis, authentic Lira assets | M3 | ORIGINAL_REQUEST §R3 |
| 16 | Non-Repeating Content Ledger | `data/content_ledger.json` tracking schema, seeded with Reels 1–13 & 13 Carousels | M4 | ORIGINAL_REQUEST §R4 |
| 17 | Cooldown & Bigram Jaccard Gate | 0 repeated tuples across 10 alternating slots & <0.30 bigram Jaccard similarity | M4 | ORIGINAL_REQUEST §R4 |
| 18 | Programmatic Guardrail Validator | `scripts/validate_guardrails.js` blocking exact counts, leaks, emojis + test suite | M4 | ORIGINAL_REQUEST §R4 |
| 19 | Legacy Asset Sanitization | Purge leaks ("UPH", "dua tetes", "ceremonial", batch counts, emojis) across codebase | M4 | ORIGINAL_REQUEST §R4 |
| 20 | Buffer GraphQL API Publisher | `mode: "shareNow"`, `type: "reel"`, `type: "carousel"`, no `firstComment` / `collaborators` | M5 | ORIGINAL_REQUEST §R5 |
| 21 | Cloudflared Tunnel Lifecycle | Keep tunnel open until Buffer confirms post status `sent` | M5 | ORIGINAL_REQUEST §R5 |
| 22 | Controlled Infrastructure Safety | `--dry-run` default for tests without mutating live `@drinklira` feed | M5 | ORIGINAL_REQUEST §R5 |
| 23 | Daily Rush-Hour Automation Sidecar | `sidecar.json` with cron `30 7,12,18 * * * Asia/Jakarta`, scoped grants, untouched user config | M5 | ORIGINAL_REQUEST §R5 |
| 24 | E2E Test Suite & Adversarial Hardening | 100% pass across Tiers 1–4, followed by Tier 5 adversarial coverage hardening | M6 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0-TEST | E2E Testing Track | Requirement-driven opaque-box test infrastructure and Tiers 1–4 test suite; publishes `TEST_READY.md` | none | IN_PROGRESS |
| M1 | Master Guide & Archify Explainer | Author `LIRA_ULTIMATE_REEL_AND_CAROUSEL_BIBLE.md`, reconcile `lira-video/SKILL.md`, author & validate `/archify` interactive HTML | none | IN_PROGRESS |
| M2 | High-Retention Reel Engine | Remotion 9:16 composition, safe box, continuous motion rig, decoupled subtitles, ElevenLabs v3 audio pipeline | M1 | PLANNED |
| M3 | Editorial Carousel Engine | 1080×1350 4:5 6–8 slide generator, standalone Slide 2 re-serve hook, high-save reference slide | M1 | PLANNED |
| M4 | Content Automator & Guardrail Gate | `data/content_ledger.json`, cooldown & Jaccard logic, `scripts/validate_guardrails.js` + test suite, legacy leaks sanitization | M1 | PLANNED |
| M5 | Instagram Publisher & Sidecar | Buffer GraphQL publisher with `mode: "shareNow"`, tunnel lifecycle, `--dry-run` verification, sidecar validation | M4 | PLANNED |
| M6 | Final E2E Integration & Coverage Hardening | Phase 1: Pass 100% of E2E tests (Tiers 1–4). Phase 2: Adversarial coverage hardening (Tier 5) with Challengers | M0-TEST, M2, M3, M4, M5 | PLANNED |

## Interface Contracts
### Content Automator ↔ Reel & Carousel Engines
- Automator generates slot configuration: `{ format: 'reel'|'carousel', pillar, hook_category, topic, verbal_hook, written_hook, caption, slides? }`
- Output must pass `validate_guardrails.js: validateContent(config)` before invoking rendering.
- Reel engine accepts JSON payload and outputs `1080×1920` MP4 at 30fps.
- Carousel engine accepts JSON payload and outputs array of 6–8 `1080×1350` JPEG images.

### Guardrail Validator ↔ Publisher
- `validateContent({ script, caption, overlays, hookText })` throws `GuardrailError` on any match of:
  - Exact bottle count: `/\b\d+\s+botol\b/i`
  - Exact stevia dosage: `/\b\d+\s*(?:tetes|ml|gram|g)\s*(?:daun\s*)?stevia\b/i`
  - School names: `/\b(UPH|UPHC|UPH College|Baranangsiang|Barsih|SMK Baranangsiang)\b/i`
  - Financials: `Rp500M`, `Rp21M`, `Rp8.6M`, `War Chest`, `HPP`, `COGS`, `margin`, `20% fee`, `74%`, `66%`
  - Banned terms: `ceremonial`, `WithUs`, `JBD`, `Jakarta Bubble Drink`
  - Unicode emojis in caption or on-screen overlay text.

### Buffer Publisher ↔ Buffer GraphQL API
- Endpoint: `POST https://api.buffer.com`
- Header: `Authorization: Bearer <BUFFER_ACCESS_TOKEN>`
- Channel: `6ad933a2778b240e2f81b45d`
- Mutation: `createPost(input: { channelId, schedulingType: "shareNow", text, media, metadata: { instagram: { type: "reel"|"carousel", shouldShareToFeed: true } } })`
- Prohibited fields: `firstComment`, `metadata.instagram.collaborators`.
- Tunnel lifecycle: `cloudflared` process must remain active until Buffer post status transitions to `sent` or timeout (300s).

## Code Layout
- `Desktop/lira reels/LIRA_ULTIMATE_REEL_AND_CAROUSEL_BIBLE.md` — Canonical Master Guide (SSOT)
- `/Users/caleb/.gemini/config/skills/lira-video/SKILL.md` — Reconciled Lira Video Skill
- `.archify/lira-retention-system.html` — Validated standalone interactive HTML explainer
- `src/` — Remotion compositions, safe-zone wrappers, audio components, carousel slide templates
- `public/assets/` — SSOT bottle cutouts (`bottles_ssot/`), cooler bag cutout, pixel Caleb sprites, royalty-free BGM, foley SFX
- `data/content_ledger.json` — Persistent content history, cooldowns, and bigram similarity tracking
- `scripts/lira_content_automator.js` — Automated non-repeating content orchestrator
- `scripts/validate_guardrails.js` — Programmatic guardrail rule validator
- `scripts/publish_now.js` — Buffer GraphQL Instagram publisher (`--dry-run` / `--live`)
- `tests/` — E2E opaque-box test suites (Tiers 1–4), unit tests for guardrails, automator, and publisher
- `/Users/caleb/.gemini/config/sidecars/lira-viral-content-engine/sidecar.json` — Automation sidecar configuration
