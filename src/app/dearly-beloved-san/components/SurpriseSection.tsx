'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Heart,
  Sparkles,
  Award,
  Lock,
  Unlock,
  CreditCard,
  Check,
  Copy,
  HelpCircle,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { AnniversaryData } from '../data';

interface SurpriseSectionProps {
  surprise: AnniversaryData['surprise'];
  partnerName: string;
}

// Helper to hash text using browser Web Crypto API (SHA-256)
async function hashText(text: string): Promise<string> {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
  const buffer = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Helper to decrypt AES-GCM ciphertext payload (ivHex:dataHex)
async function decryptVoucherPayload(payload: string, answerText: string): Promise<string | null> {
  try {
    const [ivHex, dataHex] = payload.split(':');
    if (!ivHex || !dataHex) return null;

    const ivMatches = ivHex.match(/.{1,2}/g);
    const dataMatches = dataHex.match(/.{1,2}/g);
    if (!ivMatches || !dataMatches) return null;

    const iv = new Uint8Array(ivMatches.map((byte) => parseInt(byte, 16)));
    const data = new Uint8Array(dataMatches.map((byte) => parseInt(byte, 16)));

    const normalized = answerText.trim().toLowerCase().replace(/\s+/g, ' ');
    const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
    const key = await crypto.subtle.importKey('raw', keyHash, 'AES-GCM', false, ['decrypt']);

    const decryptedBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(decryptedBuf);
  } catch {
    return null;
  }
}

export function SurpriseSection({ surprise, partnerName }: SurpriseSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);

  // Gift Card Quiz state
  const [quizInput, setQuizInput] = useState('');
  const [quizError, setQuizError] = useState(false);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [unlockedVoucherCode, setUnlockedVoucherCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Custom Confetti & Hearts particle burst logic
  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f43f5e', '#ec4899', '#fb7185', '#fbbf24', '#f59e0b', '#a855f7', '#60a5fa'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vRot: number;
      isHeart: boolean;
      life: number;
      maxLife: number;
    }> = [];

    // Create 140 particles from center bottom
    for (let i = 0; i < 140; i++) {
      const angle = (Math.PI * (Math.random() * 0.8 + 0.1)) * -1; // up spread
      const speed = Math.random() * 12 + 6;
      particles.push({
        x: canvas.width / 2 + (Math.random() * 60 - 30),
        y: canvas.height * 0.7,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        isHeart: Math.random() > 0.45,
        life: 0,
        maxLife: Math.random() * 60 + 80,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      for (const p of particles) {
        if (p.life < p.maxLife) {
          alive++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // gravity
          p.vx *= 0.98; // friction
          p.rotation += p.vRot;
          p.life++;

          const alpha = 1 - p.life / p.maxLife;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.isHeart) {
            // Draw heart
            const s = p.size * 0.7;
            ctx.beginPath();
            ctx.moveTo(0, -s / 2);
            ctx.bezierCurveTo(-s / 2, -s, -s, -s / 4, 0, s);
            ctx.bezierCurveTo(s, -s / 4, s / 2, -s, 0, -s / 2);
            ctx.fill();
          } else {
            // Draw ribbon / rectangular confetti
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          }
          ctx.restore();
        }
      }

      if (alive > 0) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(render);
  };

  const handleOpenSurprise = () => {
    setIsOpen(true);
    setTimeout(() => {
      fireConfetti();
    }, 200);
  };

  const handleAgree = () => {
    setHasAgreed(true);
    fireConfetti();
  };

  // Playful dodge for the "No" button (much further and instant)
  const handleNoHover = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const minX = isMobile ? 80 : 140;
    const maxX = isMobile ? 140 : 260;
    const minY = 60;
    const maxY = 140;

    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;

    const randomX = signX * (Math.floor(Math.random() * (maxX - minX)) + minX);
    const randomY = signY * (Math.floor(Math.random() * (maxY - minY)) + minY);

    setNoButtonPosition({ x: randomX, y: randomY });
    setNoCount((prev) => prev + 1);
  };

  // Gift Card Quiz validation logic (Secured with SHA-256 Hash)
  const handleCheckQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!surprise.giftCard) return;

    const rawInput = quizInput.trim();
    if (!rawInput) return;

    try {
      const inputHash = await hashText(rawInput);
      const answerHashes = surprise.giftCard.quizAnswerHashes || [];
      const fallbackPlainAnswers = surprise.giftCard.quizAnswers || [];

      // Check against encrypted SHA-256 hashes
      const isHashMatch = answerHashes.includes(inputHash);

      // Fallback check against plaintext answers if any exist
      const cleanInput = rawInput.toLowerCase().replace(/\s+/g, ' ');
      const isPlainMatch = fallbackPlainAnswers.some((ans) => {
        const cleanAns = ans.trim().toLowerCase().replace(/\s+/g, ' ');
        return (
          cleanInput === cleanAns ||
          cleanInput.includes(cleanAns) ||
          cleanAns.includes(cleanInput)
        );
      });

      if (isHashMatch || isPlainMatch) {
        // Attempt to decrypt the voucher code dynamically using the typed answer
        let resolvedCode = surprise.giftCard.voucherCode || '';

        if (surprise.giftCard.encryptedVoucherMap && surprise.giftCard.encryptedVoucherMap[inputHash]) {
          const dec = await decryptVoucherPayload(surprise.giftCard.encryptedVoucherMap[inputHash], rawInput);
          if (dec) resolvedCode = dec;
        } else if (surprise.giftCard.encryptedVoucherCode) {
          const dec = await decryptVoucherPayload(surprise.giftCard.encryptedVoucherCode, rawInput);
          if (dec) resolvedCode = dec;
        }

        setUnlockedVoucherCode(resolvedCode || 'SAN-LOVE-JAJAN-2024');
        setQuizError(false);
        setQuizUnlocked(true);
        fireConfetti();
      } else {
        setQuizError(true);
      }
    } catch {
      setQuizError(true);
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section className="relative py-24 px-4 max-w-4xl mx-auto text-center">
      {/* Canvas for particle burst */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold mb-3">
          <Gift className="w-3.5 h-3.5" />
          <span>Kejutan Spesial</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Ada Satu Hal Terakhir untukmu...
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2">
          Sebuah kotak rahasia yang sengaja kusimpan di akhir cerita ini. Ketuk untuk membukanya!
        </p>
      </motion.div>

      {/* The Interactive Gift Box */}
      {!isOpen ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center my-6"
        >
          <motion.div
            whileHover={{ scale: 1.06, rotate: [-1, 1, -1] }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenSurprise}
            className="group relative cursor-pointer flex flex-col items-center"
          >
            {/* Pulsing Aura */}
            <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-rose-500/30 via-pink-400/20 to-amber-300/30 blur-2xl group-hover:opacity-100 transition duration-500 animate-pulse" />

            {/* 3D-effect Gift Box Icon Card */}
            <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 p-1 shadow-2xl shadow-rose-500/40 border-2 border-rose-300/40">
              {/* Ribbon Cross */}
              <div className="absolute inset-y-0 w-6 sm:w-8 bg-amber-300/90 shadow-sm flex items-center justify-center" />
              <div className="absolute inset-x-0 h-6 sm:h-8 bg-amber-300/90 shadow-sm flex items-center justify-center" />

              {/* Center Bow / Heart Seal */}
              <div className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white dark:bg-neutral-900 shadow-lg border-2 border-amber-300">
                <Gift className="h-7 w-7 sm:h-8 sm:w-8 text-rose-500 animate-bounce" />
              </div>
            </div>

            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-50 dark:bg-neutral-800 text-rose-600 dark:text-rose-300 font-semibold text-xs sm:text-sm shadow-md border border-rose-200 dark:border-neutral-700"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{surprise.boxLabel}</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        /* The Unveiled Surprise Letter Modal / Container */
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative max-w-2xl mx-auto rounded-3xl border border-rose-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl shadow-rose-500/20 text-left"
        >
          {/* Decorative Corner Seals */}
          <div className="absolute -top-3.5 -right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg ring-4 ring-white dark:ring-neutral-900">
            <Heart className="h-4 w-4 fill-white" />
          </div>

          <div className="flex items-center justify-between border-b border-rose-100 dark:border-neutral-800 pb-4 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
                {surprise.letterDate}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                {surprise.letterTitle}
              </h3>
            </div>
            <button
              onClick={fireConfetti}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-neutral-800 text-xs font-medium text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition"
              title="Letuskan kembang api cinta lagi!"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Confetti</span>
            </button>
          </div>

          {/* Letter Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed font-sans">
            {surprise.letterContent.map((paragraph, idx) => (
              <p key={idx} className={idx === 0 ? 'font-semibold text-rose-600 dark:text-rose-400' : ''}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Signoff */}
          <div className="mt-8 pt-6 border-t border-rose-100 dark:border-neutral-800 text-right">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
              {surprise.closingMessage}
            </p>
            <p className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 mt-1">
              {surprise.senderName}
            </p>
          </div>

          {/* Interactive Proposal / Question Card */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-tr from-rose-50 via-pink-50 to-amber-50 dark:from-neutral-800 dark:via-rose-950/20 dark:to-neutral-800 border border-rose-200/60 dark:border-neutral-700 text-center">
            {!hasAgreed ? (
              <>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Satu Pertanyaan Penting
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-white mb-5">
                  {surprise.proposalQuestion || 'Maukah kamu terus berjuang dan menjaga hati ini bersamaku?'}
                </h4>

                <div className="flex flex-wrap items-center justify-center gap-4 relative min-h-[50px]">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAgree}
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{surprise.yesButtonText || 'Iya, Kita Pasti Bisa! 💖✈️'}</span>
                  </motion.button>

                  <motion.button
                    animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                    transition={{
                      type: 'spring',
                      stiffness: 900,
                      damping: 30,
                      mass: 0.4,
                    }}
                    onMouseEnter={handleNoHover}
                    onMouseMove={handleNoHover}
                    onTouchStart={handleNoHover}
                    onPointerDown={handleNoHover}
                    type="button"
                    className="px-5 py-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium text-xs sm:text-sm hover:bg-neutral-300 transition-colors cursor-pointer select-none"
                  >
                    {noCount > 0 ? 'Tombol ini kabur! 😜' : 'Nggak dulu...'}
                  </motion.button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-black text-rose-600 dark:text-rose-400">
                  Yay! Jarak Ini Pasti Kalah &amp; Kita Bersatu Selamanya! 💐✈️💍
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 max-w-md mx-auto">
                  Terima kasih sudah bertahan, {partnerName}! Selamat merayakan 2 tahun perjuangan hubungan kita. I love you soo much!
                </p>

                {/* HADIAH JAJAN & KUIS RAHASIA */}
                {surprise.giftCard && surprise.giftCard.enabled && (
                  <div className="mt-8 pt-6 border-t border-rose-200/60 dark:border-neutral-700/60 text-left">
                    {!quizUnlocked ? (
                      /* KUIS RAHASIA SEBELUM TERBUKA */
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl bg-white/90 dark:bg-neutral-900/90 p-5 sm:p-7 border-2 border-dashed border-rose-300 dark:border-rose-900/60 shadow-lg relative overflow-hidden"
                      >
                        {/* Decorative background glow */}
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center text-rose-500 shadow-xs">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">
                              {surprise.giftCard.badge || 'Kuis Rahasia 🎁'}
                            </span>
                            <h5 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-white">
                              Ada Satu Hadiah Jajan Buatmu! 💳🍰
                            </h5>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                          Aku punya satu kartu hadiah jajan spesial untukmu. Tapi gemboknya hanya bisa dibuka dengan satu jawaban rahasia yang cuma kita berdua yang tahu 😉:
                        </p>

                        {/* Pertanyaan Kuis */}
                        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-neutral-800/80 border border-rose-200/60 dark:border-neutral-700 mb-4 text-xs sm:text-sm font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>&ldquo;{surprise.giftCard.quizQuestion}&rdquo;</span>
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleCheckQuiz} className="space-y-3">
                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <input
                              type="text"
                              value={quizInput}
                              onChange={(e) => {
                                setQuizInput(e.target.value);
                                if (quizError) setQuizError(false);
                              }}
                              placeholder="Ketik jawaban rahasia kita di sini..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                            />
                            <button
                              type="submit"
                              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                            >
                              <Unlock className="w-4 h-4" />
                              <span>Buka Hadiah 🔓</span>
                            </button>
                          </div>

                          {/* Error warning */}
                          {quizError && (
                            <motion.div
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex flex-wrap items-center justify-between gap-2 text-xs text-rose-500 font-medium pt-1"
                            >
                              <span>Eits, jawabannya belum pas nih! Coba ingat-ingat lagi yaa 😜</span>
                              {surprise.giftCard.quizHint && (
                                <button
                                  type="button"
                                  onClick={() => setShowHint(!showHint)}
                                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  <span>{showHint ? 'Tutup Petunjuk' : 'Lihat Petunjuk 💡'}</span>
                                </button>
                              )}
                            </motion.div>
                          )}

                          {/* Hint toggle */}
                          {showHint && surprise.giftCard.quizHint && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300"
                            >
                              💡 <strong>Petunjuk:</strong> {surprise.giftCard.quizHint}
                            </motion.div>
                          )}
                        </form>
                      </motion.div>
                    ) : (
                      /* KARTU HADIAH JAJAN (SETELAH KUIS BERHASIL DIJAWAB) */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 240 }}
                        className="space-y-4"
                      >
                        <div className="text-center mb-5">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 text-xs font-bold mb-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Jawaban Benar! Gembok Terbuka 🎉</span>
                          </div>
                          <h5 className="text-base sm:text-xl font-extrabold text-neutral-800 dark:text-white">
                            Selamat! Ini Hadiah Jajan Spesial Buatmu 💳💖
                          </h5>
                        </div>

                        {/* DESAIN KARTU JAJAN MEWAH (CREDIT CARD STYLE) */}
                        <div className="relative w-full max-w-sm mx-auto rounded-3xl p-6 bg-gradient-to-br from-neutral-900 via-rose-950 to-neutral-900 text-white shadow-2xl shadow-rose-950/50 border border-rose-500/40 overflow-hidden select-none">
                          {/* Hologram / Shimmering Aura */}
                          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-rose-500/25 blur-2xl pointer-events-none" />
                          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                          {/* Baris Atas: EMV Chip & Badge */}
                          <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-2">
                              {/* Gold EMV Chip */}
                              <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-500 border border-amber-100/60 shadow-xs flex items-center justify-center">
                                <div className="w-6 h-4 border border-amber-600/40 rounded-xs" />
                              </div>
                              <CreditCard className="w-4 h-4 text-rose-300/60" />
                            </div>

                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-[10px] font-bold text-rose-200 tracking-wider">
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              <span>JAJAN CARD</span>
                            </div>
                          </div>

                          {/* Baris Tengah: Judul & Nominal */}
                          <div className="mb-6 relative z-10">
                            <span className="text-[10px] font-semibold text-rose-300/80 uppercase tracking-widest block mb-0.5">
                              {surprise.giftCard.cardTitle || 'Voucher Jajan Anniversary'}
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">
                              {surprise.giftCard.amountOrReward}
                            </h3>
                          </div>

                          {/* Baris Bawah: Pemilik & Masa Berlaku */}
                          <div className="relative z-10 pt-3 border-t border-rose-500/30 flex items-end justify-between text-xs">
                            <div>
                              <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">Cardholder</span>
                              <span className="font-bold text-neutral-100 tracking-wide">{partnerName}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">Valid Thru</span>
                              <span className="font-bold text-rose-300 font-mono">
                                {surprise.giftCard.validThru ? `${surprise.giftCard.validThru.toUpperCase()} 🗓️` : '6 BULAN 🗓️'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Voucher Code Box & Actions */}
                        <div className="max-w-sm mx-auto space-y-3 pt-2">
                          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-rose-200 dark:border-neutral-800 flex items-center justify-between gap-3 shadow-sm">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                                Kode Voucher Jajan
                              </span>
                              <span className="text-sm font-black font-mono text-rose-600 dark:text-rose-400 tracking-wider">
                                {unlockedVoucherCode}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(unlockedVoucherCode)}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              {copiedCode ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Salin Kode</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Catatan Romantis */}
                          {surprise.giftCard.note && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center italic px-2">
                              {surprise.giftCard.note}
                            </p>
                          )}

                          {/* Tombol Aksi: Panduan Redeem & Klaim WhatsApp (Ukuran Konsisten) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {surprise.giftCard.redeemGuideUrl && (
                              <a
                                href={surprise.giftCard.redeemGuideUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-11 px-3 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/60 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer text-center shadow-xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <span>Panduan Redeem 📖</span>
                              </a>
                            )}

                            {/* Tombol Klaim via WhatsApp */}
                            <a
                              href={`https://wa.me/${surprise.giftCard.whatsappNumber || ''}?text=${encodeURIComponent(
                                `Hai sayangku! Aku udah berhasil nebak kuis rahasia kita dan dapet ${surprise.giftCard.amountOrReward} (Kode Voucher: ${unlockedVoucherCode})! Aku jajan dulu hari ini yaa 😋💖`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full h-11 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer text-center"
                            >
                              <MessageCircle className="w-4 h-4 shrink-0" />
                              <span>Klaim ke WhatsApp 💬</span>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}

