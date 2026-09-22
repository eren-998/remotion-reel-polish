# Remotion Reel Polish (`remotion-reel-polish`)

[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-Remotion%20Reel%20Polish-blueviolet?style=flat-square)](https://github.com/eren-998/remotion-reel-polish)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A collection of AI agent skills for producing high-retention vertical videos using [Remotion](https://www.remotion.dev). Includes two skills:

1. **Remotion Reel Polish** — End-to-end reel polishing with Groq Whisper transcription, synced Hinglish captions, footer vignette, and liquid-glass follow cards.
2. **Remotion Intro Hook** — After Effects-style kinetic intro hooks (first 0–15 seconds) with multi-font clash typography, hand-drawn SVG doodles, and 3-phase dramatic pacing.

---

## ⚡ One-Click Installation

Install both skills into your AI agents (Antigravity, Claude Code, Cursor, Cline, OpenCode, Codex, Warp, etc.):

### 1. Universal Agent Skill Installer (Recommended)
```bash
npx skills add eren-998/remotion-reel-polish
```
*This automatically detects and installs into all supported agent environments (Antigravity, Claude Code, Cursor, Cline, Amp, etc.).*

---

### 2. Manual / Per-Agent Quick Install

#### For Antigravity & Global Agent Skills (`~/.agents/skills`):
```bash
# macOS / Linux / Git Bash
git clone https://github.com/eren-998/remotion-reel-polish.git ~/.agents/skills/remotion-reel-polish

# Windows (PowerShell)
git clone https://github.com/eren-998/remotion-reel-polish.git "$HOME\.agents\skills\remotion-reel-polish"
```

#### For Project-Level Installation (`.agents/skills`):
```bash
git clone https://github.com/eren-998/remotion-reel-polish.git .agents/skills/remotion-reel-polish
```

#### For Claude Code (`~/.claude/skills`):
```bash
git clone https://github.com/eren-998/remotion-reel-polish.git ~/.claude/skills/remotion-reel-polish
```

---

## 📦 Skills Included

### 1. Remotion Reel Polish (`SKILL.md`)

Transforms raw vertical videos into polished **Instagram Reels** and **YouTube Shorts** with:

- **Groq Whisper Transcription** — Word-level timestamps via Groq's ultra-fast Whisper Large v3 API
- **Synced Hinglish Captions** — Zero Devanagari, natural Roman Hinglish grouped into 3–7 word readable chunks
- **Glass Pill Caption Component** — Dark glassmorphic container with backdrop blur and Inter Bold typography
- **Black Footer Vignette** — 4-stop bottom fade for caption and UI contrast
- **Liquid Glass Follow Card** — Spring-animated Instagram profile card triggered on "follow" / "subscribe"
- **Optional Motion Overlays** — Dynamic keyword comment CTAs and DM notifications (on request only)

**Trigger:** `/remotion-reel-polish` or ask *"Polish this reel with Hinglish captions and follow card"*

### 2. Remotion Intro Hook (`skills/remotion-intro-hook/SKILL.md`)

Builds high-retention, After Effects-grade kinetic intro hooks for the first 0–15 seconds:

- **Zero Dark Box Containers** — Text floats directly over raw video with multi-layer drop shadows + `-webkit-text-stroke`
- **Multi-Font Expressive Pairing** — Impact/Syne for punchlines, Playfair Display for accents, JetBrains Mono for metadata
- **3-Phase Dramatic Pacing** — Intrigue → Stakes → Punchline, each phase a distinct visual hit
- **Continuous Kinetic Motion** — Remotion `spring()` with low damping, sine-wave micro-wobbles, pulse scale
- **Hand-Drawn SVG Doodles** — Stroke-based vector illustrations (locks, shields, arrows, question marks) — no generic AI sparkles

**Trigger:** `/remotion-intro-hook` or ask *"Create a punchy intro hook for my video"*

---

## 🔑 Environment Setup

This skill uses Groq's ultra-fast Whisper Large v3 API for word-level timestamps.

1. Get an API key from [Groq Console](https://console.groq.com/keys).
2. Set it in your environment or in `.env`:
```bash
export GROQ_API_KEY="gsk_your_groq_api_key_here"
```
Or create a `.env` file in the skill directory:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

---

## 🎬 How It Works

```
Input Video (.mp4)
    │
    ├─ Phase 1: Audio Extraction (ffmpeg)
    ├─ Phase 2: Word-Level Transcription (Groq Whisper API)
    ├─ Phase 3: Clean Hinglish Caption Formatting (Roman Script)
    ├─ Phase 4: Remotion Composition Setup (1080x1920 @ 30fps)
    └─ Phase 5: Component Layering & Final Render
```

---

## 📁 Repository Structure

```
remotion-reel-polish/
├── SKILL.md                              # Reel polish skill instructions
├── skills/
│   └── remotion-intro-hook/
│       └── SKILL.md                      # Intro hook skill instructions
├── .env.example                          # Template for API keys
├── scripts/
│   └── render_cloud.py                   # Automated GitHub Actions cloud render & download script
├── references/
│   ├── Composition-template.tsx          # Main Remotion composition layout
│   ├── MinimalCaptions.tsx               # Glass pill subtitle component
│   ├── BlackFooterFade.tsx               # Bottom dark gradient vignette
│   ├── FollowCard.tsx                    # Liquid-glass follow button & badge
│   ├── MinimalCommentCTA.tsx             # Keyword typewriter CTA overlay
│   └── DMNotification.tsx                # Direct message pop-in card
└── examples/
    └── captions-hinglish-example.json    # Sample parsed Hinglish captions
```

---

## 🤖 How Your AI Agent Uses These Skills

Once installed, simply ask your agent:
> *"Polish this reel: `video.mp4` with Hinglish captions, footer fade, and follow card."*

Or for intro hooks:
> *"Create a kinetic intro hook for the first 10 seconds of my video."*

Or trigger directly with:
> `/remotion-reel-polish` or `/remotion-intro-hook`

---

## 📄 License
[MIT](LICENSE) © [Kaif Qureshi (eren-998)](https://github.com/eren-998)
