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
 * DM Notification - A clean Instagram-style DM notification
 * slides down from top. Shows "you'll get a DM" feel.
 * Minimal, premium, no gimmicks.
 */
interface DMNotificationProps {
  startFrame: number;
  handle?: string;
  message?: string;
  avatarFileName?: string;
}

export const DMNotification: React.FC<DMNotificationProps> = ({
  startFrame,
  handle = "@codepattern_",
  message = "Yeh lo poori git guide! 🔥",
  avatarFileName = "avatar.jpg",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > 105) return null;

  // Slide down from top
  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const translateY = interpolate(enterSpring, [0, 1], [-100, 0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Exit - slide back up after staying for a bit
  const exitProgress = interpolate(localFrame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitEased = exitProgress * exitProgress;
  const exitY = interpolate(exitEased, [0, 1], [0, -120]);
  const exitOpacity = interpolate(exitEased, [0, 1], [1, 0]);

  // Message text reveal - typewriter
  const maxChars = message.length;
  const typedCount = Math.floor(
    interpolate(localFrame, [12, 12 + maxChars * 1.5], [0, maxChars], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedMessage = message.slice(0, typedCount);

  // Subtle "new" dot pulse
  const dotPulse = Math.sin(localFrame * 0.15) * 0.3 + 0.7;

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY + exitY}px)`,
        opacity: opacity * exitOpacity,
        zIndex: 55,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          backgroundColor: "rgba(10, 10, 15, 0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          padding: "14px 24px 14px 16px",
          borderRadius: 44,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow:
            "0 16px 48px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)",
          minWidth: 420,
          maxWidth: 700,
        }}
      >
        {/* Blue new-message dot */}
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#0095F6",
            boxShadow: "0 0 12px rgba(0, 149, 246, 0.6)",
            opacity: dotPulse,
          }}
        />

        {/* Avatar */}
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            flexShrink: 0,
          }}
        >
          <Img
            src={staticFile(avatarFileName)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              {handle}
            </span>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              · now
            </span>
          </div>

          <span
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-0.005em",
              whiteSpace: "nowrap",
            }}
          >
            {typedMessage}
            {typedCount < maxChars && (
              <span
                style={{
                  display: "inline-block",
                  width: 1.5,
                  height: 16,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  marginLeft: 2,
                  verticalAlign: "middle",
                }}
              />
            )}
          </span>
        </div>

        {/* DM icon */}
        <div
          style={{
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
