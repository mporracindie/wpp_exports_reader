"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppAudioPlayer } from "./audio-player";

interface LazyAudioPlayerProps {
  src: string;
  className?: string;
}

export function LazyAudioPlayer({ src, className }: LazyAudioPlayerProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "200px", // Load when within 200px of viewport
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <WhatsAppAudioPlayer src={src} />
      ) : (
        <div className="flex items-center gap-2 py-1 min-w-[280px]">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-1.5 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex justify-between">
              <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

