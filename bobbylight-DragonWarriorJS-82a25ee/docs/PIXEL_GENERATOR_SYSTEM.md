# Pixel Generator System Design

## Goal
Create one deterministic pipeline that can generate every pixel-art output type in the project: UI, font sheets, tiles, monsters, class sprites, portraits, and map overlays.

## 1. Pipeline Stages
1. Seed stage
- Input: `{ id, category, tags, width, height, palette }`
- Uses stable hash RNG from `id` so reruns are reproducible.

2. Base silhouette stage
- Draw category-specific coarse shapes.
- Examples:
  - `tile`: terrain bands, shoreline edges, noise clusters
  - `monster`: body block, eyes, mouth, horn flags
  - `ui`: panel body + frame mask

3. Style pass stage
- Apply NES constraints:
  - 1-pixel grid
  - 3 colors + transparency per sprite
  - optional dither pattern every 3rd/4th pixel

4. Detail pass stage
- Add accents and semantic markers (class symbols, biome hints, rune marks).

5. Validation stage
- Enforce palette cap and alpha rules.
- Reject pixels outside allowed palette.

6. Packing stage
- Place generated sprites into atlas rows/columns.
- Emit atlas metadata JSON.

## 2. Category Contracts
- `font`: fixed 8x8 glyph cells, ASCII 32-127.
- `ui`: 9-slice-safe borders and corner markers.
- `icon`: 8x8 or 16x16, one focal silhouette.
- `tile`: 16x16 seamless edges where required.
- `monster`: 16x16 or 24x24 with idle frame baseline.
- `portrait`: larger static frame, face readable at 1x.

## 3. Deterministic Inputs
- Seed key format: `CATEGORY__NAME__VARIANT`.
- Optional tags drive branches, e.g.:
  - `biome:water`, `faction:elden`, `ruleset:dnd`, `class:paladin`.

## 4. Tooling Layout
- Runtime pipeline contracts: `src/gfx/PixelGenerator.ts`.
- Offline renderer script: `scripts/generate-nes-assets.mjs`.
- Outputs: `public/assets/*.png`, `public/assets/nes_assets_manifest.json`.

## 5. Extension Strategy
1. Add a new category rule module.
2. Register it in pipeline list.
3. Add snapshot tests against deterministic seeds.
4. Regenerate atlas + manifest.

## 6. Quality Gates
- Pixel-perfect nearest-neighbor preview in game.
- No anti-aliasing.
- Palette clamp check passes.
- Atlas metadata includes frame positions and semantic tags.
