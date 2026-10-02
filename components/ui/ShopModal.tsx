'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Coins, Sparkles, Shield, Zap, Magnet, HeartPulse, Check, Lock } from 'lucide-react';
import { CharacterSkin, INITIAL_SKINS, INITIAL_UPGRADES, UpgradeItem } from '@/lib/gameState';
import { soundManager } from '@/lib/soundSystem';

interface ShopModalProps {
  isOpen: boolean;
  totalCoins: number;
  selectedSkinId: string;
  unlockedSkinIds: string[];
  upgrades: Record<string, number>;
  reviveTokens: number;
  onClose: () => void;
  onSelectSkin: (skinId: string) => void;
  onUnlockSkin: (skin: CharacterSkin) => void;
  onUpgrade: (upgradeId: string, cost: number) => void;
  onBuyReviveToken: (cost: number) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  totalCoins,
  selectedSkinId,
  unlockedSkinIds,
  upgrades,
  reviveTokens,
  onClose,
  onSelectSkin,
  onUnlockSkin,
  onUpgrade,
  onBuyReviveToken,
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'upgrades' | 'items'>('characters');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative flex flex-col w-full max-w-xl max-h-[90vh] overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-5 shadow-2xl shadow-amber-950/40"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-amber-400">
              Indian Bazaar & Upgrades
            </h2>
            <p className="text-xs text-stone-400">Unlock styles, gear & sacred powers</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins Balance */}
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 border border-amber-500/40">
              <Coins className="w-4 h-4 text-yellow-400 fill-yellow-500" />
              <span className="font-mono text-base font-black text-yellow-300">
                {totalCoins}
              </span>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-stone-800 p-2 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-2 my-3">
          <button
            onClick={() => setActiveTab('characters')}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'characters'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Outfits ({INITIAL_SKINS.length})
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'upgrades'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Power-Ups
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'items'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Revives ({reviveTokens})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-3">
          {/* CHARACTERS TAB */}
          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_SKINS.map((skin) => {
                const isUnlocked = unlockedSkinIds.includes(skin.id);
                const isSelected = selectedSkinId === skin.id;
                const canAfford = totalCoins >= skin.cost;

                return (
                  <div
                    key={skin.id}
                    className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                        : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      {/* Color Palette Indicators */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-4 h-4 rounded-full border border-stone-600 shadow"
                          style={{ backgroundColor: skin.jacketColor }}
                          title="Jacket"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-stone-600 shadow"
                          style={{ backgroundColor: skin.pantsColor }}
                          title="Cargo"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-stone-600 shadow"
                          style={{ backgroundColor: skin.shoeColor }}
                          title="Sneakers"
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-stone-600 shadow"
                          style={{ backgroundColor: skin.backpackColor }}
                          title="Backpack"
                        />
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest ml-auto font-mono">
                          {skin.id.replace('sajid_', '')}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{skin.name}</h3>
                      <p className="text-xs text-amber-300/80 mb-2">{skin.title}</p>
                      <p className="text-xs text-stone-400 bg-stone-950/60 p-2 rounded-xl border border-stone-800/80">
                        ⚡ {skin.perk}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                      {isUnlocked ? (
                        isSelected ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                            <Check className="w-4 h-4" /> Equipped
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectSkin(skin.id);
                              soundManager.playPowerup();
                            }}
                            className="w-full py-2 rounded-xl bg-stone-800 text-xs font-bold text-stone-200 hover:bg-stone-700 active:scale-95 transition-all cursor-pointer"
                          >
                            Equip Outfit
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              onUnlockSkin(skin);
                              soundManager.playPowerup();
                            }
                          }}
                          disabled={!canAfford}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock for {skin.cost}</span>
                          <Coins className="w-3.5 h-3.5 text-yellow-400" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* UPGRADES TAB */}
          {activeTab === 'upgrades' && (
            <div className="space-y-3">
              {INITIAL_UPGRADES.map((item: UpgradeItem) => {
                const currentLevel = upgrades[item.id] || 1;
                const isMax = currentLevel >= item.maxLevel;
                const cost = !isMax ? item.costPerLevel[currentLevel - 1] : 0;
                const canAfford = totalCoins >= cost;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-stone-800 bg-stone-900/60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/30 text-amber-400">
                        {item.id === 'magnet' && <Magnet className="w-6 h-6" />}
                        {item.id === 'shield' && <Shield className="w-6 h-6" />}
                        {item.id === 'boost' && <Zap className="w-6 h-6" />}
                        {item.id === 'doubleCoins' && <Coins className="w-6 h-6" />}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {item.name}
                          <span className="text-xs text-amber-400 font-mono">
                            Lv {currentLevel}/{item.maxLevel}
                          </span>
                        </h4>
                        <p className="text-xs text-stone-400 mt-0.5">{item.description}</p>

                        {/* Level Bars */}
                        <div className="flex gap-1.5 mt-2">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`h-1.5 w-6 rounded-full ${
                                lvl <= currentLevel ? 'bg-amber-400' : 'bg-stone-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isMax ? (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                          MAX LEVEL
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              onUpgrade(item.id, cost);
                              soundManager.playPowerup();
                            }
                          }}
                          disabled={!canAfford}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <span>Upgrade</span>
                          <span className="font-mono text-yellow-300">({cost}</span>
                          <Coins className="w-3.5 h-3.5 text-yellow-300" />
                          <span>)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ITEMS / REVIVES TAB */}
          {activeTab === 'items' && (
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 to-stone-900/80">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-rose-500/20 p-3 border border-rose-500/40 text-rose-400">
                  <HeartPulse className="w-8 h-8 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white">Amrita Revive Lotus Token</h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Instantly revives Sajid when caught by the Yaksha Guardian with an automatic 5-second protective shield!
                  </p>
                  <div className="mt-2 text-xs font-semibold text-rose-300">
                    Current Inventory: <span className="font-mono font-bold text-amber-300">{reviveTokens}</span> tokens
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between">
                <span className="text-xs text-stone-400">Cost: 100 Coins each</span>
                <button
                  onClick={() => {
                    if (totalCoins >= 100) {
                      onBuyReviveToken(100);
                      soundManager.playPowerup();
                    }
                  }}
                  disabled={totalCoins < 100}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    totalCoins >= 100
                      ? 'bg-rose-500 text-white hover:bg-rose-600 hover:scale-105 active:scale-95 shadow-md shadow-rose-500/30'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Buy Amrita (100 Coins)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
