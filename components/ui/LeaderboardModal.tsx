'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Medal, Flame, Compass, Coins } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  userHighScore: number;
  userDistance: number;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  userHighScore,
  userDistance,
  onClose,
}) => {
  if (!isOpen) return null;

  const mockLeaderboard = [
    { rank: 1, name: 'Sajid (Master)', score: 142850, distance: 4820, badge: 'Yaksha Slayer', avatar: '👑' },
    { rank: 2, name: 'Arjun_Run', score: 118400, distance: 3950, badge: 'Royal Fort Raider', avatar: '⚡' },
    { rank: 3, name: 'Priya_Adventures', score: 94200, distance: 3200, badge: 'Jungle Phantom', avatar: '🌿' },
    { rank: 4, name: 'Kabir_Speed', score: 78500, distance: 2650, badge: 'Desert Nomad', avatar: '🔥' },
    { rank: 5, name: 'Ananya_V', score: 62100, distance: 2100, badge: 'Temple Explorer', avatar: '✨' },
  ];

  // Insert user entry
  const userRank = userHighScore > 142850 ? 1 : userHighScore > 118400 ? 2 : userHighScore > 94200 ? 3 : userHighScore > 78500 ? 4 : userHighScore > 62100 ? 5 : 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative flex flex-col w-full max-w-md max-h-[85vh] overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-5 shadow-2xl shadow-amber-950/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-amber-400">
                All-India Leaderboard
              </h2>
              <p className="text-xs text-stone-400">Top temple escape runners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-stone-800 p-2 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Rank Card */}
        <div className="my-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 p-3 border border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">
              #{userRank}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                You (Sajid Explorer)
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-mono">YOU</span>
              </div>
              <div className="text-[10px] text-stone-400 flex items-center gap-2">
                <span>Dist: {userDistance}m</span>
              </div>
            </div>
          </div>
          <div className="font-mono text-base font-black text-amber-300">
            {userHighScore.toLocaleString()}
          </div>
        </div>

        {/* Leaderboard Entries List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {mockLeaderboard.map((item) => (
            <div
              key={item.rank}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                item.rank === 1
                  ? 'border-yellow-500/40 bg-yellow-500/10'
                  : item.rank === 2
                  ? 'border-stone-400/40 bg-stone-500/10'
                  : item.rank === 3
                  ? 'border-amber-700/40 bg-amber-700/10'
                  : 'border-stone-800 bg-stone-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold w-5 text-center text-stone-400">
                  {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                </span>
                <div>
                  <div className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <span>{item.name}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-2">
                    <span className="text-amber-400/90">{item.badge}</span>
                    <span>• {item.distance}m</span>
                  </div>
                </div>
              </div>

              <span className="font-mono text-xs sm:text-sm font-bold text-amber-300">
                {item.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-800 text-xs font-bold text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};
