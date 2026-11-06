'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  Video,
  ShieldCheck,
  Compass,
  HeartHandshake,
  Heart,
  Sparkles,
} from 'lucide-react';
import { LoveReason } from '../data';

interface ReasonsDeckProps {
  reasons: LoveReason[];
}

export function ReasonsDeck({ reasons }: ReasonsDeckProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Volume2':
        return Volume2;
      case 'Video':
        return Video;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Compass':
        return Compass;
      case 'HeartHandshake':
        return HeartHandshake;
      default:
        return Heart;
    }
  };

  return (
    <section className="relative py-16 px-4 max-w-5xl mx-auto select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Little Things Across The Miles</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Alasan Kenapa Hatiku Selalu Menetap Padamu
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2">
          Hal-hal penuh makna yang selalu membuatku bersyukur dan jatuh cinta kepadamu setiap harinya.
        </p>
      </motion.div>

      {/* Symmetrical Centered Cards Container */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
        {reasons.map((item, index) => {
          const Icon = getIcon(item.iconName);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-2xl p-6 border border-rose-100/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md shadow-xs hover:shadow-md hover:border-rose-200 dark:hover:border-neutral-700 transition-all flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-neutral-800 text-rose-500 dark:text-rose-300 border border-rose-100 dark:border-neutral-700/60 shadow-xs mb-3.5">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mt-2 text-center">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
