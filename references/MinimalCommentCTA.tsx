import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

/**
 * Minimal Comment CTA - appears slightly above footer area.
 * Clean, non-intrusive design. Just a subtle glass pill
 * with "Comment GIT 👇" text and a small typing animation.
 */
interface MinimalCommentCTAProps {
  /** Frame at which this CTA starts appearing */
  startFrame: number;
  keyword?: string;
}

export const MinimalCommentCTA: React.FC<MinimalCommentCTAProps> = ({
  startFrame,
  keyword = "GIT",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  // Entrance spring
  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);
  const scale = interpolate(enterSpring, [0, 1], [0.9, 1]);

  // Typewriter effect for keyword
  const charsCount = Math.floor(
    interpolate(localFrame, [15, 15 + keyword.length * 3], [0, keyword.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedKeyword = keyword.slice(0, charsCount);
  const showCursor = localFrame >= 15 && Math.floor(localFrame / 8) % 2 === 0;

  // Exit animation (after ~90 frames / 3 seconds)
  const exitFrame = 90;
  const exitOpacity =
    localFrame > exitFrame
      ? interpolate(localFrame, [exitFrame, exitFrame + 15], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 340,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        zIndex: 45,
        opacity: opacity * exitOpacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "14px 28px",
          borderRadius: 40,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* Comment icon */}
        <div
          style={{
            fontSize: 28,
            lineHeight: 1,
          }}
        >
          💬
        </div>

        {/* Text */}
        <span
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: 24,
            fontWeight: 600,
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          Comment
        </span>

        {/* Keyword pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 149, 246, 0.2)",
            border: "1px solid rgba(0, 149, 246, 0.4)",
            borderRadius: 20,
            padding: "6px 16px",
            minWidth: 80,
          }}
        >
          <span
            style={{
              color: "#0095F6",
              fontSize: 24,
              fontWeight: 800,
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            {typedKeyword}
          </span>
          {showCursor && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 24,
                backgroundColor: "#0095F6",
                marginLeft: 3,
                borderRadius: 1,
              }}
            />
          )}
        </div>

        {/* Arrow down */}
        <span
          style={{
            fontSize: 26,
            lineHeight: 1,
          }}
        >
          👇
        </span>
      </div>
    </div>
  );
};
