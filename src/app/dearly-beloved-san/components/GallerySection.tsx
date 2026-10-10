'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';
import { GalleryItem } from '../data';

interface GallerySectionProps {
  items: GalleryItem[];
  onCloseModal?: () => void;
  onOpenModal?: (index?: number) => void;
}

export function GallerySection({ items, onCloseModal, onOpenModal }: GallerySectionProps) {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState<number | null>(null);

  // Divide items into 2 rows for the 2-tier carousel
  const row1Items = items.filter((_, idx) => idx % 2 === 0);
  const row2Items = items.filter((_, idx) => idx % 2 !== 0);

  // Ensure each track has enough items to span wide screens before looping
  const repeatCount = Math.max(3, Math.ceil(12 / (row1Items.length || 1)));
  const baseRow1 = Array.from({ length: repeatCount }, () => row1Items).flat();
  const baseRow2 = Array.from({ length: repeatCount }, () => row2Items).flat();

  const openItem = (item: GalleryItem) => {
    const idx = items.findIndex((i) => i.id === item.id);
    if (onOpenModal) {
      onOpenModal(idx);
    } else {
      setInternalSelectedIndex(idx >= 0 ? idx : 0);
    }
  };

  const closeViewer = useCallback(() => {
    if (onCloseModal) {
      onCloseModal();
    }
    setInternalSelectedIndex(null);
  }, [onCloseModal]);

  const showNext = useCallback(() => {
    setInternalSelectedIndex((prev) => {
      const cur = prev ?? 0;
      return (cur + 1) % items.length;
    });
  }, [items.length]);

  const showPrev = useCallback(() => {
    setInternalSelectedIndex((prev) => {
      const cur = prev ?? 0;
      return (cur - 1 + items.length) % items.length;
    });
  }, [items.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (internalSelectedIndex === null) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeViewer();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [internalSelectedIndex, showNext, showPrev, closeViewer]);

  const currentItem = internalSelectedIndex !== null ? items[internalSelectedIndex] : null;

  return (
    <section id="gallery-section" className="relative py-20 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5 text-rose-500" />
            <span>Kenangan dalam Bingkai</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
            Galeri Potret Perjalanan Kita
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto mt-2">
            Dua baris kenangan yang berputar otomatis tanpa henti. Arahkan kursor atau ketuk foto untuk melihat cerita lengkapnya!
          </p>
        </motion.div>
      </div>

      {/* 2-ROW AUTO-LOOPING CAROUSEL CONTAINER (Continuous smooth drift, unclipped shadows & tape) */}
      <div className="relative flex flex-col gap-2 py-2">
        {/* Side Fade Gradient Overlays for Cinematic Carousel Edge Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-rose-50/90 dark:from-neutral-950 via-rose-50/40 dark:via-neutral-950/40 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-rose-50/90 dark:from-neutral-950 via-rose-50/40 dark:via-neutral-950/40 to-transparent z-10" />

        {/* ROW 1: Auto-scrolling to the LEFT (Slow, relaxing 110s drift) */}
        <div className="flex overflow-hidden py-8 -my-3 select-none">
          <motion.div
            style={{ willChange: 'transform' }}
            className="flex gap-5 pr-5 shrink-0"
            animate={{ x: ['0%', '-100%'] }}
            transition={{
              duration: 110,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {baseRow1.map((item, idx) => (
              <CarouselCard key={`row1-a-${item.id}-${idx}`} item={item} onSelect={() => openItem(item)} />
            ))}
          </motion.div>
          <motion.div
            style={{ willChange: 'transform' }}
            className="flex gap-5 pr-5 shrink-0"
            animate={{ x: ['0%', '-100%'] }}
            transition={{
              duration: 110,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {baseRow1.map((item, idx) => (
              <CarouselCard key={`row1-b-${item.id}-${idx}`} item={item} onSelect={() => openItem(item)} />
            ))}
          </motion.div>
        </div>

        {/* ROW 2: Auto-scrolling to the RIGHT (Slow, relaxing 125s drift) */}
        <div className="flex overflow-hidden py-8 -my-3 select-none">
          <motion.div
            style={{ willChange: 'transform' }}
            className="flex gap-5 pr-5 shrink-0"
            animate={{ x: ['-100%', '0%'] }}
            transition={{
              duration: 125,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {baseRow2.map((item, idx) => (
              <CarouselCard key={`row2-a-${item.id}-${idx}`} item={item} onSelect={() => openItem(item)} />
            ))}
          </motion.div>
          <motion.div
            style={{ willChange: 'transform' }}
            className="flex gap-5 pr-5 shrink-0"
            animate={{ x: ['-100%', '0%'] }}
            transition={{
              duration: 125,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {baseRow2.map((item, idx) => (
              <CarouselCard key={`row2-b-${item.id}-${idx}`} item={item} onSelect={() => openItem(item)} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* FULLSCREEN VIEW GALERI MODAL / LIGHTBOX */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md"
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-neutral-900 border border-rose-200 dark:border-neutral-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-4 border-b border-rose-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300">
                    {currentItem.category}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    Foto {(internalSelectedIndex ?? 0) + 1} dari {items.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeViewer}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  aria-label="Tutup galeri"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Main Image Area */}
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
                {currentItem.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={
                      currentItem.image.startsWith('http')
                        ? currentItem.image
                        : currentItem.image.startsWith('/')
                        ? currentItem.image
                        : `/${currentItem.image.replace(/^public\//, '')}`
                    }
                    alt={currentItem.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-3">
                      <Camera className="w-8 h-8 text-rose-400" />
                    </div>
                    <Sparkles className="w-5 h-5 text-amber-400 mb-2 animate-pulse" />
                    <h4 className="text-lg font-bold">{currentItem.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                      {currentItem.caption}
                    </p>
                  </div>
                )}

                {/* Left & Right Prev/Next Nav Overlays */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white backdrop-blur-xs transition cursor-pointer"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-900/90 text-white backdrop-blur-xs transition cursor-pointer"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Caption and Notes */}
              <div className="p-5 sm:p-6 overflow-y-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-100">
                    {currentItem.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>{currentItem.date}</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {currentItem.caption}
                </p>

                {currentItem.location && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-rose-500 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{currentItem.location}</span>
                  </div>
                )}

                {/* Thumbnails row */}
                <div className="mt-5 pt-4 border-t border-rose-100 dark:border-neutral-800">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                    Jelajahi Foto Lainnya
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {items.map((it, idx) => {
                      const isSelected = idx === internalSelectedIndex;
                      return (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => setInternalSelectedIndex(idx)}
                          className={`group relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-rose-500 ring-2 ring-rose-400/80 shadow-md shadow-rose-500/20 scale-105 z-10'
                              : 'border-transparent hover:border-rose-300/60'
                          }`}
                          title={`${idx + 1}. ${it.title}`}
                        >
                          {/* Image Thumbnail Preview */}
                          {it.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={
                                it.image.startsWith('http')
                                  ? it.image
                                  : it.image.startsWith('/')
                                  ? it.image
                                  : `/${it.image.replace(/^public\//, '')}`
                              }
                              alt={it.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-rose-900/40 via-neutral-800 to-neutral-900 flex items-center justify-center">
                              <Camera className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}

                          {/* Semi-transparent Masking Overlay */}
                          <div
                            className={`absolute inset-0 transition-colors flex items-center justify-center ${
                              isSelected
                                ? 'bg-rose-950/20'
                                : 'bg-black/55 group-hover:bg-black/30'
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-xs transition-all ${
                                isSelected
                                  ? 'bg-rose-500 text-white shadow-xs scale-110'
                                  : 'bg-black/50 text-neutral-200 group-hover:bg-black/70'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Individual Polaroid Card in the Carousel
function CarouselCard({ item, onSelect }: { item: GalleryItem; onSelect: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className="group cursor-pointer relative w-64 sm:w-72 shrink-0 rounded-2xl bg-white dark:bg-neutral-900 p-3.5 border border-rose-100/80 dark:border-neutral-800 shadow-md hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-900 transition-all select-none"
    >
      {/* Washi tape sticker */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-amber-100/90 dark:bg-amber-900/60 backdrop-blur-xs rounded-xs rotate-1 border border-amber-200/50 dark:border-amber-700/50 z-10" />

      {/* Photo Frame */}
      <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-gradient-to-tr from-rose-100 via-pink-50 to-amber-50 dark:from-neutral-800 dark:via-rose-950/20 dark:to-neutral-800 flex items-center justify-center border border-neutral-100 dark:border-neutral-800">
        {item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={
              item.image.startsWith('http')
                ? item.image
                : item.image.startsWith('/')
                ? item.image
                : `/${item.image.replace(/^public\//, '')}`
            }
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-200/60 dark:bg-rose-900/50 flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 line-clamp-1">
              {item.title}
            </span>
            <span className="text-[10px] text-rose-500/80 font-mono mt-0.5">
              {item.date}
            </span>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-medium">
          <Maximize2 className="w-4 h-4" />
          <span>Lihat Detail</span>
        </div>
      </div>

      {/* Caption & Date */}
      <div className="pt-2.5 px-0.5">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/40">
            {item.category}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            {item.date}
          </span>
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-100 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
          {item.caption}
        </p>
      </div>
    </motion.div>
  );
}
