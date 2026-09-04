import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import captionsData from "../../public/captions.json";

export interface CaptionItem {
  text: string;
  startMs: number;
  endMs: number;
}

interface MinimalCaptionsProps {
  captions?: CaptionItem[];
}

export const MinimalCaptions: React.FC<MinimalCaptionsProps> = ({
  captions = captionsData as CaptionItem[],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const activeCaption = useMemo(() => {
    return captions.find(
      (item) => currentTimeMs >= item.startMs && currentTimeMs <= item.endMs
    );
  }, [captions, currentTimeMs]);

  const activeCaptionIndex = useMemo(() => {
    return (captionsData as Array<{ text: string; startMs: number; endMs: number }>).findIndex(
      (item) => currentTimeMs >= item.startMs && currentTimeMs <= item.endMs
    );
  }, [currentTimeMs]);

  if (!activeCaption) return null;

  // Calculate local frame within this caption for entrance animation
  const captionStartFrame = Math.floor((activeCaption.startMs / 1000) * fps);
  const localFrame = frame - captionStartFrame;

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [12, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 220,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 50px",
        zIndex: 40,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "14px 32px",
          borderRadius: 28,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          maxWidth: 920,
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {activeCaption.text}
        </span>
      </div>
    </div>
  );
};
