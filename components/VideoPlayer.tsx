
import React from 'react';

interface VideoPlayerProps {
  // The user should provide a direct link to their video file (e.g., .mp4, .webm)
  videoSrc: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc }) => {
  return (
    <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-200 dark:border-zinc-800 bg-black">
      <video
        className="w-full h-full object-cover"
        src={videoSrc}
        controls
        autoPlay
        muted
        loop
        playsInline // Important for iOS
        aria-label="Product demo video"
      >
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default VideoPlayer;
