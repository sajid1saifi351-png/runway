'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Flame, ShieldAlert, Zap, Compass } from 'lucide-react';
import { STAGES } from '@/lib/gameState';

interface StageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StageGuideModal: React.FC<StageGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative flex flex-col w-full max-w-xl max-h-[88vh] overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-5 shadow-2xl shadow-amber-950/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-amber-400">
                The 7 Sacred Realms
              </h2>
              <p className="text-xs text-stone-400">Stages, environments & mythical dangers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-stone-800 p-2 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stages List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {STAGES.map((stg) => (
            <div
              key={stg.id}
              className="p-3.5 rounded-2xl border border-stone-800 bg-stone-900/60 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-black text-amber-400 font-mono">
                    {stg.id}
                  </span>
                  <h3 className="text-sm font-bold text-white">{stg.name}</h3>
                  <span className="text-xs text-stone-400 font-mono">• {stg.minDistance}m+</span>
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Speed x{stg.speedMultiplier}
                </span>
              </div>

              <div className="text-xs text-amber-400/90 font-medium">
                {stg.subtitle}
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                {stg.themeDescription}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-xs font-black uppercase text-stone-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Understood, Let&apos;s Run!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
