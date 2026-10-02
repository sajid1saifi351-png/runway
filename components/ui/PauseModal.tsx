'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleMute: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  isMuted,
  onResume,
  onRestart,
  onToggleMute,
  onHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl border border-amber-500/40 bg-stone-950 p-6 text-center shadow-2xl shadow-amber-950/40"
      >
        <h2 className="text-2xl font-black uppercase tracking-wider text-amber-400 mb-1">
          Game Paused
        </h2>
        <p className="text-xs text-stone-400 mb-6">
          Catch your breath! The Yaksha is waiting in the shadows.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-base font-black uppercase text-stone-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            Resume Escape
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 border border-stone-700 py-3 text-sm font-bold text-stone-200 hover:bg-stone-800 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Run
          </button>

          <button
            onClick={onToggleMute}
            className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 border border-stone-700 py-3 text-sm font-bold text-stone-200 hover:bg-stone-800 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            {isMuted ? 'Sound: Muted' : 'Sound: Active'}
          </button>

          <button
            onClick={onHome}
            className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 border border-stone-700 py-3 text-sm font-bold text-stone-200 hover:bg-stone-800 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            Quit to Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
};
