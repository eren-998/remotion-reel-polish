/**
 * Composition Template - Remotion Reel Polish
 * 
 * Copy this file and customize for each video.
 * Replace placeholders marked with <PLACEHOLDER>.
 */
import React from "react";
import { Composition, OffthreadVideo, staticFile } from "remotion";
import { BlackFooterFade } from "./components/BlackFooterFade";
import { MinimalCaptions } from "./components/MinimalCaptions";
import { FollowCard } from "./components/FollowCard";
// OPTIONAL — uncomment only if user requested:
// import { MinimalCommentCTA } from "./components/MinimalCommentCTA";
// import { DMNotification } from "./components/DMNotification";

import captionsData from "../public/captions.json";

export const ReelVideo: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: 1080,
        height: 1920,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Layer 1: Source video - full frame, no overlays in middle */}
      <OffthreadVideo
        src={staticFile("<VIDEO_FILENAME>.mp4")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1920,
          objectFit: "cover",
        }}
      />

      {/* Layer 2: Professional black footer vignette - ALWAYS present */}
      <BlackFooterFade height={450} />

      {/* Layer 3: Hinglish captions - ALWAYS present */}
      <MinimalCaptions captions={captionsData} />

      {/* Layer 4: OPTIONAL motion graphics — ONLY if user requested */}
      {/* <MinimalCommentCTA startFrame={<FRAME>} keyword="<KEYWORD>" /> */}
      {/* <DMNotification startFrame={<FRAME>} handle="<HANDLE>" message="<MSG>" /> */}

      {/* Layer 5: Follow card - ALWAYS present, position configurable */}
      <FollowCard
        startFrame={/* <FOLLOW_TRIGGER_FRAME> */ 900}
        pageName="<PAGE_NAME>"
        handle="<@HANDLE>"
        avatarFileName="avatar.jpg"
      />
    </div>
  );
};

export const RemotionComposition: React.FC = () => {
  return (
    <Composition
      id="<REEL-ID>"
      component={ReelVideo}
      durationInFrames={/* Math.ceil(duration * fps) */ 1000}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
