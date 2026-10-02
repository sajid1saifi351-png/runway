'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Play, ShoppingBag, Trophy, Settings, Compass, Coins, Instagram, Sparkles, User, Flame } from 'lucide-react';
import { CharacterSkin } from '@/lib/gameState';

interface HomeScreenProps {
  totalCoins: number;
  highScore: number;
  selectedSkin: CharacterSkin;
  onPlay: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenStages: () => void;
  onOpenSettings: () => void;
  onOpenInstagram: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  totalCoins,
  highScore,
  selectedSkin,
  onPlay,
  onOpenShop,
  onOpenLeaderboard,
  onOpenStages,
  onOpenSettings,
  onOpenInstagram,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-stone-950/80 via-black/40 to-stone-950/90 select-none overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Creator Instagram Tag */}
        <button
          onClick={onOpenInstagram}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-stone-900/90 to-rose-950/80 backdrop-blur-md px-3.5 py-1.5 border border-rose-500/40 shadow-lg text-xs font-bold text-rose-300 hover:border-rose-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Instagram className="w-4 h-4 text-pink-400" />
          <span>@sajid.lyt</span>
          <span className="text-[10px] bg-rose-500/30 text-rose-200 px-1.5 py-0.2 rounded-full font-mono">
            CREATOR
          </span>
        </button>

        {/* Stats: Coins & High Score */}
        <div className="flex items-center gap-2">
          {/* High Score */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-2xl bg-black/60 backdrop-blur-md px-3 py-1.5 border border-amber-500/30 text-xs font-bold text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BEST: {highScore.toLocaleString()}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-yellow-500/30 text-xs font-black text-yellow-300">
            <Coins className="w-4 h-4 text-yellow-400 fill-yellow-500/30" />
            <span>{totalCoins}</span>
          </div>
        </div>
      </div>

      {/* Center Branding & Hero */}
      <div className="my-auto flex flex-col items-center text-center py-6">
        {/* Indian Ornament Motif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400"
        >
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Indian 3D Mobile Runner</span>
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          <span className="text-gold-gradient">RAN AWAY</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-1 flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-widest text-amber-200/90"
        >
          <span>THE ESCAPE BEGINS</span>
          <span className="text-amber-500">•</span>
          <span className="text-stone-400">FEATURING SAJID</span>
        </motion.div>

        {/* Active Character Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex items-center gap-3 rounded-2xl bg-stone-900/80 backdrop-blur-md px-4 py-2 border border-amber-500/30 shadow-xl"
        >
          <div
            className="w-8 h-8 rounded-full border border-amber-400 flex items-center justify-center shadow"
            style={{ backgroundColor: selectedSkin.jacketColor }}
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{selectedSkin.name}</span>
              <span className="text-[10px] text-amber-400">⚡ {selectedSkin.perk}</span>
            </div>
            <div className="text-[10px] text-stone-400">Tap Shop to switch outfits</div>
          </div>
          <button
            onClick={onOpenShop}
            className="ml-2 rounded-xl bg-stone-800 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Change
          </button>
        </motion.div>
      </div>

      {/* Bottom Main Navigation Buttons */}
      <div className="flex flex-col items-center gap-3 max-w-sm w-full mx-auto pb-4">
        {/* BIG PLAY BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onPlay}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 py-4 text-xl font-black uppercase tracking-wider text-stone-950 shadow-2xl shadow-amber-500/40 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer border border-amber-300"
        >
          <Play className="w-7 h-7 fill-stone-950 stroke-stone-950" />
          <span>PLAY NOW</span>
        </motion.button>

        {/* Secondary Menu Buttons Grid */}
        <div className="grid grid-cols-4 gap-2 w-full">
          {/* Shop */}
          <button
            onClick={onOpenShop}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-stone-900/80 backdrop-blur-md p-2.5 border border-stone-800 text-stone-300 hover:text-white hover:border-amber-500/50 hover:bg-stone-800/80 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase">Shop</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={onOpenLeaderboard}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-stone-900/80 backdrop-blur-md p-2.5 border border-stone-800 text-stone-300 hover:text-white hover:border-amber-500/50 hover:bg-stone-800/80 active:scale-95 transition-all cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase">Ranks</span>
          </button>

          {/* 7 Realms Guide */}
          <button
            onClick={onOpenStages}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-stone-900/80 backdrop-blur-md p-2.5 border border-stone-800 text-stone-300 hover:text-white hover:border-amber-500/50 hover:bg-stone-800/80 active:scale-95 transition-all cursor-pointer"
          >
            <Compass className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase">Realms</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-stone-900/80 backdrop-blur-md p-2.5 border border-stone-800 text-stone-300 hover:text-white hover:border-amber-500/50 hover:bg-stone-800/80 active:scale-95 transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5 text-stone-400" />
            <span className="text-[10px] font-bold uppercase">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
