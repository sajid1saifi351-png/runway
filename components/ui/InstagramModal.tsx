'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Sparkles, ExternalLink, Play, Heart, Award } from 'lucide-react';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-6 text-center shadow-2xl shadow-amber-500/20"
      >
        {/* Indian Torana Arch Accent Top */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-amber-500/30 to-transparent blur-xl pointer-events-none" />

        {/* Creator Badge */}
        <div className="mx-auto mb-3 flex items-center justify-center gap-1.5 w-fit rounded-full bg-amber-500/10 px-3 py-1 border border-amber-500/30 text-xs font-semibold text-amber-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Official Creator Release
        </div>

        {/* Game Title Small */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
          RAN AWAY: Indian Escape
        </h3>

        {/* Creator Spotlight */}
        <div className="my-5 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg shadow-rose-500/30">
              <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center border-2 border-stone-800">
                <Instagram className="w-12 h-12 text-pink-500" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 p-1 text-black shadow">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-wide text-white flex items-center gap-2">
            Sajid
            <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
              Creator
            </span>
          </h2>

          <a
            href="https://instagram.com/sajid.lyt"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 px-5 py-2.5 text-base font-bold text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Instagram className="w-5 h-5 text-white" />
            <span>@sajid.lyt</span>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5" />
          </a>

          <p className="mt-4 px-4 text-sm text-stone-300 leading-relaxed">
            Follow <span className="font-bold text-amber-400">@sajid.lyt</span> on Instagram for game updates, exclusive characters, and behind-the-scenes content!
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-base font-black uppercase tracking-wider text-stone-950 shadow-xl shadow-amber-500/25 transition-all hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            Enter Escape & Play
          </button>

          <a
            href="https://instagram.com/sajid.lyt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Follow @sajid.lyt on Instagram
          </a>
        </div>
      </motion.div>
    </div>
  );
};
