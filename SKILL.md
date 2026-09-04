---
name: remotion-reel-polish
description: End-to-end Remotion reel polishing pipeline for Instagram/YouTube Shorts. Extracts audio, transcribes via Groq Whisper, converts Hindi to clean Hinglish captions (Roman script, zero Devanagari), and overlays minimal glass-pill captions with perfect voiceover sync, professional black footer vignette, liquid-glass follow card, and optional motion graphics (Comment CTA, DM notification) — ONLY when explicitly requested. Use this skill whenever the user wants to polish a video reel, add captions to a short-form video, add follow cards, add bottom vignette/fade, transcribe Hindi/Hinglish audio, or overlay minimal motion graphics on Instagram reels. Also trigger when user says "polish this reel", "add captions", "follow card lagao", "footer fade", "video polish karo", "hinglish captions", or provides a video file path and asks for reel enhancements.
---

# Remotion Reel Polish

End-to-end pipeline to turn a raw vertical video into a polished Instagram Reel with perfectly synced Hinglish captions, professional vignette, and optional motion overlays.

## Core Philosophy

- **Clean video first.** The raw video is the star — overlays exist only to support it, never to distract.
- **Captions are king.** They must be perfectly timed to the voiceover, never early, never late, and always in clean Hinglish Roman script.
- **Motion graphics only on request.** Never add Comment CTA, DM notification, or any extra animation unless the user explicitly asks. The default reel has ONLY: video + footer vignette + captions + follow card.

---

## Pipeline Overview

```
Input Video (.mp4)
    │
    ├─ Phase 1: Audio Extraction (ffmpeg)
    ├─ Phase 2: Transcription (Groq Whisper API)
    ├─ Phase 3: Hinglish Caption Generation
    ├─ Phase 4: Remotion Composition Setup
    └─ Phase 5: Component Layering & Render
```

---

## Phase 1: Audio Extraction

Extract audio from the input video using ffmpeg:

```bash
ffmpeg -y -i "<input_video>" -vn -acodec libmp3lame -q:a 2 "<output_audio>.mp3"
```

If the audio file is larger than ~25MB (Groq limit), split into chunks:
```bash
ffmpeg -y -ss 0 -to 18 -i "<input>" -vn -acodec libmp3lame -q:a 2 "part1.mp3"
ffmpeg -y -ss 16 -to 36 -i "<input>" -vn -acodec libmp3lame -q:a 2 "part2.mp3"
```
Use 2-second overlap between chunks to avoid missing words at boundaries.

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
- Use `temperature=0` for maximum accuracy
- If you split audio, remember to add the split offset to part 2 timestamps (e.g., if part 2 starts at 16s, add 16000ms to all its word timestamps)
- If Groq returns `Internal Server Error`, copy the audio to a simpler file path (no spaces/parentheses) and retry
- The response contains `words[]` array with `{word, start, end}` for each word — these are your timing anchors

---

## Phase 3: Hinglish Caption Generation

This is the most critical phase. The captions define the viewer experience.

### The Hinglish Rule

**ZERO Hindi script (Devanagari). Everything in Roman English letters.**

Convert every Hindi word to its natural Hinglish Roman equivalent:
- भाई → Bhai
- वीडियो → video
- कमेंट → comment
- सेटिंग → setting
- लाइक → like
- चैनल → channel
- फॉलो → follow

Keep English words as-is: relationship, long lasting, setting, like, follow, etc.

### Caption Grouping Rules

Group words into phrases of **3-7 words** that feel natural when read. Each phrase should be:
- A complete thought fragment (not cutting mid-idea)
- Short enough to fit in one line inside the glass pill
- Timed exactly to when those words are spoken

### Caption JSON Format

```json
[
  {
    "text": "Bhai aaj ki ye video mein",
    "startMs": 0,
    "endMs": 1120
  },
  {
    "text": "un harami doston ke liye",
    "startMs": 1120,
    "endMs": 2560
  }
]
```

**Timing precision:**
- `startMs` = timestamp of first word in the phrase (from Groq `words[].start * 1000`)
- `endMs` = timestamp of last word in the phrase (from Groq `words[].end * 1000`)
- If there's a natural pause/gap in speech (>1s silence), don't bridge it — let the caption disappear and reappear

Save as `public/captions.json` (or `public/captions_v2.json` for additional videos).

---

## Phase 4: Remotion Composition Setup

### Project Structure

The Remotion project should have these files:

```
src/
├── Composition.tsx          # Main composition with all layers
├── Root.tsx                 # Remotion root (registers compositions)
└── components/
    ├── MinimalCaptions.tsx   # Glass pill captions
    ├── BlackFooterFade.tsx   # Bottom vignette
    ├── FollowCard.tsx        # Liquid glass follow card
    ├── MinimalCommentCTA.tsx  # (Optional) Comment keyword CTA
    └── DMNotification.tsx    # (Optional) DM notification
public/
├── captions.json            # Generated Hinglish captions
├── avatar.jpg               # Creator's profile picture
└── <video>.mp4              # Source video (copy here)
```

### Video Setup

1. Copy the source video into `public/` folder
2. Calculate frame count: `Math.ceil(duration * fps)`
3. Standard specs: `width: 1080, height: 1920, fps: 30`

### Composition Template

Read `references/Composition-template.tsx` for the exact boilerplate. The composition layers in order (bottom to top):
1. `<OffthreadVideo>` — full-frame source video
2. `<BlackFooterFade>` — always present
3. `<MinimalCaptions>` — always present
4. Motion graphics — ONLY if user requested (Comment CTA, DM notification, etc.)
5. `<FollowCard>` — appears at the "follow/subscribe" moment in the voiceover

**Composition ID rules:** Only `a-z`, `A-Z`, `0-9`, and `-` allowed. No underscores.

---

## Phase 5: Component Design System

Every component follows the same visual language: dark glass morphism, Inter font, subtle spring animations.

### 1. MinimalCaptions (ALWAYS PRESENT)

Read `references/MinimalCaptions.tsx` for the exact implementation.

**Design specs:**
- Position: `bottom: 220px`, centered horizontally
- Background: `rgba(0, 0, 0, 0.55)` with `backdrop-filter: blur(16px)`
- Border: `1px solid rgba(255, 255, 255, 0.12)`
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.4)`
- Border radius: `28px`
- Padding: `14px 32px`
- Max width: `920px`
- Font: Inter, 36px, weight 700, line-height 1.4, letter-spacing -0.01em, color #FFFFFF
- Text shadow: `0 2px 8px rgba(0, 0, 0, 0.6)`
- Entrance: Spring animation (damping 18, stiffness 120), 12px translateY fade-in
- The component accepts an optional `captions` prop for per-video caption data

### 2. BlackFooterFade (ALWAYS PRESENT)

Read `references/BlackFooterFade.tsx` for the exact implementation.

**Design specs:**
- Height: 450px (configurable via prop)
- Position: absolute bottom 0, full width
- Gradient: 4-stop linear from transparent to black
  - `rgba(0,0,0,0)` at 0%
  - `rgba(0,0,0,0.4)` at 30%
  - `rgba(0,0,0,0.75)` at 65%
  - `rgba(0,0,0,0.95)` at 100%
- z-index: 30

### 3. FollowCard (ALWAYS PRESENT — position configurable)

Read `references/FollowCard.tsx` for the exact implementation.

**Design specs:**
- Default position: top-left (`top: 90px, left: 40px`). User can request top-right, bottom-left, etc.
- Container: dark glass (`rgba(10, 15, 26, 0.85)`, blur 24px, border-radius 50px)
- Avatar: 54px circle with Instagram gradient ring (`linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)`)
- Verified badge: Blue circle (#0095F6) with white checkmark SVG
- Handle color: #0095F6, 14px, weight 600
- Follow button: Blue gradient (`#0095F6` → `#0077E6`), border-radius 24px, shadow `0 4px 16px rgba(0, 149, 246, 0.35)`
- Entrance: Spring slide-in (damping 14, stiffness 80), translateX 300→0
- Button pulse: Secondary spring animation (damping 10, stiffness 150) 20 frames after entrance
- Trigger timing: Set `startFrame` to match when the creator says "follow karo" / "channel ko follow" / "aesi videos ke liye" in the voiceover

### 4. MinimalCommentCTA (OPTIONAL — only when user explicitly asks)

Read `references/MinimalCommentCTA.tsx` for the exact implementation.

**When to use:** Only when the user says something like "comment CTA lagao" or "jab wo bole comment karo tab CTA aaye".

**Design specs:**
- Position: `bottom: 340px`, centered
- Same glass pill style as captions but slightly different
- Contains an animated keyword (typewriter effect) that highlights what to comment
- Enter: spring translateY 20→0
- Exit: fade out after ~90 frames
- Keyword typewriter: 80ms per character delay

### 5. DMNotification (OPTIONAL — only when user explicitly asks)

Read `references/DMNotification.tsx` for the exact implementation.

**When to use:** Only when user asks for a DM-related motion graphic, e.g., "jab DM ki baat kare tab notification aaye".

**Design specs:**
- Position: top center, slides down from above
- Dark glass notification card with avatar, handle, "· now" timestamp
- Message text with typewriter reveal effect
- Blue "new message" pulsing dot
- Auto-exit: slides back up after ~80 frames

---

## Timing Calculation Quick Reference

```
seconds_to_frame = seconds × fps
milliseconds_to_frame = (ms / 1000) × fps

Example at 30fps:
- 26.5 seconds = frame 795
- 33.8 seconds = frame 1014
```

To find when someone says a specific phrase:
1. Search the Groq transcript `words[]` for the first word of that phrase
2. Use its `start` timestamp
3. Convert: `startFrame = Math.floor(start_seconds × fps)`

---

## Checklist Before Render

- [ ] Source video copied to `public/`
- [ ] `avatar.jpg` present in `public/`
- [ ] `captions.json` has clean Hinglish, zero Hindi script
- [ ] Caption timing matches voiceover (verify 2-3 captions manually against transcript)
- [ ] No caption gaps during speech (every spoken phrase has a caption)
- [ ] No captions during silence (if speaker pauses, captions should disappear)
- [ ] Composition ID uses only `a-z A-Z 0-9 -` (no underscores)
- [ ] `durationInFrames` matches `Math.ceil(video_duration × fps)`
- [ ] FollowCard `startFrame` matches the "follow/subscribe" voiceover moment
- [ ] Motion graphics (Comment CTA, DM) added ONLY if user requested
- [ ] `tsconfig.json` has `resolveJsonModule: true` and `allowSyntheticDefaultImports: true`

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Groq `Internal Server Error` | Copy audio to path without spaces/parentheses, retry |
| Groq file type error | Ensure file is `.mp3` extracted via ffmpeg, not renamed |
| Composition ID error | Use hyphens, not underscores: `Reel-Name-001` |
| Captions not showing | Check `resolveJsonModule: true` in tsconfig |
| Captions out of sync | Re-verify `startMs`/`endMs` against Groq word timestamps |
| FollowCard wrong side | Adjust `top/bottom/left/right` in component props |
| Video black screen | Ensure video is in `public/`, use `staticFile("filename.mp4")` |
