'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Quote, Sparkles, Heart, Camera } from 'lucide-react';
import { StoryMilestone } from '../data';

interface TimelineSectionProps {
  milestones: StoryMilestone[];
}

export function TimelineSection({ milestones }: TimelineSectionProps) {
  return (
    <section id="story-timeline" className="relative py-20 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Kilas Balik 2 Tahun Terakhir</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Lembaran Cerita Kita
        </h2>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto mt-2">
          Setiap langkah, tawa, dan tantangan yang telah membawa kita sampai ke hari yang istimewa ini.
        </p>
      </motion.div>

      {/* Central Timeline Spine Line */}
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-4 bottom-8 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-300 via-pink-400 to-rose-200 dark:from-rose-800 dark:via-pink-700 dark:to-neutral-800 pointer-events-none" />

        <div className="space-y-12 sm:space-y-20">
          {milestones.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                } gap-6 md:gap-12 pl-10 md:pl-0`}
              >
                {/* Central Timeline Milestone Node / Heart */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-4 ring-white dark:ring-neutral-950">
                  <Heart className="w-4 h-4 fill-white text-white" />
                </div>

                {/* Left/Right Story Card */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="w-full md:w-1/2"
                >
                  <div className="rounded-3xl border border-rose-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-6 sm:p-7 shadow-lg shadow-rose-500/5 hover:border-rose-300 dark:hover:border-rose-900 transition-all">
                    {/* Badge & Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/50">
                        {item.badge}
                      </span>
                      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                        {item.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Quote */}
                    {item.quote && (
                      <div className="relative p-3.5 rounded-2xl bg-rose-50/60 dark:bg-neutral-800/60 border-l-4 border-rose-400 text-xs text-neutral-700 dark:text-neutral-300 italic mb-4">
                        <Quote className="w-3.5 h-3.5 text-rose-400 inline mr-1 -mt-1" />
                        {item.quote}
                      </div>
                    )}

                    {/* Location Badge */}
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Polaroid Photo Card (Opposite side on desktop, stacked on mobile) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full md:w-1/2 flex justify-center"
                >
                  <div
                    style={{
                      transform: `rotate(${item.polaroid.rotation || 0}deg)`,
                    }}
                    className="relative w-full max-w-[280px] bg-white dark:bg-neutral-800 p-2 pb-3 rounded-xl shadow-xl shadow-rose-950/10 border border-neutral-100/80 dark:border-neutral-700/50 hover:scale-105 transition-transform duration-300 group cursor-default"
                  >
                    {/* Tape / Washi sticker on top */}
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-rose-200/80 dark:bg-rose-900/60 backdrop-blur-sm rounded-xs rotate-1 shadow-xs border border-rose-300/40" />

                    {/* Photo Area with Thin Gradient Border */}
                    <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-gradient-to-tr from-rose-300 via-pink-200 to-amber-200 dark:from-rose-800 dark:via-pink-900/60 dark:to-neutral-800 p-[3px] shadow-xs">
                      {item.polaroid.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={
                            item.polaroid.image.startsWith('http')
                              ? item.polaroid.image
                              : item.polaroid.image.startsWith('/')
                              ? item.polaroid.image
                              : `/${item.polaroid.image.replace(/^public\//, '')}`
                          }
                          alt={item.polaroid.caption}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-full w-full rounded-md bg-white/75 dark:bg-neutral-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
                          <div className="h-10 w-10 rounded-full bg-rose-200/50 dark:bg-rose-900/40 flex items-center justify-center mb-2">
                            <Camera className="w-5 h-5 text-rose-500" />
                          </div>
                          <Sparkles className="w-4 h-4 text-amber-400 mb-1 animate-pulse" />
                          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                            {item.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Polaroid Handwritten Caption */}
                    <div className="pt-2 text-center">
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 tracking-wide font-sans">
                        {item.polaroid.caption}
                      </p>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

