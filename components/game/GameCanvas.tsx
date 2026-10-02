'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { GameEngine, ActivePowerupState, GameEngineCallbacks } from './gameEngine';
import { CharacterSkin, StageInfo } from '@/lib/gameState';

export interface GameCanvasHandle {
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: (skin: CharacterSkin) => void;
  revive: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  slide: () => void;
  updateSkin: (skin: CharacterSkin) => void;
  updateUpgrades: (upgrades: Record<string, number>) => void;
}

interface GameCanvasProps {
  skin: CharacterSkin;
  upgrades: Record<string, number>;
  quality: 'high' | 'medium' | 'low';
  onScoreUpdate: (score: number, distance: number, coins: number, multiplier: number) => void;
  onLivesUpdate: (lives: number) => void;
  onPowerupsUpdate: (powerups: ActivePowerupState[]) => void;
  onStageChange: (stage: StageInfo) => void;
  onGameOver: (stats: { score: number; distance: number; coins: number; stageReached: number }) => void;
}

export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  (
    {
      skin,
      upgrades,
      quality,
      onScoreUpdate,
      onLivesUpdate,
      onPowerupsUpdate,
      onStageChange,
      onGameOver,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    // Save stable callback refs
    const callbacksRef = useRef<GameEngineCallbacks>({
      onScoreUpdate,
      onLivesUpdate,
      onPowerupsUpdate,
      onStageChange,
      onGameOver,
    });

    useEffect(() => {
      callbacksRef.current = {
        onScoreUpdate,
        onLivesUpdate,
        onPowerupsUpdate,
        onStageChange,
        onGameOver,
      };
    }, [onScoreUpdate, onLivesUpdate, onPowerupsUpdate, onStageChange, onGameOver]);

    useEffect(() => {
      if (!containerRef.current) return;

      const engine = new GameEngine(
        containerRef.current,
        skin,
        upgrades,
        {
          onScoreUpdate: (s, d, c, m) => callbacksRef.current.onScoreUpdate(s, d, c, m),
          onLivesUpdate: (l) => callbacksRef.current.onLivesUpdate(l),
          onPowerupsUpdate: (p) => callbacksRef.current.onPowerupsUpdate(p),
          onStageChange: (stg) => callbacksRef.current.onStageChange(stg),
          onGameOver: (stats) => callbacksRef.current.onGameOver(stats),
        },
        quality
      );

      engineRef.current = engine;

      return () => {
        engine.destroy();
        engineRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quality]);

    useImperativeHandle(ref, () => ({
      start: () => engineRef.current?.start(),
      pause: () => engineRef.current?.pause(),
      resume: () => engineRef.current?.resume(),
      restart: (s: CharacterSkin) => engineRef.current?.restart(s),
      revive: () => engineRef.current?.revive(),
      moveLeft: () => engineRef.current?.moveLeft(),
      moveRight: () => engineRef.current?.moveRight(),
      jump: () => engineRef.current?.jump(),
      slide: () => engineRef.current?.slide(),
      updateSkin: (s: CharacterSkin) => engineRef.current?.updateSkin(s),
      updateUpgrades: (u: Record<string, number>) => engineRef.current?.updateUpgrades(u),
    }));

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden touch-none"
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';
