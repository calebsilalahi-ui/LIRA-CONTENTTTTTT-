# Lira Viral Content Engine - Testing Infrastructure Specification (TEST_INFRA.md)

## 1. Overview & Architecture
The testing infrastructure for Lira F&B's Viral Content Engine (`@drinklira`) provides an opaque-box, requirement-driven end-to-end verification harness across 4 testing tiers. The framework ensures 100% adherence to brand guardrails, video retention dynamics, editorial carousel specifications, non-repeating content scheduling, and safe publishing infrastructure.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LIRA E2E TEST INFRASTRUCTURE                         │
├────────────────────────────────────────────────────────────────────────┤
│ Tier 1: Feature Coverage (24 Features in PROJECT.md, >=5 tests each)   │
│         - Primary contract behavior, happy paths, observable outputs   │
│         - 24 suites, 122 tests total                                   │
├────────────────────────────────────────────────────────────────────────┤
│ Tier 2: Boundary & Corner Cases (>=5 tests per boundary feature)       │
│         - Extreme durations, safe box boundaries, loudness limits,     │
│           Jaccard thresholds, exact regex edges, rate limits           │
│         - 28 boundary tests total                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Tier 3: Pairwise Cross-Feature Interactions                            │
│         - Automator -> Guardrails -> Reel Rendering                    │
│         - Automator -> Cooldown Ledger -> Carousel Slides              │
│         - Publisher -> Dry-Run -> Cloudflared Tunnel Lifecycle         │
│         - 13 cross-feature tests total                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Tier 4: Real-World Workload Scenarios                                  │
│         - 10-slot alternating rush-hour simulation (Reel/Carousel)     │
│         - 4-SKU continuous recycling across 7 PBL categories           │
│         - Adversarial leak injections & network glitch recoveries      │
│         - 7 scenario stress tests total                                │
└────────────────────────────────────────────────────────────────────────┘
```

## 2. Tooling Runtimes & Safety Mandates
To prevent macOS developer tool popups and preserve production integrity:
- **Node.js Runtime:** Strictly `/Users/caleb/.gemini/antigravity/scratch/.node/bin/node` (v22.14.0 native `node:test` and `node:assert/strict`).
- **Python Runtime:** Strictly `/Users/caleb/.gemini/antigravity/scratch/dwp_reel/.venv/bin/python3`. Never invoke `/usr/bin/python3` or `/usr/bin/git`.
- **Media Binaries:** `/Users/caleb/.local/bin/ffmpeg` and `/Users/caleb/.local/bin/ffprobe`.
- **Tunnel Binary:** `/Users/caleb/.gemini/antigravity/scratch/bin/cloudflared` (or PATH fallback).
- **Controlled Infrastructure:** All publisher tests run with `--dry-run` default. Never dispatch live mutations to `@drinklira`'s live Instagram feed during development or automated test runs.

## 3. Directory Layout & Test Inventory
```
tests/
├── helpers/
│   ├── test_constants.js         # Universal test constants, regexes, coordinates, paths
│   ├── guardrail_oracle.js       # Mathematical & regex guardrail verification oracle
│   ├── jaccard_oracle.js         # Bigram tokenization & Jaccard similarity oracle
│   ├── media_verifier.js         # ffprobe & ffmpeg ebur128/silencedetect analysis
│   └── test_fixture_loader.js    # Fixture generators, temp sandboxes, .env parser
├── tier1_features/               # 24 feature test files (122 tests total)
│   ├── test_f01_forensic_dropoff_fixes.js
│   ├── test_f02_frame0_hook_stacking.js
│   ├── test_f03_pbl_hook_taxonomy.js
│   ├── test_f04_open_loops_seamless_splice.js
│   ├── test_f05_master_guide_bible.js
│   ├── test_f06_skill_reconciliation.js
│   ├── test_f07_archify_html_explainer.js
│   ├── test_f08_remotion_9x16_rig.js
│   ├── test_f09_continuous_motion_rig.js
│   ├── test_f10_saccadic_eyeflow_decoupling.js
│   ├── test_f11_audio_pipeline_optimization.js
│   ├── test_f12_carousel_4x5_engine.js
│   ├── test_f13_slide2_reserve_hook.js
│   ├── test_f14_high_save_comparison_sheet.js
│   ├── test_f15_editorial_art_direction.js
│   ├── test_f16_non_repeating_content_ledger.js
│   ├── test_f17_cooldown_bigram_jaccard_gate.js
│   ├── test_f18_guardrail_validator.js
│   ├── test_f19_legacy_asset_sanitization.js
│   ├── test_f20_buffer_graphql_publisher.js
│   ├── test_f21_cloudflared_tunnel_lifecycle.js
│   ├── test_f22_controlled_infra_safety.js
│   ├── test_f23_daily_rush_hour_sidecar.js
│   └── test_f24_e2e_test_suite_coverage.js
├── tier2_boundaries/             # Boundary value verification
│   └── test_tier2_boundaries.js  # Safe box, LUFS, durations, word counts, regex boundaries (28 tests)
├── tier3_cross_feature/          # Cross-module pairwise interactions
│   └── test_tier3_interactions.js # Automator -> Guardrails -> Engines -> Publisher (13 tests)
└── tier4_real_world/             # Real-world batch simulations
    └── test_tier4_scenarios.js   # 10-slot rush hour, 4-SKU recycling, stress, recoveries (7 tests)
```

## 4. Tier 1 Feature Inventory & Test Mapping

| # | Feature Name | Test File | Test Count | Specification / Interface Contract |
|---|--------------|-----------|------------|-----------------------------------|
| F01 | 8 Forensic Drop-Off Fixes | `tests/tier1_features/test_f01_forensic_dropoff_fixes.js` | 5 | Eliminates 53% 0:01 drop-off root causes; no throat-clearing |
| F02 | 4-Layer Frame-0 Hook Stacking | `tests/tier1_features/test_f02_frame0_hook_stacking.js` | 5 | Visual, Written, Verbal, Foley layers synchronized at 0.00s |
| F03 | 7 PBL Hook Taxonomy | `tests/tier1_features/test_f03_pbl_hook_taxonomy.js` | 5 | Educational, Comparison, Myth Busting, Story, Random, Authority, DITL |
| F04 | Open Loops & Seamless Splice | `tests/tier1_features/test_f04_open_loops_seamless_splice.js` | 5 | Curiosity bridges & grammatical/visual loop-back to Frame 0 |
| F05 | Master Guide Bible | `tests/tier1_features/test_f05_master_guide_bible.js` | 5 | Canonical specification at `Desktop/lira reels/LIRA_...BIBLE.md` |
| F06 | Skill Reconciliation | `tests/tier1_features/test_f06_skill_reconciliation.js` | 5 | Reconciles `~/.gemini/config/skills/lira-video/SKILL.md` |
| F07 | Archify HTML Explainer | `tests/tier1_features/test_f07_archify_html_explainer.js` | 5 | Standalone HTML explainer passing `archify.mjs finalize` |
| F08 | 1080×1920 9:16 Remotion Rig | `tests/tier1_features/test_f08_remotion_9x16_rig.js` | 5 | Universal safe box `x:[84,888], y:[288,1248]`, 22–35s duration |
| F09 | Continuous Motion in 0.0s–3.0s | `tests/tier1_features/test_f09_continuous_motion_rig.js` | 5 | Unclamped drift + breathing; strips freeze & particle noise |
| F10 | Saccadic Eye-Flow Decoupling | `tests/tier1_features/test_f10_saccadic_eyeflow_decoupling.js` | 5 | Headline ≤6 words, 1 accent, subtitles delayed until ≥1.30s |
| F11 | Audio Pipeline Optimization | `tests/tier1_features/test_f11_audio_pipeline_optimization.js` | 5 | ElevenLabs v3 VO, onset ≤0.03s, -14 ± 2.0 LUFS, royalty-free BGM |
| F12 | 1080×1350 4:5 Carousel Engine | `tests/tier1_features/test_f12_carousel_4x5_engine.js` | 5 | Exact 1080×1350 JPEG output, 6–8 slides per post |
| F13 | Standalone Slide 2 Re-serve Hook | `tests/tier1_features/test_f13_slide2_reserve_hook.js` | 5 | Re-serve conversion hook ≤12 words for 2nd feed impressions |
| F14 | High-Save Comparison Sheet | `tests/tier1_features/test_f14_high_save_comparison_sheet.js` | 5 | Reference cheat-sheet/comparison slide preceding CTA |
| F15 | Editorial Art Direction | `tests/tier1_features/test_f15_editorial_art_direction.js` | 5 | Zero glow blobs, zero 48px grids, zero badges, zero emojis |
| F16 | Non-Repeating Content Ledger | `tests/tier1_features/test_f16_non_repeating_content_ledger.js` | 5 | Persistent tracking in `data/content_ledger.json`, seeded Reels 1–13 |
| F17 | Cooldown & Bigram Jaccard Gate | `tests/tier1_features/test_f17_cooldown_bigram_jaccard_gate.js` | 5 | 0 repeated tuples across 10 slots & <0.30 bigram Jaccard ceiling |
| F18 | Guardrail Validator | `tests/tier1_features/test_f18_guardrail_validator.js` | 5 | Rejects bottle counts, stevia dosages, schools, financials, emojis |
| F19 | Legacy Asset Sanitization | `tests/tier1_features/test_f19_legacy_asset_sanitization.js` | 5 | Purges leaks ("UPH", "dua tetes", "ceremonial", batch numbers) |
| F20 | Buffer GraphQL API Publisher | `tests/tier1_features/test_f20_buffer_graphql_publisher.js` | 6 | `mode: "shareNow"`, `reel`/`carousel`, prohibits `firstComment` |
| F21 | Cloudflared Tunnel Lifecycle | `tests/tier1_features/test_f21_cloudflared_tunnel_lifecycle.js` | 6 | Tunnel stays active until post status `sent`; 300s timeout guard |
| F22 | Controlled Infra Safety | `tests/tier1_features/test_f22_controlled_infra_safety.js` | 5 | Default `--dry-run`, requires explicit `--live`, secret hygiene |
| F23 | Daily Rush-Hour Sidecar | `tests/tier1_features/test_f23_daily_rush_hour_sidecar.js` | 5 | `CRON_TZ=Asia/Jakarta 30 7,12,18 * * *`, scoped grants, zero wildcards |
| F24 | E2E Test Suite Coverage | `tests/tier1_features/test_f24_e2e_test_suite_coverage.js` | 5 | Complete inventory, >=120 tests, adversarial assertions, runner |

## 5. Execution Guide & Unified Runner
The test runner is located at `scripts/run_e2e_tests.js` and executes via the sandboxed Node runtime.

### Running All Test Tiers
```bash
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node scripts/run_e2e_tests.js --tier all --summary
```

### Running Specific Tiers
```bash
# Run Tier 1 only (Feature Coverage)
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node scripts/run_e2e_tests.js --tier 1 --summary

# Run Tier 2 only (Boundaries)
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node scripts/run_e2e_tests.js --tier 2 --summary

# Run Tier 3 only (Cross-Feature Interactions)
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node scripts/run_e2e_tests.js --tier 3 --summary

# Run Tier 4 only (Real-World Stress Scenarios)
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node scripts/run_e2e_tests.js --tier 4 --summary
```

### Filtering Tests
```bash
# Run specific feature test in Tier 1
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node scripts/run_e2e_tests.js --feature 20

# Run tests matching regex pattern
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node scripts/run_e2e_tests.js --filter "publisher|tunnel"
```

### Direct Node Test Invocation
Any individual test file can be run directly using Node's native runner:
```bash
/Users/caleb/.gemini/antigravity/scratch/.node/bin/node --test tests/tier1_features/test_f20_buffer_graphql_publisher.js
```

## 6. Progressive Testability & Opaque-Box Derivation
The test suite implements **Progressive Testability**:
1. **Authoritative Output Derivation:** Expected outputs are derived mathematically or directly from `PROJECT.md` specifications and `ORIGINAL_REQUEST.md`.
2. **Oracle Architecture:** Helper oracles (`guardrail_oracle.js`, `jaccard_oracle.js`, `media_verifier.js`) provide reference calculations against which implementations are validated.
3. **Dynamic Script Resolution:** Test suites dynamically bind to landed scripts (e.g. `scripts/validate_guardrails.js`, `scripts/publish_now.js`) when present, falling back to verified oracles to prevent failure cascading during multi-agent phased development.
4. **Adversarial Input Validation:** Suites assert error handling for malformed payloads, injection attempts, and boundary exceedances using `assert.throws` and `assert.rejects`.
5. **Zero State Pollution:** Tests run in isolation using temporary sandbox directories (`createTempSandbox`) and clean up all resources upon completion.

## 7. Pass/Fail Gates & Acceptance Thresholds
- **Tier 1 Gate:** 24/24 features covered; minimum 5 tests per feature; 100% pass rate (122 tests passed).
- **Tier 2 Gate:** Audio loudness bounds [-16.0, -12.0 LUFS], safe box boundaries, durations [22s, 35s], slide counts [6, 8], word counts all pass.
- **Tier 3 Gate:** Complete pipeline interactions verified without data loss or unintended side effects.
- **Tier 4 Gate:** 10-slot alternating rush-hour simulation passes with 0 duplicate tuples and <0.30 Jaccard similarity.
- **Exit Code:** Strict `0` indicates complete verification success. Any non-zero exit code indicates a defect.
