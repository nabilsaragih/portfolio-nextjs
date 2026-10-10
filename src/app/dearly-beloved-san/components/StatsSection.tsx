'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, Sparkles, PhoneCall, HeartHandshake, Compass } from 'lucide-react';
import { AnniversaryData } from '../data';

interface StatsSectionProps {
  stats: AnniversaryData['stats'];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      label: 'Hari Perjalanan Cinta',
      value: `${stats.daysTogether} Hari`,
      sub: '2 Tahun jadian (70+ hari LDR sejak 31 Juli)',
      icon: Calendar,
      color: 'from-rose-500 to-pink-500',
    },
    {
      label: 'Jam Percakapan Hangat',
      value: stats.hoursCount,
      sub: 'Chat harian, voice note, dan deep talk',
      icon: PhoneCall,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      label: 'Jam Video Call',
      value: stats.videoCallHours,
      sub: 'Tatap muka virtual via WA dan GMeet',
      icon: Video,
      color: 'from-pink-500 to-rose-400',
    },
    {
      label: 'Kencan Virtual',
      value: `${stats.virtualDates} Sesi`,
      sub: 'Makan, curhat, dan nugas bareng online',
      icon: HeartHandshake,
      color: 'from-amber-400 to-orange-500',
    },
    {
      label: 'Jarak Sebenarnya di Antara Hati Kita',
      value: stats.heartDistance,
      sub: 'Kilometer boleh membentang, tapi rasa selalu sedekat hembusan nafas',
      icon: Compass,
      color: 'from-rose-600 to-red-500',
      fullWidth: true,
    },
  ];

  return (
    <section className="relative py-16 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our 2-Year LDR Wrapped</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Rekap Angka Perjuangan LDR Kita
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2">
          Bukti nyata bahwa jarak beratus kilometer tidak pernah menyurutkan cinta dan kehangatan kita.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-2xl border border-rose-100/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-900 transition-all ${
                item.fullWidth ? 'col-span-2 md:col-span-4' : ''
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center mb-3 shadow-md shadow-rose-500/20`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-neutral-800 dark:text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-200 mt-1">
                {item.label}
              </div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                {item.sub}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
