'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameCanvas, GameCanvasHandle } from '@/components/game/GameCanvas';
import { GameHud } from '@/components/ui/GameHud';
import { HomeScreen } from '@/components/ui/HomeScreen';
import { InstagramModal } from '@/components/ui/InstagramModal';
import { ShopModal } from '@/components/ui/ShopModal';
import { SettingsModal } from '@/components/ui/SettingsModal';
import { LeaderboardModal } from '@/components/ui/LeaderboardModal';
import { StageGuideModal } from '@/components/ui/StageGuideModal';
import { GameOverModal } from '@/components/ui/GameOverModal';
import { PauseModal } from '@/components/ui/PauseModal';
import {
  PlayerProfile,
  loadPlayerProfile,
  savePlayerProfile,
  INITIAL_SKINS,
  STAGES,
  StageInfo,
  CharacterSkin,
} from '@/lib/gameState';
import { soundManager } from '@/lib/soundSystem';
import { ActivePowerupState } from '@/components/game/gameEngine';

type GameScreen = 'home' | 'playing' | 'paused' | 'gameover';

const emptySubscribe = () => () => {};
function useIsClient() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function GamePage() {
  const canvasRef = useRef<GameCanvasHandle | null>(null);

  // Hydration safety using useSyncExternalStore
  const mounted = useIsClient();

  // Player Profile State loaded lazily
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());

  // Active Screen
  const [screen, setScreen] = useState<GameScreen>('home');

  // Modals
  // User Requirement: "when someone open the game 1st step is show my Instagram id sajid.lyt"
  const [isInstagramOpen, setIsInstagramOpen] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isStagesOpen, setIsStagesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Live Game Run State
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [runCoins, setRunCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [multiplier, setMultiplier] = useState(1);
  const [currentStage, setCurrentStage] = useState<StageInfo>(STAGES[0]);
  const [activePowerups, setActivePowerups] = useState<ActivePowerupState[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Game Over Stats
  const [gameOverStats, setGameOverStats] = useState({
    score: 0,
    distance: 0,
    coins: 0,
    stageReached: 1,
  });

  // Apply audio settings on mount
  useEffect(() => {
    soundManager.setVolumes(profile.sfxVolume, profile.musicVolume, profile.voiceVolume);
    soundManager.setVoiceEnabled(profile.voiceEnabled);
  }, [profile.sfxVolume, profile.musicVolume, profile.voiceVolume, profile.voiceEnabled]);

  // Save profile updates to localStorage
  const updateProfile = useCallback((updater: (prev: PlayerProfile) => PlayerProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      savePlayerProfile(next);
      return next;
    });
  }, []);

  // Current selected skin object
  const currentSkin: CharacterSkin =
    INITIAL_SKINS.find((s) => s.id === profile.selectedSkinId) || INITIAL_SKINS[0];

  // --- GAME ACTIONS ---
  const handleStartGame = () => {
    setIsInstagramOpen(false);
    setIsShopOpen(false);
    setIsLeaderboardOpen(false);
    setIsStagesOpen(false);
    setIsSettingsOpen(false);

    setScore(0);
    setDistance(0);
    setRunCoins(0);
    setLives(3);
    setMultiplier(1);
    setCurrentStage(STAGES[0]);
    setActivePowerups([]);

    setScreen('playing');
    canvasRef.current?.restart(currentSkin);
  };

  const handlePause = () => {
    if (screen === 'playing') {
      setScreen('paused');
      canvasRef.current?.pause();
    }
  };

  const handleResume = () => {
    if (screen === 'paused') {
      setScreen('playing');
      canvasRef.current?.resume();
    }
  };

  const handleRestart = () => {
    setScore(0);
    setDistance(0);
    setRunCoins(0);
    setLives(3);
    setMultiplier(1);
    setCurrentStage(STAGES[0]);
    setActivePowerups([]);

    setScreen('playing');
    canvasRef.current?.restart(currentSkin);
  };

  const handleRevive = () => {
    if (profile.reviveTokens > 0) {
      updateProfile((p) => ({ ...p, reviveTokens: p.reviveTokens - 1 }));
    } else if (profile.totalCoins >= 50) {
      updateProfile((p) => ({ ...p, totalCoins: p.totalCoins - 50 }));
    } else {
      return;
    }

    setScreen('playing');
    canvasRef.current?.revive();
  };

  const handleHome = () => {
    soundManager.stopMusic();
    canvasRef.current?.pause();
    setScreen('home');
  };

  // --- HUD ENGINE CALLBACKS ---
  const handleScoreUpdate = useCallback(
    (newScore: number, newDistance: number, newCoins: number, newMultiplier: number) => {
      setScore(newScore);
      setDistance(newDistance);
      setRunCoins(newCoins);
      setMultiplier(newMultiplier);
    },
    []
  );

  const handleLivesUpdate = useCallback((newLives: number) => {
    setLives(newLives);
  }, []);

  const handlePowerupsUpdate = useCallback((powerups: ActivePowerupState[]) => {
    setActivePowerups(powerups);
  }, []);

  const handleStageChange = useCallback((stage: StageInfo) => {
    setCurrentStage(stage);
    updateProfile((p) => ({
      ...p,
      highestStage: Math.max(p.highestStage, stage.id),
    }));
  }, [updateProfile]);

  const handleGameOver = useCallback(
    (stats: { score: number; distance: number; coins: number; stageReached: number }) => {
      setGameOverStats(stats);
      setScreen('gameover');

      // Update persistent records
      updateProfile((p) => ({
        ...p,
        totalCoins: p.totalCoins + stats.coins,
        highScore: Math.max(p.highScore, stats.score),
        highestDistance: Math.max(p.highestDistance, stats.distance),
        highestStage: Math.max(p.highestStage, stats.stageReached),
      }));
    },
    [updateProfile]
  );

  // --- SHOP ACTIONS ---
  const handleSelectSkin = (skinId: string) => {
    updateProfile((p) => ({ ...p, selectedSkinId: skinId }));
    const skin = INITIAL_SKINS.find((s) => s.id === skinId);
    if (skin) {
      canvasRef.current?.updateSkin(skin);
    }
  };

  const handleUnlockSkin = (skin: CharacterSkin) => {
    if (profile.totalCoins >= skin.cost) {
      updateProfile((p) => ({
        ...p,
        totalCoins: p.totalCoins - skin.cost,
        unlockedSkinIds: [...p.unlockedSkinIds, skin.id],
        selectedSkinId: skin.id,
      }));
      canvasRef.current?.updateSkin(skin);
    }
  };

  const handleUpgrade = (upgradeId: string, cost: number) => {
    if (profile.totalCoins >= cost) {
      updateProfile((p) => {
        const nextLv = (p.upgrades[upgradeId] || 1) + 1;
        const newUpgrades = { ...p.upgrades, [upgradeId]: nextLv };
        canvasRef.current?.updateUpgrades(newUpgrades);
        return {
          ...p,
          totalCoins: p.totalCoins - cost,
          upgrades: newUpgrades,
        };
      });
    }
  };

  const handleBuyReviveToken = (cost: number) => {
    if (profile.totalCoins >= cost) {
      updateProfile((p) => ({
        ...p,
        totalCoins: p.totalCoins - cost,
        reviveTokens: p.reviveTokens + 1,
      }));
    }
  };

  // --- AUDIO & SETTINGS ---
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleUpdateAudio = (sfx: number, music: number, voice: number, voiceEnabled: boolean) => {
    updateProfile((p) => ({
      ...p,
      sfxVolume: sfx,
      musicVolume: music,
      voiceVolume: voice,
      voiceEnabled,
    }));
  };

  const handleUpdateGraphics = (quality: 'high' | 'medium' | 'low') => {
    updateProfile((p) => ({ ...p, graphicsQuality: quality }));
  };

  if (!mounted) {
    return (
      <main className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-center font-sans">
          <h1 className="text-3xl font-black text-amber-400 tracking-wider">RAN AWAY</h1>
          <p className="text-xs text-stone-400 mt-2">Awakening the Temple...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black font-sans select-none touch-none">
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas
        ref={canvasRef}
        skin={currentSkin}
        upgrades={profile.upgrades}
        quality={profile.graphicsQuality}
        onScoreUpdate={handleScoreUpdate}
        onLivesUpdate={handleLivesUpdate}
        onPowerupsUpdate={handlePowerupsUpdate}
        onStageChange={handleStageChange}
        onGameOver={handleGameOver}
      />

      {/* HOME SCREEN MENU */}
      {screen === 'home' && (
        <HomeScreen
          totalCoins={profile.totalCoins}
          highScore={profile.highScore}
          selectedSkin={currentSkin}
          onPlay={handleStartGame}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenStages={() => setIsStagesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenInstagram={() => setIsInstagramOpen(true)}
        />
      )}

      {/* GAME RUN HUD */}
      {screen === 'playing' && (
        <GameHud
          score={score}
          distance={distance}
          coins={runCoins}
          lives={lives}
          multiplier={multiplier}
          currentStage={currentStage}
          activePowerups={activePowerups}
          onPause={handlePause}
          onMoveLeft={() => canvasRef.current?.moveLeft()}
          onMoveRight={() => canvasRef.current?.moveRight()}
          onJump={() => canvasRef.current?.jump()}
          onSlide={() => canvasRef.current?.slide()}
        />
      )}

      {/* PAUSE MODAL */}
      <PauseModal
        isOpen={screen === 'paused'}
        isMuted={isMuted}
        onResume={handleResume}
        onRestart={handleRestart}
        onToggleMute={handleToggleMute}
        onHome={handleHome}
      />

      {/* GAME OVER MODAL */}
      {screen === 'gameover' && (
        <GameOverModal
          score={gameOverStats.score}
          bestScore={profile.highScore}
          coinsEarned={gameOverStats.coins}
          distance={gameOverStats.distance}
          stageReached={gameOverStats.stageReached}
          stageName={currentStage.name}
          reviveTokens={profile.reviveTokens}
          totalCoins={profile.totalCoins}
          onRevive={handleRevive}
          onRestart={handleRestart}
          onOpenShop={() => {
            setScreen('home');
            setIsShopOpen(true);
          }}
          onHome={handleHome}
        />
      )}

      {/* STEP 1: INSTAGRAM SHOWCASE MODAL (@sajid.lyt) */}
      <InstagramModal
        isOpen={isInstagramOpen}
        onClose={() => {
          setIsInstagramOpen(false);
          updateProfile((p) => ({ ...p, hasSeenInstagramIntro: true }));
        }}
      />

      {/* SHOP & CHARACTERS MODAL */}
      <ShopModal
        isOpen={isShopOpen}
        totalCoins={profile.totalCoins}
        selectedSkinId={profile.selectedSkinId}
        unlockedSkinIds={profile.unlockedSkinIds}
        upgrades={profile.upgrades}
        reviveTokens={profile.reviveTokens}
        onClose={() => setIsShopOpen(false)}
        onSelectSkin={handleSelectSkin}
        onUnlockSkin={handleUnlockSkin}
        onUpgrade={handleUpgrade}
        onBuyReviveToken={handleBuyReviveToken}
      />

      {/* ALL-INDIA LEADERBOARDS MODAL */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        userHighScore={profile.highScore}
        userDistance={profile.highestDistance}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* 7 SACRED REALMS STAGE GUIDE MODAL */}
      <StageGuideModal
        isOpen={isStagesOpen}
        onClose={() => setIsStagesOpen(false)}
      />

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        sfxVolume={profile.sfxVolume}
        musicVolume={profile.musicVolume}
        voiceVolume={profile.voiceVolume}
        voiceEnabled={profile.voiceEnabled}
        graphicsQuality={profile.graphicsQuality}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateAudio={handleUpdateAudio}
        onUpdateGraphics={handleUpdateGraphics}
        onOpenInstagram={() => {
          setIsSettingsOpen(false);
          setIsInstagramOpen(true);
        }}
      />
    </main>
  );
}
