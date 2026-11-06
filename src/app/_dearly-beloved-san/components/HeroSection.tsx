'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ChevronDown, Calendar, Clock, Plane, MapPin, Camera } from 'lucide-react';

interface HeroSectionProps {
  partnerName: string;
  tagline: string;
  distanceTagline?: string;
  anniversaryDate: string;
  onExploreClick?: () => void;
  onGalleryClick?: () => void;
}

interface TimeTogether {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function HeroSection({
  partnerName,
  tagline,
  distanceTagline,
  anniversaryDate,
  onExploreClick,
  onGalleryClick,
}: HeroSectionProps) {
  const [timeTogether, setTimeTogether] = useState<TimeTogether>({
    days: 732,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 overflow-hidden">
      {/* Decorative Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-rose-400/20 via-pink-300/20 to-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Anniversary Pill Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm mb-4"
        >
          <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Spesial 2nd Anniversary &bull; LDR Edition</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
        </motion.div>

        {/* LDR Distance Flight Route Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-1.5 mb-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-amber-50/80 dark:bg-neutral-800/70 border border-amber-200/60 dark:border-neutral-700 text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 font-medium shadow-xs">
            <span className="flex items-center gap-1 font-semibold">
              <MapPin className="w-3 h-3 text-rose-500" /> Lokasimu
            </span>
            <span className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500">
              &bull;&bull;&bull;
              <Plane className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              &bull;&bull;&bull;
            </span>
            <span className="flex items-center gap-1 font-semibold">
              <MapPin className="w-3 h-3 text-rose-500" /> Lokasiku
            </span>
          </div>
          {distanceTagline && (
            <span className="text-[11px] sm:text-xs text-rose-600 dark:text-rose-400 font-medium">
              {distanceTagline}
            </span>
          )}
        </motion.div>

        {/* Big Romantic Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-4">
          Dua Tahun Bersamamu,{' '}
          <span className="block mt-0.5 pb-2 -mb-2 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            {partnerName}
          </span>
        </h1>

        {/* Romantic Subtitle / Tagline */}
        <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed mb-8">
          {tagline}
        </p>

        {/* Interactive Beating Heart with Airplane Orbit */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative mb-10"
        >
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 p-0.5 shadow-lg shadow-rose-500/30 flex items-center justify-center">
            <div className="h-full w-full rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 fill-rose-500 text-rose-500 drop-shadow" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-neutral-900 shadow">
            2Y
          </span>
        </motion.div>

        {/* Real-time Days & Hours Counter Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="w-full max-w-xl rounded-2xl border border-rose-200/60 dark:border-rose-900/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md p-4 sm:p-6 shadow-xl shadow-rose-500/5 mb-10"
        >
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold text-rose-600 dark:text-rose-400 mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Waktu Kita Saling Menjaga Hati Melintasi Jarak</span>
            <Plane className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 rounded-xl bg-rose-50/70 dark:bg-neutral-800/60 border border-rose-100 dark:border-neutral-700/60">
              <div className="text-xl sm:text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 font-mono">
                {timeTogether.days}
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                Hari
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-rose-50/70 dark:bg-neutral-800/60 border border-rose-100 dark:border-neutral-700/60">
              <div className="text-xl sm:text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 font-mono">
                {String(timeTogether.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                Jam
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-rose-50/70 dark:bg-neutral-800/60 border border-rose-100 dark:border-neutral-700/60">
              <div className="text-xl sm:text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 font-mono">
                {String(timeTogether.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                Menit
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-rose-50/70 dark:bg-neutral-800/60 border border-rose-100 dark:border-neutral-700/60">
              <div className="text-xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                {String(timeTogether.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
                Detik
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 dark:border-neutral-800 flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>Jadian: 8 Oktober 2024 &bull; LDR sejak: 31 Juli &bull; Cinta kita selalu utuh ❤️</span>
          </div>
        </motion.div>

        {/* CTA Buttons: Galeri & Scroll */}
        <div className="flex flex-col items-center gap-4">
          {onGalleryClick && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onGalleryClick}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 dark:bg-neutral-800/90 hover:bg-rose-50 dark:hover:bg-neutral-750 text-rose-600 dark:text-rose-300 border border-rose-200/80 dark:border-neutral-700 font-semibold text-xs sm:text-sm shadow-md shadow-rose-500/10 transition cursor-pointer"
            >
              <Camera className="w-4 h-4 text-rose-500" />
              <span>Buka Galeri Kenangan 📸</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </motion.button>
          )}

          {/* Scroll CTA Indicator */}
          <motion.button
            onClick={onExploreClick}
            type="button"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-300 transition-colors cursor-pointer group mt-2"
          >
            <span className="font-medium tracking-wider uppercase text-[11px]">
              Scroll ke Bawah untuk Kilas Balik Perjalanan LDR Kita
            </span>
            <div className="w-7 h-7 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center group-hover:border-rose-400 group-hover:bg-rose-50 dark:group-hover:bg-neutral-800 transition">
              <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-rose-500" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
