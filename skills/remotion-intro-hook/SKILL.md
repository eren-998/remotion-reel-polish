---
name: remotion-intro-hook
description: Build high-retention, After Effects-style kinetic intro hooks for Remotion vertical videos (Reels, Shorts, TikTok). Trigger whenever the user wants to create, polish, design, or animate the first 3 to 15 seconds of a video, mentions "intro hook", "kinetic typography hook", "word by word intro text", "talking head hook", "stylish hook animation", "hook animation", or asks to make the beginning of a video punchy and engaging without box or card containers.
---

# Remotion Intro Hook

Engineering high-retention, After Effects-grade intro hooks (first 0–15 seconds) for Remotion vertical videos (1080x1920).

---

## 1. Core Philosophy & Rules

1. **Raw Video Is the Star (Zero Dark Box Containers)**:
   - NEVER place solid or semi-transparent background cards/boxes behind intro hook text.
   - Text and illustrations must float directly over the raw, full-screen talking head video.
   - Legibility is achieved via **multi-layered drop shadows** and **`-webkit-text-stroke`**, never containers.

2. **Multi-Font Expressive Pairing**:
   - Never use a single font for the entire hook.
   - **Display Header / Punchline**: Ultra-bold sans-serif (`Impact`, `Syne`, `Montserrat 900`, `Inter 900`).
   - **Expressive Accent Words**: Serif italics (`Playfair Display`, `Instrument Serif`, `Georgia italic`) or cursive handwriting.
   - **Technical Tags / Metadata**: Monospace (`JetBrains Mono`, `Fira Code`, `Courier New`).

3. **Multi-Phase Dramatic Pacing**:
   - Divide the first 6–12 seconds into 3 distinct visual phases.
   - Every phase must feel like a new visual hit — never keep static text on screen for more than 2.5 seconds.

4. **Continuous Kinetic Motion**:
   - Use Remotion `spring()` with low damping (`11–14`) and high stiffness (`120–160`) for snappy punch-in reveals.
   - Add continuous subtle physics: sine-wave micro-wobbles on doodles (`Math.sin(frame / 6) * 3deg`), pulse scale, or floating drift.

5. **Integrated Hand-Drawn SVG Doodles**:
   - Pair words with clean, stroke-based SVG vector doodles (question marks, padlocks, arrows, underlines, alert badges).
   - Zero generic AI sparkles or starry particles. Keep linework technical, raw, and hand-drawn (`strokeWidth: 4-6px`, round caps).

---

## 2. The 3-Phase Hook Formula

For a 0–10 second (0–300 frame @ 30fps) intro:

| Phase | Time | Focus | Visual Recipe |
|---|---|---|---|
| **Phase 1: Intrigue** | 0.0s – 2.5s (0–75f) | Setup the topic / question | Monospace pill badge ("✦ INTERVIEWER POOCHTA HAI ✦") + Massive subject clash ("HTTP vs HTTPS") |
| **Phase 2: Stakes / Comparison** | 2.5s – 5.0s (75–150f) | Conflict / Core question | Bold question ("KAUN ZYADA SECURE HAI?") + Two-sided animated comparison doodles (Red Unlocked Lock vs Green Shield) |
| **Phase 3: Punchline / Challenge** | 5.0s – 10.0s (150–300f) | Callout / Reality check | Kinetic word-by-word reveal ("TUM BOL TOH DETE HO... PAR JAB WO POOCHTA HAI 'AISA KYUN?' TAB KYA JAWAB DOGE?") + Massive wobbling question mark |

---

## 3. Typography & Contrast Recipes

### High-Contrast Text Floating Over Video
```tsx
const heavyTextShadow = `
  0 4px 24px rgba(0, 0, 0, 0.98),
  0 8px 40px rgba(0, 0, 0, 0.95),
  0 0 35px rgba(0, 0, 0, 0.9),
  0 2px 6px rgba(0, 0, 0, 0.9)
`;

const strokeStyle: React.CSSProperties = {
  WebkitTextStroke: "2px rgba(0, 0, 0, 0.95)",
  paintOrder: "stroke fill",
  textShadow: heavyTextShadow,
};
```

### Color Coding
- **Base Text**: Crisp White (`#FFFFFF`)
- **Primary Hook Accent**: Cyber Yellow/Amber (`#FACC15`)
- **Secondary Accent**: Electric Neon Green (`#22C55E`) or Cyan (`#06B6D4`)
- **Alert / Insecure**: Vivid Coral Red (`#EF4444`)

---

## 4. Animation Presets (Remotion Springs)

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

// Snappy pop-in for titles and words
const popSpring = spring({
  frame: currentFrame - delayFrames,
  fps,
  config: { damping: 12, stiffness: 140, mass: 0.8 },
});

// Scale from 0.4 -> 1.0 with slight overshoot
const scale = 0.4 + popSpring * 0.6;
const opacity = Math.min(1, popSpring * 2);
```

---

## 5. Production Reference Template (`StartHookScene.tsx`)

```tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const StartHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase visibility ranges
  const isPhase1 = frame >= 0 && frame < 80;
  const isPhase2 = frame >= 80 && frame < 160;
  const isPhase3 = frame >= 160 && frame < 280;

  if (frame >= 280) return null;

  const heavyShadow = `
    0 4px 24px rgba(0, 0, 0, 0.98),
    0 8px 40px rgba(0, 0, 0, 0.95),
    0 0 35px rgba(0, 0, 0, 0.9)
  `;

  // Continuous micro-wobble for doodles
  const wobble = Math.sin(frame / 5) * 4;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        pointerEvents: "none",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "220px",
      }}
    >
      {/* ============================================================== */}
      {/* PHASE 1: 0 - 80 frames (0.0s - 2.6s)                           */}
      {/* ============================================================== */}
      {isPhase1 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          {/* Monospace Topic Pill */}
          {(() => {
            const spr = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
            return (
              <div
                style={{
                  opacity: spr,
                  transform: `translateY(${(1 - spr) * -30}px)`,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "30px",
                  fontWeight: 800,
                  letterSpacing: "4px",
                  color: "#FACC15",
                  textShadow: heavyShadow,
                  textTransform: "uppercase",
                  marginBottom: "28px",
                }}
              >
                ✦ INTERVIEWER POOCHTA HAI ✦
              </div>
            );
          })()}

          {/* Clash Typography: HTTP vs HTTPS */}
          {(() => {
            const spr = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 130 } });
            const scale = 0.5 + spr * 0.5;
            return (
              <div
                style={{
                  opacity: Math.min(1, spr * 2),
                  transform: `scale(${scale})`,
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    fontSize: "115px",
                    fontWeight: 900,
                    color: "#EF4444",
                    textShadow: heavyShadow,
                    WebkitTextStroke: "2.5px rgba(0,0,0,0.9)",
                  }}
                >
                  HTTP
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "65px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    textShadow: heavyShadow,
                  }}
                >
                  vs
                </span>
                <span
                  style={{
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    fontSize: "125px",
                    fontWeight: 900,
                    color: "#22C55E",
                    textShadow: heavyShadow,
                    WebkitTextStroke: "2.5px rgba(0,0,0,0.9)",
                  }}
                >
                  HTTPS
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 2: 80 - 160 frames (2.6s - 5.3s)                         */}
      {/* ============================================================== */}
      {isPhase2 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          {(() => {
            const spr = spring({ frame: frame - 80, fps, config: { damping: 13, stiffness: 140 } });
            return (
              <div
                style={{
                  opacity: spr,
                  transform: `scale(${0.6 + spr * 0.4})`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    fontSize: "85px",
                    lineHeight: 1.1,
                    color: "#FFFFFF",
                    textShadow: heavyShadow,
                    WebkitTextStroke: "2px rgba(0,0,0,0.95)",
                    textTransform: "uppercase",
                  }}
                >
                  KAUN ZYADA
                </div>
                <div
                  style={{
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    fontSize: "115px",
                    color: "#FACC15",
                    textShadow: heavyShadow,
                    WebkitTextStroke: "2px rgba(0,0,0,0.95)",
                    letterSpacing: "2px",
                  }}
                >
                  SECURE HAI?
                </div>
              </div>
            );
          })()}

          {/* Comparison Doodles: Red Padlock vs Green Shield */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "90px",
              marginTop: "40px",
            }}
          >
            {/* HTTP Red Open Padlock */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              style={{
                filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.9))",
                transform: `rotate(${-wobble}deg)`,
              }}
            >
              <path
                d="M35 45 V 30 C 35 20, 65 20, 65 30"
                fill="none"
                stroke="#EF4444"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <rect x="25" y="45" width="50" height="42" rx="8" fill="#EF4444" />
              <circle cx="50" cy="62" r="5" fill="#000" />
            </svg>

            {/* HTTPS Green Secure Shield */}
            <svg
              width="130"
              height="130"
              viewBox="0 0 100 100"
              style={{
                filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.9))",
                transform: `rotate(${wobble}deg)`,
              }}
            >
              <path
                d="M50 15 L80 28 V52 C80 72 50 88 50 88 C50 88 20 72 20 52 V28 Z"
                fill="#22C55E"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M36 50 L46 60 L65 38"
                fill="none"
                stroke="#000000"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 3: 160 - 280 frames (5.3s - 9.3s)                        */}
      {/* ============================================================== */}
      {isPhase3 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "1000px",
            textAlign: "center",
          }}
        >
          {/* Word 1: Tum Bol Toh Dete Ho */}
          {(() => {
            const spr = spring({ frame: frame - 160, fps, config: { damping: 14, stiffness: 150 } });
            return (
              <div
                style={{
                  opacity: spr,
                  transform: `translateY(${(1 - spr) * 20}px)`,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "44px",
                  fontWeight: 800,
                  color: "#E2E8F0",
                  textShadow: heavyShadow,
                  marginBottom: "12px",
                }}
              >
                TUM BOL TOH DETE HO...
              </div>
            );
          })()}

          {/* Word 2: Par Jab Wo Poochta Hai */}
          {(() => {
            const spr = spring({ frame: frame - 185, fps, config: { damping: 13, stiffness: 140 } });
            return (
              <div
                style={{
                  opacity: Math.max(0, spr),
                  transform: `scale(${0.7 + spr * 0.3})`,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "52px",
                  fontWeight: 700,
                  color: "#FACC15",
                  textShadow: heavyShadow,
                  marginBottom: "16px",
                }}
              >
                "Par Jab Wo Poochta Hai..."
              </div>
            );
          })()}

          {/* Punchline: AISA KYUN? */}
          {(() => {
            const spr = spring({ frame: frame - 210, fps, config: { damping: 11, stiffness: 130 } });
            return (
              <div
                style={{
                  opacity: Math.max(0, spr),
                  transform: `scale(${0.5 + spr * 0.5}) rotate(${(1 - spr) * -6}deg)`,
                  fontFamily: "'Impact', 'Arial Black', sans-serif",
                  fontSize: "120px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  textShadow: heavyShadow,
                  WebkitTextStroke: "3px rgba(0,0,0,0.95)",
                  letterSpacing: "3px",
                  marginTop: "10px",
                }}
              >
                AISA KYUN?
              </div>
            );
          })()}

          {/* Animated Big Hand-Drawn Question Mark Doodle */}
          {frame >= 225 && (
            <svg
              width="140"
              height="160"
              viewBox="0 0 100 120"
              style={{
                marginTop: "20px",
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.9))",
                transform: `rotate(${wobble * 1.5}deg) scale(${1 + Math.sin(frame / 6) * 0.06})`,
              }}
            >
              <path
                d="M32 35 C 32 12, 68 12, 68 34 C 68 50, 50 56, 50 74"
                fill="none"
                stroke="#FACC15"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="50" cy="94" r="6" fill="#FACC15" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## 6. Pre-Flight Verification Checklist

Before considering an intro hook complete:
- [ ] **No Card Backgrounds**: Verify text is directly over the video with zero container boxes.
- [ ] **Contrast Check**: Verify text has `heavyTextShadow` + `WebkitTextStroke` and is 100% legible against both light and dark video backgrounds.
- [ ] **Font Pairing**: Ensure at least two distinct font styles are used (e.g. Display Sans + Serif Italic or Monospace).
- [ ] **Framing Safety**: Ensure hook typography is positioned between `top: 200px` and `top: 600px` so it does not block the speaker's eyes/mouth.
- [ ] **Pacing**: Confirm visual hits happen every 1.5–2.5 seconds with zero dead frames.
