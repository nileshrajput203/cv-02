import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, ChevronDown } from 'lucide-react';

export const HeroVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto-play reliability guarantee on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked without user interaction or waiting for buffer
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleScrollToNextSection = () => {
    if (containerRef.current) {
      const nextElem = containerRef.current.nextElementSibling;
      if (nextElem) {
        nextElem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[85vh] sm:h-screen min-h-[480px] max-h-[1080px] bg-black overflow-hidden flex items-center justify-center select-none"
      aria-label="Hero Video"
    >
      {/* ----------------------------------------------------
          FULL BLEED CINEMATIC HERO VIDEO
         ---------------------------------------------------- */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/videos/hero-poster.webp"
        onClick={togglePlay}
        className="w-full h-full object-cover object-center cursor-pointer block"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        <source src="/videos/hero-scrolly-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Subtle Bottom Gradient for seamless visual integration with page */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

      {/* Subtle Top Gradient for header contrast */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none" />

      {/* ----------------------------------------------------
          MINIMAL INTERACTIVE CONTROLS (BOTTOM-RIGHT)
         ---------------------------------------------------- */}
      <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg focus:outline-none"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white text-white" />
          ) : (
            <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* ----------------------------------------------------
          ELEGANT SCROLL TO EXPLORE CUE (BOTTOM-CENTER)
         ---------------------------------------------------- */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={handleScrollToNextSection}
          className="group flex flex-col items-center gap-1.5 px-4 py-2 cursor-pointer transition-all duration-300 active:scale-95 select-none focus:outline-none"
          aria-label="Scroll to explore next section"
        >
          <span className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-white/90 group-hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors">
            Scroll to Explore
          </span>
          <div className="w-8 h-8 rounded-full border border-white/50 group-hover:border-[#DF711B] bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
            <ChevronDown className="w-4 h-4 text-white group-hover:text-[#FFB740] stroke-[2.2] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
