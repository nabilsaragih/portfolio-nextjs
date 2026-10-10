'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  type: 'heart' | 'star' | 'circle';
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate static particle definitions on client to avoid hydration mismatch
    const items: Particle[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage 0-100vw
      size: Math.floor(Math.random() * 14) + 10, // 10px - 24px
      duration: Math.random() * 10 + 12, // 12s - 22s
      delay: Math.random() * 10,
      opacity: Math.random() * 0.45 + 0.25,
      type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'star' : 'circle',
    }));
    setParticles(items);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: '-40px',
            opacity: p.opacity,
          }}
          animate={{
            y: ['0vh', '-120vh'],
            x: [
              '0px',
              `${(p.id % 2 === 0 ? 1 : -1) * (15 + (p.id % 25))}px`,
              '0px',
            ],
            rotate: [0, (p.id % 2 === 0 ? 1 : -1) * 45, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.type === 'heart' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-rose-400/60 dark:text-rose-300/50 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === 'star' && (
            <svg
              width={p.size * 0.8}
              height={p.size * 0.8}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-300/70 dark:text-amber-200/60 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )}
          {p.type === 'circle' && (
            <div
              style={{ width: p.size * 0.6, height: p.size * 0.6 }}
              className="rounded-full bg-pink-300/50 dark:bg-pink-400/30 blur-[0.5px]"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

