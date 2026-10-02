import * as THREE from 'three';
import { STAGES, StageInfo } from '@/lib/gameState';

export type ObstacleType = 'JUMP_LOW' | 'SLIDE_HIGH' | 'LANE_BLOCK' | 'BROKEN_BRIDGE';
export type PowerUpType = 'magnet' | 'shield' | 'boost' | 'doubleCoins' | 'revive';

export interface ActiveObstacle {
  type: ObstacleType;
  lane: number; // -1: Left, 0: Center, 1: Right, 99: All lanes (like a wide log or arch)
  z: number;
  width: number;
  height: number;
  depth: number;
  mesh: THREE.Object3D;
  passed: boolean;
}

export interface ActiveCoin {
  lane: number;
  x: number;
  y: number;
  z: number;
  mesh: THREE.Mesh;
  collected: boolean;
}

export interface ActivePowerup {
  type: PowerUpType;
  lane: number;
  x: number;
  y: number;
  z: number;
  mesh: THREE.Group;
  collected: boolean;
}

export interface TrackChunk {
  zStart: number;
  zEnd: number;
  stageId: number;
  group: THREE.Group;
  obstacles: ActiveObstacle[];
  coins: ActiveCoin[];
  powerups: ActivePowerup[];
  torches: THREE.PointLight[];
}

export const LANE_WIDTH = 2.2;
export const CHUNK_LENGTH = 30;

export class TrackManager {
  private scene: THREE.Scene;
  public chunks: TrackChunk[] = [];
  private nextChunkZ: number = 0;
  public currentStageIndex: number = 0;

  // Shared Geometries & Materials for efficiency
  private coinGeo: THREE.CylinderGeometry;
  private coinMat: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // Glowing Indian gold coin geometry (Chakra coin)
    this.coinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 16);
    this.coinGeo.rotateX(Math.PI / 2);
    this.coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
    });
  }

  public reset() {
    for (const chunk of this.chunks) {
      this.scene.remove(chunk.group);
      for (const t of chunk.torches) {
        this.scene.remove(t);
      }
    }
    this.chunks = [];
    this.nextChunkZ = -10;
    this.currentStageIndex = 0;

    // Initial safe buffer of chunks
    for (let i = 0; i < 8; i++) {
      this.spawnChunk(i < 2); // First 2 chunks have no obstacles
    }
  }

  public update(playerZ: number, distance: number): { stageChanged: boolean; newStage: StageInfo } {
    // Determine stage based on distance
    let targetStageIndex = 0;
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (distance >= STAGES[i].minDistance) {
        targetStageIndex = i;
        break;
      }
    }

    let stageChanged = false;
    if (targetStageIndex !== this.currentStageIndex) {
      this.currentStageIndex = targetStageIndex;
      stageChanged = true;
    }

    // Spawn new chunks ahead
    while (this.nextChunkZ < playerZ + 200) {
      this.spawnChunk(false);
    }

    // Recycle old chunks behind
    while (this.chunks.length > 0 && this.chunks[0].zEnd < playerZ - 25) {
      const oldChunk = this.chunks.shift()!;
      this.scene.remove(oldChunk.group);
      for (const t of oldChunk.torches) {
        this.scene.remove(t);
      }
    }

    // Animate coins and powerups
    const time = performance.now() * 0.003;
    for (const chunk of this.chunks) {
      for (const coin of chunk.coins) {
        if (!coin.collected) {
          coin.mesh.rotation.y = time * 2;
        }
      }
      for (const pu of chunk.powerups) {
        if (!pu.collected) {
          pu.mesh.rotation.y = time * 2.5;
          pu.mesh.position.y = pu.y + Math.sin(time * 3) * 0.15;
        }
      }
    }

    return { stageChanged, newStage: STAGES[this.currentStageIndex] };
  }

  private spawnChunk(safe: boolean) {
    const stage = STAGES[this.currentStageIndex];
    const chunkGroup = new THREE.Group();
    const zStart = this.nextChunkZ;
    const zEnd = zStart + CHUNK_LENGTH;
    const zCenter = (zStart + zEnd) / 2;

    const obstacles: ActiveObstacle[] = [];
    const coins: ActiveCoin[] = [];
    const powerups: ActivePowerup[] = [];
    const torches: THREE.PointLight[] = [];

    // 1. Runway / Pathway floor
    const floorGeo = new THREE.BoxGeometry(LANE_WIDTH * 3 + 1.2, 0.4, CHUNK_LENGTH);
    const floorMat = new THREE.MeshStandardMaterial({
      color: stage.groundColor,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.2, zCenter);
    floor.receiveShadow = true;
    chunkGroup.add(floor);

    // Decorative lane markings (Indian rangoli/stone inlay runners)
    const laneMarkerGeo = new THREE.BoxGeometry(0.12, 0.02, CHUNK_LENGTH);
    const laneMarkerMat = new THREE.MeshStandardMaterial({
      color: stage.wallColor,
      roughness: 0.5,
    });
    const leftLine = new THREE.Mesh(laneMarkerGeo, laneMarkerMat);
    leftLine.position.set(-LANE_WIDTH / 2, 0.02, zCenter);
    const rightLine = new THREE.Mesh(laneMarkerGeo, laneMarkerMat);
    rightLine.position.set(LANE_WIDTH / 2, 0.02, zCenter);
    chunkGroup.add(leftLine, rightLine);

    // 2. Side Walls / Indian Pillars / Toranas
    const wallGeo = new THREE.BoxGeometry(0.8, 3.5, CHUNK_LENGTH);
    const wallMat = new THREE.MeshStandardMaterial({
      color: stage.wallColor,
      roughness: 0.7,
      metalness: 0.15,
    });
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.position.set(-(LANE_WIDTH * 1.5 + 0.8), 1.5, zCenter);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;

    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.position.set(LANE_WIDTH * 1.5 + 0.8, 1.5, zCenter);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    chunkGroup.add(leftWall, rightWall);

    // Architectural Pillars / Indian Torana Archways along the chunk
    for (let pz = zStart + 5; pz <= zEnd - 5; pz += 10) {
      const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, 4.2, 8);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: stage.wallColor,
        roughness: 0.6,
      });

      const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
      leftPillar.position.set(-(LANE_WIDTH * 1.5 + 0.3), 2.1, pz);
      leftPillar.castShadow = true;

      const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
      rightPillar.position.set(LANE_WIDTH * 1.5 + 0.3, 2.1, pz);
      rightPillar.castShadow = true;

      chunkGroup.add(leftPillar, rightPillar);

      // Flaming Brass Wall Torches
      const torchLight = new THREE.PointLight(0xf59e0b, 0.7, 12);
      torchLight.position.set(-(LANE_WIDTH * 1.5 + 0.1), 2.5, pz);
      this.scene.add(torchLight);
      torches.push(torchLight);

      // Flame visual mesh
      const flameGeo = new THREE.ConeGeometry(0.12, 0.35, 6);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const leftFlame = new THREE.Mesh(flameGeo, flameMat);
      leftFlame.position.set(-(LANE_WIDTH * 1.5 + 0.1), 2.5, pz);
      chunkGroup.add(leftFlame);
    }

    // 3. Obstacles & Collectibles (Only if not safe starting buffer)
    if (!safe) {
      // Decide obstacle layout
      const rand = Math.random();
      const laneOptions = [-1, 0, 1];

      if (rand < 0.32) {
        // JUMP OBSTACLE: Low fallen tree / Spike Trap / Fire Brazier
        const obstacleLane = Math.random() < 0.5 ? 99 : laneOptions[Math.floor(Math.random() * 3)];
        const obsZ = zStart + 14;

        const isWide = obstacleLane === 99;
        const width = isWide ? LANE_WIDTH * 3 : LANE_WIDTH * 0.9;
        const posX = isWide ? 0 : obstacleLane * LANE_WIDTH;

        const logGeo = new THREE.CylinderGeometry(0.35, 0.35, width, 10);
        logGeo.rotateZ(Math.PI / 2);
        const logMat = new THREE.MeshStandardMaterial({
          color: 0x5c3d2e,
          roughness: 0.9,
        });
        const logMesh = new THREE.Mesh(logGeo, logMat);
        logMesh.position.set(posX, 0.35, obsZ);
        logMesh.castShadow = true;
        chunkGroup.add(logMesh);

        // Add warning red/gold spikes or runes on log
        const spikeGeo = new THREE.ConeGeometry(0.12, 0.35, 4);
        const spikeMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.6 });
        for (let sx = -width / 2 + 0.4; sx < width / 2; sx += 0.7) {
          const spike = new THREE.Mesh(spikeGeo, spikeMat);
          spike.position.set(posX + sx, 0.7, obsZ);
          chunkGroup.add(spike);
        }

        obstacles.push({
          type: 'JUMP_LOW',
          lane: obstacleLane,
          z: obsZ,
          width,
          height: 0.8,
          depth: 1.0,
          mesh: logMesh,
          passed: false,
        });

        // Spawn a coin arc over the low jump obstacle!
        if (Math.random() < 0.8) {
          const coinLane = isWide ? 0 : obstacleLane;
          const arcCoins = [
            { dz: -3.5, y: 0.8 },
            { dz: -1.8, y: 1.6 },
            { dz: 0, y: 2.2 },
            { dz: 1.8, y: 1.6 },
            { dz: 3.5, y: 0.8 },
          ];
          for (const ac of arcCoins) {
            const coin = new THREE.Mesh(this.coinGeo, this.coinMat);
            coin.position.set(coinLane * LANE_WIDTH, ac.y, obsZ + ac.dz);
            chunkGroup.add(coin);
            coins.push({
              lane: coinLane,
              x: coinLane * LANE_WIDTH,
              y: ac.y,
              z: obsZ + ac.dz,
              mesh: coin,
              collected: false,
            });
          }
        }
      } else if (rand < 0.62) {
        // SLIDE OBSTACLE: Low Hanging Ancient Lintel / Temple Bell Arch
        const obsZ = zStart + 15;
        const archWidth = LANE_WIDTH * 3.2;

        const archGeo = new THREE.BoxGeometry(archWidth, 1.8, 0.6);
        const archMat = new THREE.MeshStandardMaterial({
          color: stage.wallColor,
          roughness: 0.7,
        });
        const archMesh = new THREE.Mesh(archGeo, archMat);
        archMesh.position.set(0, 2.1, obsZ); // Clearance below is ~1.2m, requires sliding
        archMesh.castShadow = true;
        chunkGroup.add(archMesh);

        // Hanging ornate Indian temple bells
        const bellGeo = new THREE.ConeGeometry(0.25, 0.45, 8);
        const bellMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 });
        for (const bx of [-LANE_WIDTH, 0, LANE_WIDTH]) {
          const bell = new THREE.Mesh(bellGeo, bellMat);
          bell.position.set(bx, 1.25, obsZ);
          chunkGroup.add(bell);
        }

        obstacles.push({
          type: 'SLIDE_HIGH',
          lane: 99,
          z: obsZ,
          width: archWidth,
          height: 2.5,
          depth: 1.2,
          mesh: archMesh,
          passed: false,
        });

        // Coins under the slide beam
        for (let cz = obsZ - 2; cz <= obsZ + 2; cz += 1.5) {
          const coin = new THREE.Mesh(this.coinGeo, this.coinMat);
          coin.position.set(0, 0.45, cz);
          chunkGroup.add(coin);
          coins.push({
            lane: 0,
            x: 0,
            y: 0.45,
            z: cz,
            mesh: coin,
            collected: false,
          });
        }
      } else {
        // LANE BLOCK OBSTACLE: Massive Ancient Stone Idol / Pillar block
        // Block 1 or 2 lanes so at least 1 lane is open
        const blockedLanes = [laneOptions[Math.floor(Math.random() * 3)]];
        if (Math.random() < 0.45) {
          // Double lane block
          const remaining = laneOptions.filter((l) => !blockedLanes.includes(l));
          blockedLanes.push(remaining[Math.floor(Math.random() * remaining.length)]);
        }

        const obsZ = zStart + 16;
        for (const bl of blockedLanes) {
          const pillarGeo = new THREE.BoxGeometry(LANE_WIDTH * 0.95, 3.2, 1.2);
          const pillarMat = new THREE.MeshStandardMaterial({
            color: stage.wallColor,
            roughness: 0.6,
            metalness: 0.2,
          });
          const pillar = new THREE.Mesh(pillarGeo, pillarMat);
          pillar.position.set(bl * LANE_WIDTH, 1.6, obsZ);
          pillar.castShadow = true;
          chunkGroup.add(pillar);

          // Ancient Idol carving relief
          const reliefGeo = new THREE.BoxGeometry(LANE_WIDTH * 0.7, 1.6, 0.15);
          const reliefMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
          const relief = new THREE.Mesh(reliefGeo, reliefMat);
          relief.position.set(bl * LANE_WIDTH, 1.6, obsZ - 0.6);
          chunkGroup.add(relief);

          obstacles.push({
            type: 'LANE_BLOCK',
            lane: bl,
            z: obsZ,
            width: LANE_WIDTH * 0.95,
            height: 3.2,
            depth: 1.4,
            mesh: pillar,
            passed: false,
          });
        }

        // Open lane has a trail of coins!
        const openLanes = laneOptions.filter((l) => !blockedLanes.includes(l));
        const safeLane = openLanes[0] ?? 0;
        for (let cz = zStart + 6; cz <= zEnd - 6; cz += 2.2) {
          const coin = new THREE.Mesh(this.coinGeo, this.coinMat);
          coin.position.set(safeLane * LANE_WIDTH, 0.7, cz);
          chunkGroup.add(coin);
          coins.push({
            lane: safeLane,
            x: safeLane * LANE_WIDTH,
            y: 0.7,
            z: cz,
            mesh: coin,
            collected: false,
          });
        }
      }

      // 4. Power-Up Spawn Chance (~15% per chunk)
      if (Math.random() < 0.22 && powerups.length === 0) {
        const types: PowerUpType[] = ['magnet', 'shield', 'boost', 'doubleCoins', 'revive'];
        const pType = types[Math.floor(Math.random() * types.length)];
        const puLane = laneOptions[Math.floor(Math.random() * 3)];
        const puZ = zStart + 24;

        const puGroup = this.createPowerupMesh(pType);
        puGroup.position.set(puLane * LANE_WIDTH, 1.2, puZ);
        chunkGroup.add(puGroup);

        powerups.push({
          type: pType,
          lane: puLane,
          x: puLane * LANE_WIDTH,
          y: 1.2,
          z: puZ,
          mesh: puGroup,
          collected: false,
        });
      }
    } else {
      // Safe chunk - just a welcoming line of gold coins down the center
      for (let cz = zStart + 6; cz <= zEnd - 6; cz += 2.2) {
        const coin = new THREE.Mesh(this.coinGeo, this.coinMat);
        coin.position.set(0, 0.7, cz);
        chunkGroup.add(coin);
        coins.push({
          lane: 0,
          x: 0,
          y: 0.7,
          z: cz,
          mesh: coin,
          collected: false,
        });
      }
    }

    this.scene.add(chunkGroup);
    this.chunks.push({
      zStart,
      zEnd,
      stageId: stage.id,
      group: chunkGroup,
      obstacles,
      coins,
      powerups,
      torches,
    });

    this.nextChunkZ = zEnd;
  }

  private createPowerupMesh(type: PowerUpType): THREE.Group {
    const group = new THREE.Group();

    // Glowing base pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 12);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    group.add(pedestal);

    // Glowing icon based on type
    if (type === 'magnet') {
      const uGeo = new THREE.TorusGeometry(0.35, 0.1, 8, 16, Math.PI);
      uGeo.rotateZ(Math.PI);
      const uMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.8,
      });
      const magnet = new THREE.Mesh(uGeo, uMat);
      magnet.position.y = 0.45;
      group.add(magnet);
    } else if (type === 'shield') {
      const shieldGeo = new THREE.OctahedronGeometry(0.38, 0);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.position.y = 0.45;
      group.add(shield);
    } else if (type === 'boost') {
      const zapGeo = new THREE.ConeGeometry(0.35, 0.75, 4);
      const zapMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        emissive: 0xca8a04,
        emissiveIntensity: 1.0,
      });
      const zap = new THREE.Mesh(zapGeo, zapMat);
      zap.position.y = 0.45;
      group.add(zap);
    } else if (type === 'doubleCoins') {
      const ringGeo = new THREE.TorusGeometry(0.35, 0.12, 8, 16);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.45;
      group.add(ring);
    } else {
      // Revive Amrita Lotus
      const lotusGeo = new THREE.DodecahedronGeometry(0.36);
      const lotusMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 1.0,
      });
      const lotus = new THREE.Mesh(lotusGeo, lotusMat);
      lotus.position.y = 0.45;
      group.add(lotus);
    }

    return group;
  }
}
