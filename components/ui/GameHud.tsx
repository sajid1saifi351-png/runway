'use client';

import React from 'react';
import { Heart, Coins, Trophy, Pause, Zap, Shield, Magnet, Flame, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { StageInfo } from '@/lib/gameState';
import { ActivePowerupState } from '../game/gameEngine';

interface GameHudProps {
  score: number;
  distance: number;
  coins: number;
  lives: number;
  multiplier: number;
  currentStage: StageInfo;
  activePowerups: ActivePowerupState[];
  onPause: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  score,
  distance,
  coins,
  lives,
  multiplier,
  currentStage,
  activePowerups,
  onPause,
  onMoveLeft,
  onMoveRight,
  onJump,
  onSlide,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top Bar HUD */}
      <div className="flex items-start justify-between gap-2">
        {/* Top-Left: Lives / Health */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-black/60 backdrop-blur-md px-3 py-2 border border-red-500/30 shadow-lg shadow-black/40">
          {[1, 2, 3].map((heartIndex) => (
            <Heart
              key={heartIndex}
              className={`w-6 h-6 transition-all duration-300 ${
                heartIndex <= lives
                  ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] scale-100'
                  : 'fill-stone-800 text-stone-700 scale-90 opacity-40'
              }`}
            />
          ))}
        </div>

        {/* Top-Center: Score & Stage Badge */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 rounded-2xl bg-black/65 backdrop-blur-md px-5 py-2 border border-amber-500/40 shadow-xl shadow-amber-500/10">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-mono text-2xl md:text-3xl font-black tracking-wider text-amber-300">
              {score.toLocaleString()}
            </span>
            {multiplier > 1 && (
              <span className="rounded-md bg-amber-500 px-1.5 py-0.5 text-xs font-black text-black animate-pulse">
                {multiplier}X
              </span>
            )}
          </div>

          {/* Stage Name Badge */}
          <div className="mt-1.5 flex items-center gap-1.5 rounded-full bg-stone-900/80 backdrop-blur-sm px-3 py-1 border border-stone-700/60 text-xs font-semibold text-stone-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentStage.name}</span>
            <span className="text-stone-500">•</span>
            <span className="font-mono text-amber-400 font-bold">{distance}m</span>
          </div>
        </div>

        {/* Top-Right: Coins & Pause Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl bg-black/60 backdrop-blur-md px-3.5 py-2 border border-yellow-500/30 shadow-lg shadow-black/40">
            <Coins className="w-6 h-6 text-yellow-400 animate-pulse fill-yellow-500/20" />
            <span className="font-mono text-xl md:text-2xl font-black tracking-wide text-yellow-300">
              {coins}
            </span>
          </div>

          <button
            onClick={onPause}
            className="pointer-events-auto rounded-2xl bg-black/60 backdrop-blur-md p-2.5 border border-stone-600 text-stone-200 transition-all hover:bg-stone-800 hover:text-white active:scale-90 cursor-pointer shadow-lg"
            aria-label="Pause Game"
          >
            <Pause className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Active Power-ups Countdown Display */}
      {activePowerups.length > 0 && (
        <div className="flex flex-col gap-2 mt-2 w-fit">
          {activePowerups.map((pu) => {
            const pct = Math.max(0, (pu.remainingTime / pu.duration) * 100);
            return (
              <div
                key={pu.type}
                className="flex items-center gap-2.5 rounded-xl bg-black/70 backdrop-blur-md px-3 py-1.5 border border-amber-500/30 shadow-md animate-fade-in"
              >
                {pu.type === 'magnet' && <Magnet className="w-4 h-4 text-red-400" />}
                {pu.type === 'shield' && <Shield className="w-4 h-4 text-cyan-400" />}
                {pu.type === 'boost' && <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />}
                {pu.type === 'doubleCoins' && <Coins className="w-4 h-4 text-emerald-400" />}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-300">
                    {pu.type === 'doubleCoins' ? 'Lakshmi 2X' : pu.type}
                  </span>
                  <div className="h-1.5 w-16 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-100"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {Math.ceil(pu.remainingTime)}s
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Virtual Controls (For Mobile & Touch Accessibility) */}
      <div className="pointer-events-auto flex items-end justify-between pb-2">
        {/* Left / Right Lateral D-Pad */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-1.5 rounded-2xl border border-stone-800/80">
          <button
            onClick={onMoveLeft}
            className="flex h-13 w-13 md:h-16 md:w-16 items-center justify-center rounded-xl bg-stone-900/80 border border-stone-700/80 text-stone-200 active:bg-amber-500 active:text-black transition-all cursor-pointer shadow-lg"
            aria-label="Move Left"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={onMoveRight}
            className="flex h-13 w-13 md:h-16 md:w-16 items-center justify-center rounded-xl bg-stone-900/80 border border-stone-700/80 text-stone-200 active:bg-amber-500 active:text-black transition-all cursor-pointer shadow-lg"
            aria-label="Move Right"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Center Instructions Hint (Disappears after distance > 200m) */}
        {distance < 120 && (
          <div className="hidden sm:flex flex-col items-center bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-stone-800 text-stone-400 text-xs">
            <span>Swipe or Arrow Keys: Jump, Slide, Switch Lanes</span>
          </div>
        )}

        {/* Jump / Slide Vertical Controls */}
        <div className="flex flex-col items-center gap-2 bg-black/40 backdrop-blur-sm p-1.5 rounded-2xl border border-stone-800/80">
          <button
            onClick={onJump}
            className="flex h-13 w-13 md:h-16 md:w-16 items-center justify-center rounded-xl bg-stone-900/80 border border-amber-600/60 text-amber-300 active:bg-amber-500 active:text-black transition-all cursor-pointer shadow-lg"
            aria-label="Jump"
          >
            <ChevronUp className="w-7 h-7" />
          </button>
          <button
            onClick={onSlide}
            className="flex h-13 w-13 md:h-16 md:w-16 items-center justify-center rounded-xl bg-stone-900/80 border border-cyan-600/60 text-cyan-300 active:bg-cyan-500 active:text-black transition-all cursor-pointer shadow-lg"
            aria-label="Slide"
          >
            <ChevronDown className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
