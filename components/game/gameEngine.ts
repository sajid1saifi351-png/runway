import * as THREE from 'three';
import { CharacterModel } from './characterModel';
import { ChaserModel } from './chaserModel';
import { TrackManager, LANE_WIDTH, ActiveObstacle, ActiveCoin, ActivePowerup } from './trackManager';
import { CharacterSkin, StageInfo, STAGES } from '@/lib/gameState';
import { soundManager } from '@/lib/soundSystem';

export interface ActivePowerupState {
  type: string;
  remainingTime: number;
  duration: number;
}

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, distance: number, coins: number, multiplier: number) => void;
  onLivesUpdate: (lives: number) => void;
  onPowerupsUpdate: (powerups: ActivePowerupState[]) => void;
  onStageChange: (stage: StageInfo) => void;
  onGameOver: (stats: { score: number; distance: number; coins: number; stageReached: number }) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;

  private character: CharacterModel;
  private chaser: ChaserModel;
  private trackManager: TrackManager;
  private callbacks: GameEngineCallbacks;

  // Running State
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  // Player Kinematics
  private currentLane: number = 0; // -1, 0, 1
  private targetX: number = 0;
  private playerX: number = 0;
  private playerY: number = 0;
  private playerZ: number = 0;

  private baseSpeed: number = 18; // units per second
  private speedMultiplier: number = 1;
  private distance: number = 0;
  private score: number = 0;
  private coins: number = 0;
  private lives: number = 3;

  // Jump & Slide State
  private isJumping: boolean = false;
  private jumpTimer: number = 0;
  private jumpDuration: number = 0.65;

  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private slideDuration: number = 0.65;

  private isStumbling: boolean = false;
  private stumbleTimer: number = 0;

  // Active Power-up Timers
  private magnetTimer: number = 0;
  private shieldTimer: number = 0;
  private boostTimer: number = 0;
  private doubleCoinsTimer: number = 0;
  private slowmoTimer: number = 0;

  // Upgrades
  private upgrades: Record<string, number> = {
    magnet: 1,
    shield: 1,
    boost: 1,
    doubleCoins: 1,
  };

  // Camera Shake
  private cameraShake: number = 0;

  // Touch Handling
  private touchStartX: number = 0;
  private touchStartY: number = 0;

  constructor(
    container: HTMLElement,
    skin: CharacterSkin,
    upgrades: Record<string, number>,
    callbacks: GameEngineCallbacks,
    quality: 'high' | 'medium' | 'low' = 'high'
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.upgrades = upgrades;

    // 1. Scene
    this.scene = new THREE.Scene();
    const initialStage = STAGES[0];
    this.scene.background = new THREE.Color(initialStage.skyColor);
    this.scene.fog = new THREE.FogExp2(initialStage.fogColor, 0.015);

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 400);
    this.camera.position.set(0, 4.2, -6.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: quality === 'high',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.25));
    this.renderer.shadowMap.enabled = quality !== 'low';
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, initialStage.ambientIntensity);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    this.dirLight.position.set(15, 25, -15);
    this.dirLight.castShadow = quality !== 'low';
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 70;
    this.dirLight.shadow.camera.left = -15;
    this.dirLight.shadow.camera.right = 15;
    this.dirLight.shadow.camera.top = 20;
    this.dirLight.shadow.camera.bottom = -10;
    this.scene.add(this.dirLight);

    // 5. Track Manager
    this.trackManager = new TrackManager(this.scene);
    this.trackManager.reset();

    // 6. Character & Chaser
    this.character = new CharacterModel(skin);
    this.scene.add(this.character.group);

    this.chaser = new ChaserModel();
    this.scene.add(this.chaser.group);

    // 7. Event Listeners
    this.bindEvents();
  }

  public updateSkin(skin: CharacterSkin) {
    this.character.updateSkin(skin);
  }

  public updateUpgrades(upgrades: Record<string, number>) {
    this.upgrades = upgrades;
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    soundManager.startMusic(0, 1.0);
    this.loop(this.lastTime);
  }

  public pause() {
    this.isPaused = true;
    soundManager.stopMusic();
  }

  public resume() {
    if (!this.isRunning) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    soundManager.startMusic(this.trackManager.currentStageIndex, this.speedMultiplier);
    this.loop(this.lastTime);
  }

  public restart(skin: CharacterSkin) {
    this.character.updateSkin(skin);
    this.playerX = 0;
    this.playerY = 0;
    this.playerZ = 0;
    this.currentLane = 0;
    this.targetX = 0;

    this.distance = 0;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.speedMultiplier = 1;

    this.isJumping = false;
    this.isSliding = false;
    this.isStumbling = false;

    this.magnetTimer = 0;
    this.shieldTimer = 0;
    this.boostTimer = 0;
    this.doubleCoinsTimer = 0;
    this.slowmoTimer = 0;

    this.trackManager.reset();
    this.chaser.setProximity(false);
    this.character.shieldMesh.visible = false;
    this.character.boostAura.visible = false;

    this.callbacks.onLivesUpdate(this.lives);
    this.callbacks.onScoreUpdate(0, 0, 0, 1);
    this.callbacks.onStageChange(STAGES[0]);

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    soundManager.startMusic(0, 1.0);
    this.loop(this.lastTime);
  }

  public revive() {
    this.lives = 1;
    this.isRunning = true;
    this.isPaused = false;
    this.isStumbling = false;
    this.shieldTimer = 5; // 5 seconds grace shield after revive
    this.character.shieldMesh.visible = true;
    this.chaser.setProximity(false);

    this.callbacks.onLivesUpdate(this.lives);
    this.lastTime = performance.now();
    soundManager.startMusic(this.trackManager.currentStageIndex, this.speedMultiplier);
    this.loop(this.lastTime);
  }

  // --- CONTROLS ---
  public moveLeft() {
    if (!this.isRunning || this.isPaused) return;
    if (this.currentLane > -1) {
      this.currentLane--;
      this.targetX = this.currentLane * LANE_WIDTH;
    }
  }

  public moveRight() {
    if (!this.isRunning || this.isPaused) return;
    if (this.currentLane < 1) {
      this.currentLane++;
      this.targetX = this.currentLane * LANE_WIDTH;
    }
  }

  public jump() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpTimer = 0;
      this.isSliding = false; // Cancel slide on jump
      soundManager.playJump();
    }
  }

  public slide() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = 0;
      this.isJumping = false; // Fast drop if in air
      this.playerY = 0;
      soundManager.playSlide();
    }
  }

  // --- MAIN GAME LOOP ---
  private loop = (currentTime: number) => {
    if (!this.isRunning || this.isPaused) return;

    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(delta);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(delta: number) {
    const time = performance.now() * 0.001;

    // Power-up count downs
    this.updatePowerupTimers(delta);

    // Speed calculation
    const boostFactor = this.boostTimer > 0 ? 1.6 : 1.0;
    const slowmoFactor = this.slowmoTimer > 0 ? 0.6 : 1.0;
    const currentSpeed =
      (this.baseSpeed + Math.min(this.distance * 0.008, 14)) *
      this.speedMultiplier *
      boostFactor *
      slowmoFactor;

    // Progress forward in Z
    const dz = currentSpeed * delta;
    this.playerZ += dz;
    this.distance += dz;

    // Multipliers & Score
    const coinMultiplier = this.doubleCoinsTimer > 0 ? 2 : 1;
    this.score += Math.floor(dz * 2 * coinMultiplier);
    this.callbacks.onScoreUpdate(this.score, Math.floor(this.distance), this.coins, coinMultiplier);

    // Smooth horizontal lane transition
    this.playerX += (this.targetX - this.playerX) * Math.min(delta * 14, 1);

    // Jump Physics
    if (this.isJumping) {
      this.jumpTimer += delta;
      const progress = Math.min(this.jumpTimer / this.jumpDuration, 1);
      this.playerY = Math.sin(progress * Math.PI) * 2.3;
      if (progress >= 1) {
        this.isJumping = false;
        this.playerY = 0;
      }
    }

    // Slide Physics
    if (this.isSliding) {
      this.slideTimer += delta;
      const progress = Math.min(this.slideTimer / this.slideDuration, 1);
      if (progress >= 1) {
        this.isSliding = false;
      }
    }

    // Stumble Recovery
    if (this.isStumbling) {
      this.stumbleTimer -= delta;
      if (this.stumbleTimer <= 0) {
        this.isStumbling = false;
        this.chaser.setProximity(false);
      }
    }

    // Update 3D Character Position & Rotation
    this.character.group.position.set(this.playerX, this.playerY, this.playerZ);

    // Dynamic lane-change banking tilt
    const laneTilt = (this.targetX - this.playerX) * -0.15;
    this.character.group.rotation.z = laneTilt;

    // Character Animation
    let animState: 'run' | 'jump' | 'slide' | 'stumble' | 'dead' | 'boost' = 'run';
    if (this.boostTimer > 0) animState = 'boost';
    else if (this.isJumping) animState = 'jump';
    else if (this.isSliding) animState = 'slide';
    else if (this.isStumbling) animState = 'stumble';

    this.character.animate(
      animState,
      time,
      this.isJumping ? this.jumpTimer / this.jumpDuration : 0,
      this.isSliding ? this.slideTimer / this.slideDuration : 0
    );

    // Update Chaser Position & Proximity
    this.chaser.animate(time, currentSpeed, this.playerX, this.playerZ);

    // Update Track Chunks & Stage
    const stageUpdate = this.trackManager.update(this.playerZ, this.distance);
    if (stageUpdate.stageChanged) {
      this.applyStageTransition(stageUpdate.newStage);
    }

    // Check Collisions (Obstacles & Collectibles)
    this.checkCollisions();

    // Camera Positioning & Smooth Follow
    this.updateCamera(delta);
  }

  private updatePowerupTimers(delta: number) {
    const activeList: ActivePowerupState[] = [];

    if (this.magnetTimer > 0) {
      this.magnetTimer -= delta;
      const dur = 8 + (this.upgrades.magnet || 1) * 2;
      activeList.push({ type: 'magnet', remainingTime: this.magnetTimer, duration: dur });
    }

    if (this.shieldTimer > 0) {
      this.shieldTimer -= delta;
      const dur = 10 + (this.upgrades.shield || 1) * 2;
      activeList.push({ type: 'shield', remainingTime: this.shieldTimer, duration: dur });
      this.character.shieldMesh.visible = true;
    } else {
      this.character.shieldMesh.visible = false;
    }

    if (this.boostTimer > 0) {
      this.boostTimer -= delta;
      const dur = 6 + (this.upgrades.boost || 1) * 1.5;
      activeList.push({ type: 'boost', remainingTime: this.boostTimer, duration: dur });
      this.character.boostAura.visible = true;
    } else {
      this.character.boostAura.visible = false;
    }

    if (this.doubleCoinsTimer > 0) {
      this.doubleCoinsTimer -= delta;
      const dur = 12 + (this.upgrades.doubleCoins || 1) * 2;
      activeList.push({ type: 'doubleCoins', remainingTime: this.doubleCoinsTimer, duration: dur });
    }

    if (this.slowmoTimer > 0) {
      this.slowmoTimer -= delta;
      activeList.push({ type: 'slowmo', remainingTime: this.slowmoTimer, duration: 6 });
    }

    this.callbacks.onPowerupsUpdate(activeList);
  }

  private checkCollisions() {
    const playerBounds = {
      xMin: this.playerX - 0.45,
      xMax: this.playerX + 0.45,
      yMin: this.playerY,
      yMax: this.playerY + (this.isSliding ? 0.75 : 1.9),
      zMin: this.playerZ - 0.4,
      zMax: this.playerZ + 0.4,
    };

    // Magnet coin attraction radius
    const magnetRadius = this.magnetTimer > 0 ? 10 + (this.upgrades.magnet || 1) * 2 : 0;

    for (const chunk of this.trackManager.chunks) {
      // 1. Coins
      for (const coin of chunk.coins) {
        if (coin.collected) continue;

        // Magnet attraction
        if (magnetRadius > 0) {
          const dist = Math.hypot(coin.x - this.playerX, coin.y - this.playerY, coin.z - this.playerZ);
          if (dist < magnetRadius) {
            coin.x += (this.playerX - coin.x) * 0.25;
            coin.y += (this.playerY + 1.0 - coin.y) * 0.25;
            coin.z += (this.playerZ - coin.z) * 0.25;
            coin.mesh.position.set(coin.x, coin.y, coin.z);
          }
        }

        // Direct pickup check
        if (
          Math.abs(coin.z - this.playerZ) < 0.9 &&
          Math.abs(coin.x - this.playerX) < 1.0 &&
          Math.abs(coin.y - (this.playerY + 0.9)) < 1.2
        ) {
          coin.collected = true;
          coin.mesh.visible = false;
          const coinValue = this.doubleCoinsTimer > 0 ? 2 : 1;
          this.coins += coinValue;
          this.score += 50 * coinValue;
          soundManager.playCoin();
        }
      }

      // 2. Power-ups
      for (const pu of chunk.powerups) {
        if (pu.collected) continue;
        if (
          Math.abs(pu.z - this.playerZ) < 1.1 &&
          Math.abs(pu.x - this.playerX) < 1.1 &&
          Math.abs(pu.y - (this.playerY + 0.9)) < 1.4
        ) {
          pu.collected = true;
          pu.mesh.visible = false;
          this.activatePowerup(pu.type);
          soundManager.playPowerup();
        }
      }

      // 3. Obstacles
      for (const obs of chunk.obstacles) {
        if (obs.passed) continue;

        // If player has moved past obstacle
        if (this.playerZ > obs.z + obs.depth / 2 + 1) {
          obs.passed = true;
          continue;
        }

        // Check bounding box intersection
        const obsXMin = obs.lane === 99 ? -LANE_WIDTH * 1.5 : obs.lane * LANE_WIDTH - obs.width / 2;
        const obsXMax = obs.lane === 99 ? LANE_WIDTH * 1.5 : obs.lane * LANE_WIDTH + obs.width / 2;
        const obsZMin = obs.z - obs.depth / 2;
        const obsZMax = obs.z + obs.depth / 2;

        const xOverlap = playerBounds.xMax >= obsXMin && playerBounds.xMin <= obsXMax;
        const zOverlap = playerBounds.zMax >= obsZMin && playerBounds.zMin <= obsZMax;

        if (xOverlap && zOverlap) {
          let hit = false;

          if (obs.type === 'JUMP_LOW') {
            // Need to be jumping high enough
            if (this.playerY < 1.1) {
              hit = true;
            }
          } else if (obs.type === 'SLIDE_HIGH') {
            // Need to be sliding low enough
            if (!this.isSliding || this.playerY > 0.4) {
              hit = true;
            }
          } else if (obs.type === 'LANE_BLOCK') {
            // Full blockage in this lane
            hit = true;
          }

          if (hit) {
            obs.passed = true;
            this.handleObstacleHit(obs);
          }
        }
      }
    }
  }

  private activatePowerup(type: string) {
    if (type === 'magnet') {
      this.magnetTimer = 8 + (this.upgrades.magnet || 1) * 2;
    } else if (type === 'shield') {
      this.shieldTimer = 10 + (this.upgrades.shield || 1) * 2;
    } else if (type === 'boost') {
      this.boostTimer = 6 + (this.upgrades.boost || 1) * 1.5;
    } else if (type === 'doubleCoins') {
      this.doubleCoinsTimer = 12 + (this.upgrades.doubleCoins || 1) * 2;
    } else if (type === 'revive') {
      this.lives = Math.min(3, this.lives + 1);
      this.callbacks.onLivesUpdate(this.lives);
    }
  }

  private handleObstacleHit(obs: ActiveObstacle) {
    // 1. If Boost active: smash obstacle safely!
    if (this.boostTimer > 0) {
      soundManager.playCrash();
      this.cameraShake = 0.4;
      return;
    }

    // 2. If Shield active: break shield safely!
    if (this.shieldTimer > 0) {
      this.shieldTimer = 0;
      this.character.shieldMesh.visible = false;
      soundManager.playShieldBreak();
      this.cameraShake = 0.5;
      return;
    }

    // 3. Take Damage / Stumble
    this.lives--;
    this.callbacks.onLivesUpdate(this.lives);
    this.cameraShake = 0.8;

    if (this.lives > 0) {
      // Stumble: guardian rushes closer!
      this.isStumbling = true;
      this.stumbleTimer = 2.0;
      this.chaser.setProximity(true);
      soundManager.playChaserRoar();
      soundManager.playCrash();
    } else {
      // Lethal crash / caught by Yaksha!
      this.triggerGameOver();
    }
  }

  private triggerGameOver() {
    this.isRunning = false;
    soundManager.stopMusic();
    this.character.animate('dead', 0, 0, 0);
    this.chaser.targetDistance = 1.0; // Pounces on Sajid!

    // Play requested audio voice line for Stage Uncomplete ("Uth jaa! Bhaag!")
    soundManager.playStageUncomplete();

    setTimeout(() => {
      this.callbacks.onGameOver({
        score: this.score,
        distance: Math.floor(this.distance),
        coins: this.coins,
        stageReached: this.trackManager.currentStageIndex + 1,
      });
    }, 1200);
  }

  private applyStageTransition(newStage: StageInfo) {
    // Smoothly blend sky and fog
    this.scene.background = new THREE.Color(newStage.skyColor);
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).color.set(newStage.fogColor);
    }
    this.ambientLight.intensity = newStage.ambientIntensity;
    this.speedMultiplier = newStage.speedMultiplier;

    // Celebratory audio & voice line
    soundManager.playStageComplete();
    this.callbacks.onStageChange(newStage);
  }

  private updateCamera(delta: number) {
    // Camera smoothly follows player X, Z
    const targetCamX = this.playerX * 0.7;
    const targetCamY = 3.8 + (this.playerY * 0.35); // Dampen jump camera bobbing
    const targetCamZ = this.playerZ - 6.2;

    this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(delta * 10, 1);
    this.camera.position.y += (targetCamY - this.camera.position.y) * Math.min(delta * 8, 1);
    this.camera.position.z = targetCamZ;

    // Camera Shake
    if (this.cameraShake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake = Math.max(0, this.cameraShake - delta * 2.5);
    }

    // Dynamic FOV widening during speed boost
    const targetFov = this.boostTimer > 0 ? 82 : 65;
    if (Math.abs(this.camera.fov - targetFov) > 0.5) {
      this.camera.fov += (targetFov - this.camera.fov) * delta * 5;
      this.camera.updateProjectionMatrix();
    }

    // Camera looks slightly ahead of Sajid
    this.camera.lookAt(this.playerX * 0.4, 1.8 + this.playerY * 0.5, this.playerZ + 8);

    // Directional light tracks with player
    this.dirLight.position.set(this.playerX + 15, 25, this.playerZ - 15);
    this.dirLight.target.position.set(this.playerX, 0, this.playerZ + 15);
    this.dirLight.target.updateMatrixWorld();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  // --- TOUCH & KEYBOARD EVENTS ---
  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleResize);

    const dom = this.container;
    dom.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    dom.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.moveLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.moveRight();
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      e.preventDefault();
      this.jump();
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      this.slide();
    }
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  };

  private handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - this.touchStartX;
    const deltaY = e.changedTouches[0].clientY - this.touchStartY;
    const minSwipeDist = 32;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDist) {
        if (deltaX < 0) this.moveLeft();
        else this.moveRight();
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDist) {
        if (deltaY < 0) this.jump();
        else this.slide();
      }
    }
  };

  private handleResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    soundManager.stopMusic();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);

    const dom = this.container;
    dom.removeEventListener('touchstart', this.handleTouchStart);
    dom.removeEventListener('touchend', this.handleTouchEnd);

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
