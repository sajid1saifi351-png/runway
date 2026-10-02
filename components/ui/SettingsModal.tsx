'use client';

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, Music, Mic, Upload, Play, Instagram, Sparkles, Monitor } from 'lucide-react';
import { soundManager } from '@/lib/soundSystem';

interface SettingsModalProps {
  isOpen: boolean;
  sfxVolume: number;
  musicVolume: number;
  voiceVolume: number;
  voiceEnabled: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
  onClose: () => void;
  onUpdateAudio: (sfx: number, music: number, voice: number, voiceEnabled: boolean) => void;
  onUpdateGraphics: (quality: 'high' | 'medium' | 'low') => void;
  onOpenInstagram: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  sfxVolume,
  musicVolume,
  voiceVolume,
  voiceEnabled,
  graphicsQuality,
  onClose,
  onUpdateAudio,
  onUpdateGraphics,
  onOpenInstagram,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        soundManager.setCustomVoiceAudio(dataUrl);
        soundManager.playStageUncomplete();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestVoice = () => {
    soundManager.playStageUncomplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative flex flex-col w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-5 shadow-2xl shadow-amber-950/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-amber-400">
              Game Settings
            </h2>
            <p className="text-xs text-stone-400">Audio, graphics & creator controls</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-stone-800 p-2 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
          {/* 1. SFX Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                Sound Effects (SFX)
              </span>
              <span className="font-mono text-amber-300">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateAudio(val, musicVolume, voiceVolume, voiceEnabled);
                soundManager.setVolumes(val, musicVolume, voiceVolume);
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 2. Music Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-300">
              <span className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-rose-400" />
                Indian Traditional Beats & Sitar
              </span>
              <span className="font-mono text-rose-300">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateAudio(sfxVolume, val, voiceVolume, voiceEnabled);
                soundManager.setVolumes(sfxVolume, val, voiceVolume);
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* 3. Character Voice Lines */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-stone-200">
                <Mic className="w-4 h-4 text-cyan-400" />
                Character Voice Lines (&quot;Uth jaa! Bhaag!&quot;)
              </span>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => {
                  const en = e.target.checked;
                  onUpdateAudio(sfxVolume, musicVolume, voiceVolume, en);
                  soundManager.setVoiceEnabled(en);
                }}
                className="h-4 w-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={handleTestVoice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-900/60 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-cyan-300" />
                Test Voice Line
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 border border-stone-700 text-xs font-semibold hover:bg-stone-700 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Custom Audio Clip
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                onChange={handleCustomAudioUpload}
                className="hidden"
              />
            </div>
            <p className="text-[10px] text-stone-400">
              Plays high-energy voice audio when stage is uncompleted / caught and on stage complete.
            </p>
          </div>

          {/* 4. Graphics Quality */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-300">
              <Monitor className="w-4 h-4 text-emerald-400" />
              Graphics & Shadow Quality
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdateGraphics(q)}
                  className={`py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                    graphicsQuality === q
                      ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Creator Showcase */}
          <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-stone-900 to-rose-950/40 p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" /> Game Creator
                </span>
                <h4 className="text-sm font-black text-white">Sajid (@sajid.lyt)</h4>
              </div>

              <button
                onClick={onOpenInstagram}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:scale-105 transition-all cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
                View ID
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-xs font-black uppercase text-stone-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
