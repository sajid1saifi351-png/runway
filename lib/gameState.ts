export interface CharacterSkin {
  id: string;
  name: string;
  title: string;
  cost: number;
  unlocked: boolean;
  jacketColor: string;
  pantsColor: string;
  shoeColor: string;
  backpackColor: string;
  skinTone: string;
  perk: string;
}

export interface UpgradeItem {
  id: 'magnet' | 'shield' | 'boost' | 'doubleCoins' | 'slowmo';
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  costPerLevel: number[];
  icon: string;
}

export interface StageInfo {
  id: number;
  name: string;
  subtitle: string;
  minDistance: number;
  groundColor: number;
  wallColor: number;
  skyColor: number;
  fogColor: number;
  ambientIntensity: number;
  obstacleDensity: number;
  speedMultiplier: number;
  themeDescription: string;
}

export const STAGES: StageInfo[] = [
  {
    id: 1,
    name: 'Ancient Temple',
    subtitle: 'Hampi & Khajuraho Ruins',
    minDistance: 0,
    groundColor: 0x93653b,
    wallColor: 0x6e4926,
    skyColor: 0xffcaa2,
    fogColor: 0x7c4f2c,
    ambientIntensity: 0.9,
    obstacleDensity: 1.0,
    speedMultiplier: 1.0,
    themeDescription: 'Carved stone arches, flaming brass braziers, and ancient temple pillars.',
  },
  {
    id: 2,
    name: 'Jungle Escape',
    subtitle: 'Western Ghats Rainforest',
    minDistance: 400,
    groundColor: 0x3d5a28,
    wallColor: 0x243e16,
    skyColor: 0x86efac,
    fogColor: 0x1f3b18,
    ambientIntensity: 0.85,
    obstacleDensity: 1.2,
    speedMultiplier: 1.15,
    themeDescription: 'Dense tropical canopy, mossy stone walkways, and roaring waterfalls.',
  },
  {
    id: 3,
    name: 'Desert Ruins',
    subtitle: 'Thar Golden Sandstones',
    minDistance: 900,
    groundColor: 0xd4a359,
    wallColor: 0xb58238,
    skyColor: 0xfde047,
    fogColor: 0xca8a04,
    ambientIntensity: 1.1,
    obstacleDensity: 1.35,
    speedMultiplier: 1.3,
    themeDescription: 'Shifting golden dunes, sun-bleached fort battlements, and dry hazards.',
  },
  {
    id: 4,
    name: 'Mountain Valley',
    subtitle: 'Himalayan Ridge & Suspension Bridges',
    minDistance: 1500,
    groundColor: 0x64748b,
    wallColor: 0x334155,
    skyColor: 0x93c5fd,
    fogColor: 0x475569,
    ambientIntensity: 0.95,
    obstacleDensity: 1.5,
    speedMultiplier: 1.45,
    themeDescription: 'Fluttering sacred prayer flags, narrow wooden rope bridges, and deep ravines.',
  },
  {
    id: 5,
    name: 'Royal Fort',
    subtitle: 'Jaipur Pink Palace Courtyards',
    minDistance: 2200,
    groundColor: 0xe28f83,
    wallColor: 0xa8483b,
    skyColor: 0xfbcfe8,
    fogColor: 0x881337,
    ambientIntensity: 1.0,
    obstacleDensity: 1.65,
    speedMultiplier: 1.6,
    themeDescription: 'Marble jali screens, golden finials, and opulent royal fortress courtyards.',
  },
  {
    id: 6,
    name: 'Night Jungle',
    subtitle: 'Bioluminescent Wilderness',
    minDistance: 3000,
    groundColor: 0x1e1b4b,
    wallColor: 0x0f172a,
    skyColor: 0x312e81,
    fogColor: 0x1e1b4b,
    ambientIntensity: 0.65,
    obstacleDensity: 1.8,
    speedMultiplier: 1.75,
    themeDescription: 'Glowing mystical flora, fluttering spirit fireflies, and dark predatory shadows.',
  },
  {
    id: 7,
    name: 'Cursed Temple',
    subtitle: 'Abode of the Yaksha Demon',
    minDistance: 4000,
    groundColor: 0x3b0764,
    wallColor: 0x581c87,
    skyColor: 0x701a75,
    fogColor: 0x4a044e,
    ambientIntensity: 0.7,
    obstacleDensity: 2.0,
    speedMultiplier: 1.9,
    themeDescription: 'Obsidian pathways cracking with mystical purple lava and demonic idol totems.',
  },
];

export const INITIAL_SKINS: CharacterSkin[] = [
  {
    id: 'sajid_street',
    name: 'Sajid - Street Explorer',
    title: 'Modern Streetwear Adventurer',
    cost: 0,
    unlocked: true,
    jacketColor: '#e11d48', // Crimson Red hoodie
    pantsColor: '#1e293b', // Dark cargo jogger
    shoeColor: '#f59e0b', // High-top amber sneakers
    backpackColor: '#0f766e', // Teal adventure backpack
    skinTone: '#c68642', // Warm South Asian tone
    perk: 'Balanced agility and jump precision',
  },
  {
    id: 'sajid_rajput',
    name: 'Sajid - Royal Rajput',
    title: 'Warrior Prince Edition',
    cost: 400,
    unlocked: false,
    jacketColor: '#d97706', // Gold embroidered tunic
    pantsColor: '#78350f', // Rich bronze pants
    shoeColor: '#fbbf24', // Gold royal mojari sneakers
    backpackColor: '#b91c1c', // Royal velvet backpack
    skinTone: '#c68642',
    perk: '+15% Gold Coin value',
  },
  {
    id: 'sajid_desert',
    name: 'Sajid - Desert Raider',
    title: 'Thar Storm Chaser',
    cost: 850,
    unlocked: false,
    jacketColor: '#78716c', // Sand dust poncho
    pantsColor: '#44403c', // Rugged nomad bottoms
    shoeColor: '#d97706', // Dune runner boots
    backpackColor: '#b45309', // Vintage leather pack
    skinTone: '#b97a38',
    perk: '+20% Shield durability',
  },
  {
    id: 'sajid_cyber',
    name: 'Sajid - Cyber Mumbai',
    title: 'Neo-Desi Neon Speedster',
    cost: 1500,
    unlocked: false,
    jacketColor: '#06b6d4', // Cyber cyan jacket
    pantsColor: '#09090b', // Stealth black pants
    shoeColor: '#ec4899', // Neon magenta kicks
    backpackColor: '#8b5cf6', // Holographic backpack
    skinTone: '#c68642',
    perk: '+25% Boost duration',
  },
];

export const INITIAL_UPGRADES: UpgradeItem[] = [
  {
    id: 'magnet',
    name: 'Chumbak (Coin Magnet)',
    description: 'Pulls gold coins from all 3 lanes effortlessly',
    level: 1,
    maxLevel: 5,
    costPerLevel: [100, 250, 500, 1000, 2000],
    icon: 'Magnet',
  },
  {
    id: 'shield',
    name: 'Kavach (Sacred Shield)',
    description: 'Absorbs lethal obstacle collisions safely',
    level: 1,
    maxLevel: 5,
    costPerLevel: [150, 300, 600, 1200, 2500],
    icon: 'Shield',
  },
  {
    id: 'boost',
    name: 'Vayu Veg (Wind Rush)',
    description: 'Invincible supersonic speed burst through obstacles',
    level: 1,
    maxLevel: 5,
    costPerLevel: [200, 400, 800, 1500, 3000],
    icon: 'Zap',
  },
  {
    id: 'doubleCoins',
    name: 'Lakshmi 2X (Double Gold)',
    description: 'Multiplies every collected coin value by 2x',
    level: 1,
    maxLevel: 5,
    costPerLevel: [150, 350, 750, 1500, 3000],
    icon: 'Coins',
  },
];

export interface PlayerProfile {
  totalCoins: number;
  highScore: number;
  highestDistance: number;
  highestStage: number;
  reviveTokens: number;
  selectedSkinId: string;
  unlockedSkinIds: string[];
  upgrades: Record<string, number>;
  hasSeenInstagramIntro: boolean;
  sfxVolume: number;
  musicVolume: number;
  voiceVolume: number;
  voiceEnabled: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
}

const STORAGE_KEY = 'RAN_AWAY_PLAYER_SAVE_V1';

export function loadPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') {
    return getDefaultProfile();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        ...getDefaultProfile(),
        ...data,
      };
    }
  } catch (e) {
    console.error('Failed to load player profile:', e);
  }
  return getDefaultProfile();
}

export function savePlayerProfile(profile: PlayerProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save player profile:', e);
  }
}

function getDefaultProfile(): PlayerProfile {
  return {
    totalCoins: 250, // Welcome starter bonus
    highScore: 0,
    highestDistance: 0,
    highestStage: 1,
    reviveTokens: 2, // 2 free revives to start
    selectedSkinId: 'sajid_street',
    unlockedSkinIds: ['sajid_street'],
    upgrades: {
      magnet: 1,
      shield: 1,
      boost: 1,
      doubleCoins: 1,
    },
    hasSeenInstagramIntro: false,
    sfxVolume: 0.8,
    musicVolume: 0.5,
    voiceVolume: 0.9,
    voiceEnabled: true,
    graphicsQuality: 'high',
  };
}
