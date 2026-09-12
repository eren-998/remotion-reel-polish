---
name: remotion-reel-polish
description: End-to-end Remotion reel polishing pipeline for Instagram/YouTube Shorts. Extracts audio, transcribes via Groq Whisper, converts Hindi to clean Hinglish captions (Roman script, zero Devanagari), overlays minimal glass-pill captions with word-level active highlighting, professional black footer vignette, top-right verified follow card, and optional vector motion graphics. Includes a mandatory visual verification gate before triggering automated GitHub Actions cloud rendering and auto-downloading 1080x1920 MP4 to phone storage. Use whenever user wants to polish a reel, add synchronized Hinglish captions, follow cards, motion graphics, or execute cloud rendering.
---

# Remotion Reel Polish

End-to-end AI agent pipeline to turn a raw vertical video into a polished Instagram Reel with synchronized Hinglish captions, custom vector motion graphics, liquid glass branding, preview verification, and automated GitHub Actions cloud rendering.

## Core Philosophy

- **Clean video first.** The raw video is the star — overlays exist only to support it, never to distract.
- **Captions are king.** Word-level synchronized timing in clean Roman Hinglish (zero Devanagari) with active yellow `#FFE500` highlighting.
- **No generic emojis.** All motion graphics use handcrafted, prominent SVG vector cards with spring physics.
- **Mandatory verification before render.** Always render 3 preview frames or serve local preview for the user to approve before initiating cloud rendering.
- **Cloud render for speed and zero device strain.** Heavy 1080x1920 30fps rendering runs on GitHub Actions runners, then auto-downloads directly to phone storage.

---

## Pipeline Overview

```text
Raw Input Video (.mp4)
    │
    ├─ Phase 1: Audio Extraction (ffmpeg)
    ├─ Phase 2: Transcription (Groq Whisper Large v3 API) -> Word-level timestamps
    ├─ Phase 3: Hinglish Caption Generation (Clean Roman script, 3-7 word phrases)
    ├─ Phase 4: Remotion Composition Setup (React: Video, Captions, Follow Card, Hero Cards)
    ├─ Phase 5: Component Design System (Glassmorphism, SVG Icons, Spring Physics)
    ├─ Phase 6: Verification Gate (Extract 3 still frames -> User Approval)
    └─ Phase 7: Cloud Render & Retrieval (scripts/render_cloud.py -> /sdcard/Download/)
```

---

## Phase 1: Audio Extraction

Extract audio from the input video using ffmpeg:

```bash
ffmpeg -y -i "<input_video>" -vn -acodec libmp3lame -q:a 2 "<output_audio>.mp3"
```

If the audio file is larger than ~25MB (Groq API limit), split into chunks:
```bash
ffmpeg -y -ss 0 -to 18 -i "<input>" -vn -acodec libmp3lame -q:a 2 "part1.mp3"
ffmpeg -y -ss 16 -to 36 -i "<input>" -vn -acodec libmp3lame -q:a 2 "part2.mp3"
```
Use a 2-second overlap between chunks to avoid missing words at boundaries.

Get video metadata for composition setup:
```bash
ffprobe -v quiet -show_entries format=duration -show_entries stream=width,height,r_frame_rate -of csv=p=0 "<input_video>"
```

---

## Phase 2: Groq Transcription

Use the Groq Whisper Large v3 API for word-level transcription:

```bash
curl -s https://api.groq.com/openai/v1/audio/transcriptions \
  -H "Authorization: Bearer <GROQ_API_KEY>" \
  -F "file=@<audio_file>" \
  -F "model=whisper-large-v3" \
  -F "response_format=verbose_json" \
  -F "timestamp_granularities[]=word" \
  -F "timestamp_granularities[]=segment" \
  -F "temperature=0" \
  -o "<output_transcript>.json"
```

**Important notes:**
- Use `temperature=0` for maximum accuracy.
- If audio was chunked, add the split offset to subsequent chunks (e.g. if part 2 starts at 16s, add 16000ms to word timestamps).
- The response contains `words[]` with `{word, start, end}` for every word — these are your timing anchors.

---

## Phase 3: Hinglish Caption Generation

Captions define the viewer retention. Follow these strict rules:

### The Hinglish Rule
**ZERO Devanagari script. Everything in clean conversational Roman English script.**
- भाई → Bhai
- वीडियो → video
- कमेंट → comment
- सेटिंग → setting
- फॉलो → follow
- सब्सक्राइब → subscribe

### Caption Formatting & Highlighting
1. Group words into natural phrases of **3–6 words** that form a readable thought.
2. Store word-level timestamps so active words pop with electric yellow (`#FFE500`).
3. Save to `public/captions.json`:

```json
[
  {
    "text": "Bhai aaj ki ye video mein",
    "startMs": 0,
    "endMs": 1120,
    "words": [
      { "text": "Bhai", "startMs": 0, "endMs": 280 },
      { "text": "aaj", "startMs": 280, "endMs": 520 },
      { "text": "ki", "startMs": 520, "endMs": 680 },
      { "text": "ye", "startMs": 680, "endMs": 840 },
      { "text": "video", "startMs": 840, "endMs": 1020 },
      { "text": "mein", "startMs": 1020, "endMs": 1120 }
    ]
  }
]
```

---

## Phase 4: Remotion Composition Setup

### Project Structure

```text
talking-head-remotion/
├── .github/
│   └── workflows/
│       └── render.yml               # GitHub Actions cloud rendering pipeline
├── src/
│   ├── Composition.tsx              # Main composition layout
│   ├── Root.tsx                     # Remotion Root registration
│   └── components/
│       ├── MinimalCaptions.tsx      # Glass pill captions with active yellow highlight
│       ├── BlackFooterFade.tsx      # Bottom vignette
│       ├── FollowCard.tsx           # Liquid glass follow card (top-right)
│       └── MotionGraphics.tsx       # Custom SVG vector hero cards
├── public/
│   ├── video_input.mp4              # Source video (H.264, 1080x1920)
│   ├── avatar.jpg                   # Profile picture
│   └── captions.json                # Word-level Hinglish captions
└── package.json
```

### Layer Stacking Order (Bottom to Top)
1. `<OffthreadVideo src={staticFile("video_input.mp4")}>` (1080x1920 full frame)
2. `<BlackFooterFade height={450} />`
3. `<MinimalCaptions captions={captionsData} />` (centered, active word pop)
4. Vector Hero Cards (`HeroContentCreatorCard`, `HeroSkillsListCard`, etc.) timed to specific dialogue moments
5. `<FollowCard>` positioned at **top-right** (`top: 90px, right: 40px`) triggered when the speaker says "follow" or "subscribe"

---

## Phase 5: Component Design System

Every component follows the same visual language: dark glass morphism, Inter font, subtle spring animations.

### 1. MinimalCaptions (ALWAYS PRESENT)
Read `references/MinimalCaptions.tsx` for the exact implementation.
- Position: `bottom: 220px`, centered horizontally
- Background: `rgba(0, 0, 0, 0.55)` with `backdrop-filter: blur(16px)`
- Border: `1px solid rgba(255, 255, 255, 0.12)`
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.4)`
- Border radius: `28px`
- Font: Inter, 36px, weight 800, line-height 1.4, color #FFFFFF
- Active Word Highlight: `#FFE500` (bright yellow pop)
- Entrance: Spring animation (damping 18, stiffness 120)

### 2. BlackFooterFade (ALWAYS PRESENT)
Read `references/BlackFooterFade.tsx` for the exact implementation.
- Height: 450px (configurable via prop)
- Position: absolute bottom 0, full width
- Gradient: 4-stop linear from transparent to black
  - `rgba(0,0,0,0)` at 0%
  - `rgba(0,0,0,0.4)` at 30%
  - `rgba(0,0,0,0.75)` at 65%
  - `rgba(0,0,0,0.95)` at 100%
- z-index: 30

### 3. FollowCard (ALWAYS PRESENT — Position Configurable)
Read `references/FollowCard.tsx` for the exact implementation.
- Default position: top-right (`top: 90px, right: 40px`)
- Container: dark glass (`rgba(10, 15, 26, 0.85)`, blur 24px, border-radius 50px)
- Avatar: 54px circle with Instagram gradient ring
- Verified badge: Blue circle (#0095F6) with white checkmark SVG
- Handle color: #0095F6, 14px, weight 600
- Follow button: Blue gradient (`#0095F6` → `#0077E6`), border-radius 24px
- Trigger timing: Set `startFrame` to match when creator says "follow" / "subscribe"

### 4. Vector Hero Motion Graphics (Zero Emojis)
- Handcrafted SVG vector cards (width 860–920px) positioned in mid/upper area.
- Spring entrances with subtle glow outlines and category pills.

---

## Phase 6: Verification Gate (Mandatory)

**NEVER trigger cloud rendering without user approval.**

Before rendering:
1. Ensure the Remotion Studio preview server is running on port 3000 (`http://localhost:3000`). If not already active:
   ```bash
   npx remotion preview src/index.ts --port=3000
   ```
2. The user reviews and scrubs through the composition directly on the Remotion Studio Dashboard (`http://localhost:3000`).
3. (Optional) Extract 3 still frames via Remotion CLI for rapid visual reference:
   - **Frame 1 (Intro Hook)**: Frame 30–60 (Speaker introduction & first caption)
   - **Frame 2 (Motion Graphic / Mid-Reel)**: Frame ~700 (Hero card and caption highlight)
   - **Frame 3 (Outro / Follow Card)**: Frame ~1350 (Follow card on top-right & closing CTA)
4. Ask the user for confirmation:
   > *"Remotion Studio preview is active at http://localhost:3000. Please verify the composition on the dashboard. Would you like me to trigger the cloud render now?"*
5. **Proceed to Phase 7 ONLY after receiving user approval.**

---

## Phase 7: Automated Cloud Render via GitHub Actions

To render the 1080x1920 composition at full quality without heating mobile hardware or draining battery, render on GitHub's free 4-core cloud runner.

### Cloud Architecture
- **Skill Repository**: `eren-998/remotion-reel-polish` (Lightweight instructions and utilities)
- **Cloud Render Repository**: `eren-998/code-baithak-reel-render` (Contains video assets, Remotion project, and GitHub Actions runner)
- **Runner**: Ubuntu latest, 4-core concurrency with Chromium `--gl=angle`

### Running the Automation Script

Run the automated helper script:

```bash
python3 /root/.agents/skills/remotion-reel-polish/scripts/render_cloud.py [output_name.mp4]
```

Or from `/root/`:
```bash
python3 /root/render_cloud.py "video_code_baithak_polished.mp4"
```

### What `render_cloud.py` Does Automatically:
1. **Pushes Code**: Stages latest `Composition.tsx`, `captions.json`, and `video_input.mp4`, and pushes to `origin main` on GitHub.
2. **Tracks Actions Run**: Discovers the active GitHub Actions run via GitHub REST API.
3. **Polls Progress**: Prints live runner status every 12 seconds until completion (`conclusion: success`).
4. **Retrieves Artifact**: Downloads the 50MB rendered `.mp4` archive handling secure cross-domain redirects.
5. **Transfers to Phone**: Unzips and places the finished video directly into:
   - `/sdcard/Download/<output_name>.mp4`
   - `/sdcard/Movies/Edits/<output_name>.mp4`

---

## Timing Calculation Quick Reference

```text
seconds_to_frame = seconds × fps
milliseconds_to_frame = (ms / 1000) × fps

Example at 30fps:
- 26.5 seconds = frame 795
- 33.8 seconds = frame 1014
```

---

## Checklist Before Triggering Cloud Render

- [ ] Audio extracted and transcribed via Groq Whisper with word-level timestamps
- [ ] Captions converted to clean Hinglish (zero Devanagari) in `captions.json`
- [ ] Active yellow `#FFE500` word highlight verified
- [ ] Vector motion cards designed (zero emojis, clean SVG graphics)
- [ ] Follow card placed on **top-right** (`top: 90px, right: 40px`)
- [ ] 3 Still preview frames inspected
- [ ] **User explicitly approved the preview frames**
- [ ] Run `python3 /root/render_cloud.py <output_name>.mp4`
- [ ] Final video confirmed in `/sdcard/Download/`
