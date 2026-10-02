'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, ShoppingBag, Trophy, Coins, Compass, Volume2, Sparkles, HeartPulse } from 'lucide-react';
import { soundManager } from '@/lib/soundSystem';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  coinsEarned: number;
  distance: number;
  stageReached: number;
  stageName: string;
  reviveTokens: number;
  totalCoins: number;
  onRevive: () => void;
  onRestart: () => void;
  onOpenShop: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  coinsEarned,
  distance,
  stageReached,
  stageName,
  reviveTokens,
  totalCoins,
  onRevive,
  onRestart,
  onOpenShop,
  onHome,
}) => {
  const isNewHighScore = score > bestScore && score > 0;
  const [countdown, setCountdown] = useState(6);
  const [canRevive, setCanRevive] = useState(reviveTokens > 0 || totalCoins >= 50);

  useEffect(() => {
    if (isNewHighScore) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ef4444', '#10b981', '#fbbf24'],
        });
      } catch {
        // ignore
      }
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isNewHighScore]);

  const handlePlayVoice = () => {
    soundManager.playStageUncomplete();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-b from-stone-950 via-stone-900 to-black p-6 text-center shadow-2xl shadow-red-950/50"
      >
        {/* Glow header */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-600/25 blur-2xl pointer-events-none" />

        {/* Title */}
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-950/60 px-3 py-1 border border-red-500/40 text-xs font-bold text-red-400 uppercase tracking-widest">
          The Yaksha Caught Sajid!
        </div>

        <h2 className="text-3xl font-black uppercase tracking-wider text-white">
          Game Over
        </h2>

        {/* Voice replay badge */}
        <div className="my-2 flex items-center justify-center">
          <button
            onClick={handlePlayVoice}
            className="flex items-center gap-1.5 rounded-full bg-stone-800/80 px-3 py-1 text-xs text-amber-300 hover:bg-stone-700 active:scale-95 transition-all cursor-pointer border border-amber-500/30"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Play Voice: &quot;Uth Jaa! Bhaag!&quot;</span>
          </button>
        </div>

        {/* New Record Banner */}
        {isNewHighScore && (
          <div className="my-2 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-1.5 border border-amber-500/50 text-amber-300 text-sm font-black animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400" />
            NEW HIGH SCORE RECORD!
          </div>
        )}

        {/* Primary Stats Grid */}
        <div className="my-4 grid grid-cols-2 gap-3">
          {/* Final Score */}
          <div className="rounded-2xl bg-stone-900/90 p-3 border border-stone-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Score</span>
            </div>
            <span className="font-mono text-2xl font-black text-amber-300 mt-0.5">
              {score.toLocaleString()}
            </span>
            <span className="text-[10px] text-stone-500">Best: {Math.max(score, bestScore).toLocaleString()}</span>
          </div>

          {/* Coins Collected */}
          <div className="rounded-2xl bg-stone-900/90 p-3 border border-stone-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>Coins</span>
            </div>
            <span className="font-mono text-2xl font-black text-yellow-300 mt-0.5">
              +{coinsEarned}
            </span>
            <span className="text-[10px] text-stone-500">Total: {totalCoins}</span>
          </div>

          {/* Distance Run */}
          <div className="rounded-2xl bg-stone-900/90 p-3 border border-stone-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Distance</span>
            </div>
            <span className="font-mono text-xl font-black text-cyan-300 mt-0.5">
              {distance}m
            </span>
          </div>

          {/* Stage Reached */}
          <div className="rounded-2xl bg-stone-900/90 p-3 border border-stone-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
              <span className="text-rose-400 font-bold">Stage {stageReached}</span>
            </div>
            <span className="text-sm font-black text-rose-300 mt-1 truncate max-w-[120px]">
              {stageName}
            </span>
          </div>
        </div>

        {/* Revive Section with Countdown */}
        {countdown > 0 && canRevive && (
          <div className="my-3 rounded-2xl bg-gradient-to-r from-rose-950/60 to-amber-950/60 p-3 border border-rose-500/40">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-300 mb-2">
              <span className="flex items-center gap-1">
                <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
                Revive Sajid?
              </span>
              <span className="font-mono text-amber-400 font-bold">{countdown}s</span>
            </div>
            <button
              onClick={onRevive}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-2.5 text-sm font-black uppercase text-white shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              {reviveTokens > 0 ? (
                <>Use Amrita Token ({reviveTokens} left)</>
              ) : (
                <>Revive for 50 Coins</>
              )}
            </button>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-base font-black uppercase tracking-wider text-black shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            Play Again
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenShop}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-800/90 py-2.5 text-xs font-bold text-stone-200 hover:bg-stone-700 transition-all cursor-pointer border border-stone-700"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              Shop / Upgrade
            </button>

            <button
              onClick={onHome}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-800/90 py-2.5 text-xs font-bold text-stone-200 hover:bg-stone-700 transition-all cursor-pointer border border-stone-700"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              Main Menu
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
