"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export function WhatsAppAudioPlayer({ src, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setIsLoaded(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = x / bounds.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("flex items-center gap-2 py-1", className)}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <Button
        onClick={togglePlayPause}
        size="icon"
        variant="ghost"
        className="h-10 w-10 rounded-full bg-[#53bdeb] hover:bg-[#42a5d5] flex-shrink-0 transition-colors"
        disabled={!isLoaded}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 fill-white text-white" />
        ) : (
          <Play className="h-5 w-5 fill-white text-white ml-0.5" />
        )}
      </Button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div 
          className="relative h-1.5 bg-[#d1e7f5] rounded-full cursor-pointer group"
          onClick={handleSeek}
        >
          <div 
            className="absolute h-full bg-[#53bdeb] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute h-3 w-3 bg-[#53bdeb] rounded-full top-1/2 -translate-y-1/2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, marginLeft: '-6px' }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-700">
          <span className="tabular-nums">{formatTime(currentTime)}</span>
          <span className="tabular-nums text-gray-500">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

