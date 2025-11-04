
import React from 'react';

const VideoPlayer: React.FC = () => {
  return (
    <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-200 dark:border-zinc-800 bg-black">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src="https://www.youtube.com/embed/JCp-VxTNOwY?autoplay=1&mute=1&loop=1&playlist=JCp-VxTNOwY&controls=0&rel=0"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Miracle Analytics Dashboard"
      >
      </iframe>
    </div>
  );
};

export default VideoPlayer;