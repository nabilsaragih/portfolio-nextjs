'use client';

import React, { useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, ArrowUp, Camera } from 'lucide-react';
import { anniversaryConfig } from './data';
import { FloatingParticles } from './components/FloatingParticles';
import { MusicPlayer } from './components/MusicPlayer';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { TimelineSection } from './components/TimelineSection';
import { ReasonsDeck } from './components/ReasonsDeck';
import { GallerySection } from './components/GallerySection';
import { SurpriseSection } from './components/SurpriseSection';

export default function DearlyBelovedPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [musicTrigger, setMusicTrigger] = useState(false);

  // Scroll Progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleStartExperience = () => {
    setHasStarted(true);
    setMusicTrigger(true);
  };

  const scrollToTimeline = () => {
    const el = document.getElementById('story-timeline');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGallery = () => {
    const el = document.getElementById('gallery-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-rose-50/70 via-white to-pink-50/60 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-neutral-800 dark:text-neutral-100 selection:bg-rose-500 selection:text-white overflow-x-hidden">
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 origin-left z-50 shadow-sm"
        style={{ scaleX }}
      />

      {/* Ambient Floating Particles (Hearts & Sparkles) */}
      <FloatingParticles />

      {/* Floating Music Player (Bottom Right) */}
      <MusicPlayer
        playlist={anniversaryConfig.playlist}
        autoPlayTrigger={musicTrigger}
      />

      {/* Floating Gallery Quick Button (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 select-none">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={scrollToGallery}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-rose-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-rose-200/60 dark:border-rose-900/40 shadow-xl shadow-rose-500/10 text-xs font-semibold backdrop-blur-md transition active:scale-95 cursor-pointer"
          title="Buka Galeri Foto Kenangan"
        >
          <Camera className="w-4 h-4 text-rose-500" />
          <span className="hidden sm:inline">Galeri Kenangan</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 font-mono">
            {anniversaryConfig.gallery.length}
          </span>
        </motion.button>
      </div>

      {/* Intro Overlay / Welcome Gate */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-tr from-rose-950/80 via-neutral-950/90 to-pink-950/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative max-w-md w-full rounded-3xl border border-rose-300/30 bg-white/95 dark:bg-neutral-900/95 p-8 text-center shadow-2xl shadow-rose-500/20"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30">
                <Heart className="h-8 w-8 fill-white animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Happy 2nd Anniversary &bull; LDR Edition</span>
              </div>

              <h2 className="text-2xl font-extrabold text-neutral-800 dark:text-white">
                Untuk {anniversaryConfig.couple.nicknamePartner} Tersayang
              </h2>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-2 mb-6">
                Sebuah rekaman perjalanan 2 tahun cinta kita melintasi jarak, ribuan jam panggilan rindu, dan komitmen indah kita.
              </p>

              <button
                onClick={handleStartExperience}
                type="button"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-500/25 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>Buka ✉️</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Story Sections */}
      <div className="relative z-10">
        {/* 1. Hero Section with Live Counter & Gallery Button */}
        <HeroSection
          partnerName={anniversaryConfig.couple.nicknamePartner}
          tagline={anniversaryConfig.couple.tagline}
          distanceTagline={anniversaryConfig.couple.distanceTagline}
          anniversaryDate={anniversaryConfig.couple.anniversaryDate}
          onExploreClick={scrollToTimeline}
          onGalleryClick={scrollToGallery}
        />

        {/* 2. Relationship Wrapped Stats */}
        <StatsSection stats={anniversaryConfig.stats} />

        {/* 3. Scrollable 2-Year Journey Timeline */}
        <TimelineSection milestones={anniversaryConfig.milestones} />

        {/* 4. Little Reasons Why I Love You Deck */}
        <ReasonsDeck reasons={anniversaryConfig.reasons} />

        {/* 5. Galeri Kenangan & Lightbox Modal */}
        <GallerySection items={anniversaryConfig.gallery} />

        {/* 6. Climax Surprise: 3D Gift Box, Confetti & Love Letter */}
        <SurpriseSection
          surprise={anniversaryConfig.surprise}
          partnerName={anniversaryConfig.couple.nicknamePartner}
        />

        {/* Romantic Footer */}
        <footer className="py-12 px-4 border-t border-rose-200/50 dark:border-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center justify-center gap-1.5 mb-2 font-medium">
            <span>Dibuat dengan</span>
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline" />
            <span>untuk {anniversaryConfig.couple.partnerFullName}</span>
          </div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            2nd Anniversary Edition &bull; Selalu dan Selamanya
          </p>

          <button
            onClick={scrollToTop}
            type="button"
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-rose-500 hover:border-rose-300 transition"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Kembali ke Atas</span>
          </button>
        </footer>
      </div>
    </main>
  );
}