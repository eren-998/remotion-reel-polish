# Remotion Reel Polish (`remotion-reel-polish`)

[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-Remotion%20Reel%20Polish-blueviolet?style=flat-square)](https://github.com/eren-998/remotion-reel-polish)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

An end-to-end AI agent skill that transforms raw vertical videos into high-retention, polished **Instagram Reels** and **YouTube Shorts** using [Remotion](https://www.remotion.dev), [Groq Whisper](https://groq.com), and perfectly synchronized **Hinglish** (Roman script) captions.

---

## ⚡ One-Click Installation

You can install this skill into your AI agents (Antigravity, Claude Code, Cursor, Cline, OpenCode, Codex, Warp, etc.) using any of the commands below:

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

### Core Features:
- **Clean Video First**: Full vertical frame preservation (`1080x1920`). Overlays never clutter the speaker.
- **Synced Hinglish Captions**: Zero Devanagari script. Natural conversational Roman Hinglish (`Bhai`, `video`, `subscribe`, `settings`) grouped into 3–7 word readable chunks.
- **Glass Pill Caption Component**: Dark glassmorphic container with backdrop blur, Inter Bold typography, and subtle spring entrance.
- **Black Footer Vignette**: 4-stop bottom fade guaranteeing caption and UI contrast without darkening the whole video.
- **Liquid Glass Follow Card**: Spring-animated Instagram profile card triggered at the exact moment the speaker says "follow" / "subscribe".
- **Optional Motion Overlays**: Dynamic keyword comment CTAs and DM notifications added only on explicit request.

---

## 📁 Repository Structure

```
remotion-reel-polish/
├── SKILL.md                          # Full agent execution skill instructions
├── .env.example                      # Template for API keys
├── references/
│   ├── Composition-template.tsx      # Main Remotion composition layout
│   ├── MinimalCaptions.tsx           # Glass pill subtitle component
│   ├── BlackFooterFade.tsx           # Bottom dark gradient vignette
│   ├── FollowCard.tsx                # Liquid-glass follow button & badge
│   ├── MinimalCommentCTA.tsx         # Keyword typewriter CTA overlay
│   └── DMNotification.tsx            # Direct message pop-in card
└── examples/
    └── captions-hinglish-example.json# Sample parsed Hinglish captions
```

---

## 🤖 How Your AI Agent Uses This Skill

Once installed, simply ask your agent:
> *"Polish this reel: `video.mp4` with Hinglish captions, footer fade, and follow card."*

Or trigger it directly with:
> `/remotion-reel-polish`

---

## 📄 License
[MIT](LICENSE) © [Kaif Qureshi (eren-998)](https://github.com/eren-998)
