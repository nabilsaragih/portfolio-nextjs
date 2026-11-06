'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  ChevronUp,
  SkipForward,
  SkipBack,
  ListMusic,
  Check,
} from 'lucide-react';
import { Track } from '../data';

interface MusicPlayerProps {
  playlist: Track[];
  autoPlayTrigger?: boolean;
}

export function MusicPlayer({ playlist, autoPlayTrigger }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = playlist[currentIndex] || playlist[0];

  // Directly play a specific track index and auto-start playback
  const playTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const targetTrack = playlist[index];
      if (!targetTrack) return;

      setCurrentIndex(index);
      audio.src = targetTrack.src;
      audio.load();
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
        });
    },
    [playlist]
  );

  // Next Track: immediately continues to next track and plays it!
  const handleNextTrack = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const nextIndex = (currentIndex + 1) % playlist.length;
      playTrack(nextIndex);
    },
    [currentIndex, playlist.length, playTrack]
  );

  // Previous Track: immediately continues to prev track and plays it!
  const handlePrevTrack = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(prevIndex);
    },
    [currentIndex, playlist.length, playTrack]
  );

  // Rock-solid toggle play/pause based on actual audio.paused hardware property
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      // Audio is currently playing -> pause immediately!
      audio.pause();
      setIsPlaying(false);
    } else {
      // Audio is currently paused -> resume / play immediately!
      if (!audio.src || !audio.src.includes(currentTrack.src)) {
        audio.src = currentTrack.src;
        audio.load();
      }
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Play request error:', err);
        });
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleSelectTrack = (index: number) => {
    playTrack(index);
    setShowPlaylistMenu(false);
  };

  // Trigger from welcome envelope button
  useEffect(() => {
    if (autoPlayTrigger) {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        if (!audio.src || !audio.src.includes(currentTrack.src)) {
          audio.src = currentTrack.src;
          audio.load();
        }
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {});
      }
    }
  }, [autoPlayTrigger, currentTrack.src]);

  return (
    <>
      {/* HTML5 Native Audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          // Immediately continue to the next track on continuous loop!
          const nextIndex = (currentIndex + 1) % playlist.length;
          playTrack(nextIndex);
        }}
      />

      {/* Floating Audio Controller */}
      <div className="fixed bottom-5 right-5 z-40 max-w-[calc(100vw-2.5rem)] select-none">
        {/* Playlist Popup Menu */}
        <AnimatePresence>
          {showPlaylistMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-2.5 w-72 sm:w-80 rounded-2xl border border-rose-200/70 dark:border-rose-900/50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-3 shadow-2xl shadow-rose-500/20"
            >
              <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-rose-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-100">
                  <ListMusic className="w-4 h-4 text-rose-500" />
                  <span>Daftar Lagu</span>
                </div>
              </div>

              <div className="space-y-1">
                {playlist.map((track, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleSelectTrack(idx)}
                      type="button"
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-semibold border border-rose-200/50 dark:border-rose-800/40'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="w-4 text-[11px] font-mono opacity-50 flex-shrink-0">
                          {idx + 1}.
                        </span>
                        <div className="min-w-0 truncate">
                          <p className="truncate font-medium">{track.title}</p>
                          <p className="text-[10px] opacity-70 truncate">{track.artist}</p>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Player Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-xl shadow-rose-500/15"
        >
          {/* Subtle glowing highlight */}
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-rose-400/20 blur-xl pointer-events-none" />

          <div className="p-2 sm:p-2.5 flex items-center gap-2.5 sm:gap-3">
            {/* Spinning Vinyl Record - Clicking toggles play / pause */}
            <button
              onClick={(e) => togglePlay(e)}
              type="button"
              className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 shadow-md ring-2 ring-rose-300 dark:ring-rose-500/50 cursor-pointer overflow-hidden transition-transform active:scale-95"
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              title={isPlaying ? 'Jeda lagu (Pause)' : 'Putar lagu (Play)'}
            >
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isPlaying ? { repeat: Infinity, duration: 4, ease: 'linear' } : { duration: 0.5 }
                }
                className="relative flex h-full w-full items-center justify-center bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950"
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-1 rounded-full border border-neutral-700/50" />
                <div className="absolute inset-2.5 rounded-full border border-neutral-700/40" />

                {/* Center Label */}
                <div className="h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              </motion.div>

              {/* Hover overlay play/pause icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-white" />
                ) : (
                  <Play className="h-4 w-4 text-white ml-0.5" />
                )}
              </div>
            </button>

            {/* Song info and soundbars */}
            {!isMinimized && (
              <div className="pr-1 min-w-[130px] max-w-[170px] sm:max-w-[210px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-100 truncate">
                    {currentTrack.title}
                  </span>
                  <Sparkles className="h-3 w-3 text-rose-500 animate-pulse flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <p className="text-[11px] text-rose-600/80 dark:text-rose-400 font-medium truncate">
                    {currentTrack.artist}
                  </p>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                    {currentIndex + 1}/{playlist.length}
                  </span>
                </div>

                {/* Visualizer bars */}
                <div className="flex items-end gap-1 mt-1.5 h-3">
                  {[40, 80, 55, 100, 65, 45, 90].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={
                        isPlaying
                          ? { height: [`${Math.max(15, h * 0.2)}%`, `${h}%`, '20%'] }
                          : { height: '25%' }
                      }
                      transition={
                        isPlaying
                          ? {
                              repeat: Infinity,
                              duration: 0.6 + (i % 3) * 0.2,
                              ease: 'easeInOut',
                              repeatType: 'reverse',
                            }
                          : { duration: 0.3 }
                      }
                      className="w-1 rounded-full bg-gradient-to-t from-rose-500 to-pink-400"
                      style={{ height: '20%' }}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                    {isPlaying ? 'Memutar' : 'Jeda'}
                  </span>
                </div>
              </div>
            )}

            {/* Action & Loop Controls */}
            <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
              {/* Previous Track */}
              <button
                type="button"
                onClick={(e) => handlePrevTrack(e)}
                className="p-1 sm:p-1.5 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label="Previous track"
                title="Lagu sebelumnya"
              >
                <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Play/Pause Button - Prominent toggle */}
              <button
                type="button"
                onClick={(e) => togglePlay(e)}
                className="p-1.5 sm:p-2 rounded-full text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/20 active:scale-95 transition cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'Jeda lagu (Pause)' : 'Lanjutkan lagu (Play)'}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white" />
                ) : (
                  <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white ml-0.5" />
                )}
              </button>

              {/* Next Track */}
              <button
                type="button"
                onClick={(e) => handleNextTrack(e)}
                className="p-1 sm:p-1.5 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label="Next track"
                title="Lagu berikutnya"
              >
                <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Playlist drawer toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlaylistMenu(!showPlaylistMenu);
                }}
                className={`p-1 sm:p-1.5 rounded-full transition cursor-pointer ${
                  showPlaylistMenu
                    ? 'text-rose-500 bg-rose-100/70 dark:bg-rose-950/60'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-neutral-800'
                }`}
                aria-label="Daftar lagu"
                title="Daftar lagu (3 lagu)"
              >
                <ListMusic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Mute */}
              <button
                type="button"
                onClick={(e) => toggleMute(e)}
                className="p-1 sm:p-1.5 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </button>

              {/* Minimize */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1 sm:p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-rose-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                aria-label={isMinimized ? 'Expand' : 'Collapse'}
              >
                {isMinimized ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
