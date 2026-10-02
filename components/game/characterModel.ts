import * as THREE from 'three';
import { CharacterSkin } from '@/lib/gameState';

export class CharacterModel {
  public group: THREE.Group;
  private torso: THREE.Mesh;
  private headGroup: THREE.Group;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private leftLegGroup: THREE.Group;
  private rightLegGroup: THREE.Group;
  private backpackGroup: THREE.Group;
  private shadowMesh: THREE.Mesh;
  public shieldMesh: THREE.Mesh;
  public boostAura: THREE.Mesh;

  private jacketMat: THREE.MeshStandardMaterial;
  private pantsMat: THREE.MeshStandardMaterial;
  private shoeMat: THREE.MeshStandardMaterial;
  private skinMat: THREE.MeshStandardMaterial;
  private backpackMat: THREE.MeshStandardMaterial;

  constructor(skin: CharacterSkin) {
    this.group = new THREE.Group();

    // Materials
    this.jacketMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skin.jacketColor),
      roughness: 0.6,
      metalness: 0.1,
    });
    this.pantsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skin.pantsColor),
      roughness: 0.7,
      metalness: 0.1,
    });
    this.shoeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skin.shoeColor),
      roughness: 0.4,
      metalness: 0.2,
    });
    this.skinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skin.skinTone),
      roughness: 0.8,
    });
    this.backpackMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skin.backpackColor),
      roughness: 0.5,
      metalness: 0.1,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.9,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });

    // 1. Torso (Athletic adventurer hoodie/jacket)
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.45);
    this.torso = new THREE.Mesh(torsoGeo, this.jacketMat);
    this.torso.position.y = 1.35;
    this.torso.castShadow = true;
    this.group.add(this.torso);

    // Jacket Zipper & Trim
    const zipperGeo = new THREE.BoxGeometry(0.06, 0.92, 0.04);
    const zipper = new THREE.Mesh(zipperGeo, accentMat);
    zipper.position.set(0, 0, 0.22);
    this.torso.add(zipper);

    // Collar / Hoodie Rim
    const collarGeo = new THREE.TorusGeometry(0.24, 0.08, 8, 16);
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, this.jacketMat);
    collar.position.set(0, 0.45, 0);
    this.torso.add(collar);

    // 2. Head & Neck
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.05, 0);

    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.2, 8);
    const neck = new THREE.Mesh(neckGeo, this.skinMat);
    neck.position.y = -0.15;
    this.headGroup.add(neck);

    // Face / Head
    const headGeo = new THREE.BoxGeometry(0.42, 0.46, 0.44);
    const head = new THREE.Mesh(headGeo, this.skinMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Stylish modern haircut (Pompadour / Streetwear Fade)
    const hairGeo = new THREE.BoxGeometry(0.46, 0.25, 0.48);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.2, -0.02);
    this.headGroup.add(hair);

    const hairFringeGeo = new THREE.BoxGeometry(0.44, 0.15, 0.2);
    const hairFringe = new THREE.Mesh(hairFringeGeo, hairMat);
    hairFringe.position.set(0, 0.24, 0.16);
    hairFringe.rotation.x = -0.2;
    this.headGroup.add(hairFringe);

    // Eyes & Eyebrows
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1c1917 });
    const eyeGeo = new THREE.BoxGeometry(0.07, 0.04, 0.02);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.11, 0.02, 0.225);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.11, 0.02, 0.225);
    this.headGroup.add(leftEye, rightEye);

    // Modern adventurer stylish sunglasses / visor band on forehead
    const shadesGeo = new THREE.BoxGeometry(0.44, 0.08, 0.1);
    const shadesMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });
    const shades = new THREE.Mesh(shadesGeo, shadesMat);
    shades.position.set(0, 0.14, 0.2);
    this.headGroup.add(shades);

    this.group.add(this.headGroup);

    // 3. Backpack (Rugged adventurer explorer pack)
    this.backpackGroup = new THREE.Group();
    const packBodyGeo = new THREE.BoxGeometry(0.55, 0.7, 0.35);
    const packBody = new THREE.Mesh(packBodyGeo, this.backpackMat);
    packBody.position.set(0, 1.35, -0.32);
    packBody.castShadow = true;
    this.backpackGroup.add(packBody);

    // Bedroll / sleeping mat strapped to top of backpack
    const rollGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 12);
    rollGeo.rotateZ(Math.PI / 2);
    const rollMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
    const roll = new THREE.Mesh(rollGeo, rollMat);
    roll.position.set(0, 1.75, -0.32);
    this.backpackGroup.add(roll);

    // Straps
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x292524 });
    const leftStrap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.04), strapMat);
    leftStrap.position.set(-0.22, 1.45, -0.1);
    const rightStrap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.04), strapMat);
    rightStrap.position.set(0.22, 1.45, -0.1);
    this.backpackGroup.add(leftStrap, rightStrap);

    this.group.add(this.backpackGroup);

    // 4. Arms
    // Left Arm
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.46, 1.7, 0);
    const leftShoulder = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.24), this.jacketMat);
    leftShoulder.position.y = -0.25;
    leftShoulder.castShadow = true;
    this.leftArmGroup.add(leftShoulder);

    const leftForearm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.2), this.skinMat);
    leftForearm.position.y = -0.65;
    this.leftArmGroup.add(leftForearm);
    this.group.add(this.leftArmGroup);

    // Right Arm
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.46, 1.7, 0);
    const rightShoulder = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.24), this.jacketMat);
    rightShoulder.position.y = -0.25;
    rightShoulder.castShadow = true;
    this.rightArmGroup.add(rightShoulder);

    const rightForearm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.2), this.skinMat);
    rightForearm.position.y = -0.65;
    this.rightArmGroup.add(rightForearm);
    this.group.add(this.rightArmGroup);

    // 5. Legs
    // Left Leg
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.2, 0.9, 0);
    const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.55, 0.28), this.pantsMat);
    leftThigh.position.y = -0.26;
    leftThigh.castShadow = true;
    this.leftLegGroup.add(leftThigh);

    const leftShin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.24), this.pantsMat);
    leftShin.position.y = -0.65;
    this.leftLegGroup.add(leftShin);

    // Left Sneaker
    const leftSneaker = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.42), this.shoeMat);
    leftSneaker.position.set(0, -0.85, 0.08);
    leftSneaker.castShadow = true;
    this.leftLegGroup.add(leftSneaker);
    this.group.add(this.leftLegGroup);

    // Right Leg
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.2, 0.9, 0);
    const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.55, 0.28), this.pantsMat);
    rightThigh.position.y = -0.26;
    rightThigh.castShadow = true;
    this.rightLegGroup.add(rightThigh);

    const rightShin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.24), this.pantsMat);
    rightShin.position.y = -0.65;
    this.rightLegGroup.add(rightShin);

    // Right Sneaker
    const rightSneaker = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.42), this.shoeMat);
    rightSneaker.position.set(0, -0.85, 0.08);
    rightSneaker.castShadow = true;
    this.rightLegGroup.add(rightSneaker);
    this.group.add(this.rightLegGroup);

    // 6. Ground Shadow
    const shadowGeo = new THREE.CircleGeometry(0.65, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.position.y = 0.02;
    this.group.add(this.shadowMesh);

    // 7. Sacred Shield Bubble (Mandala glow)
    const shieldGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0.8,
      wireframe: false,
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldMesh.position.y = 1.2;
    this.shieldMesh.visible = false;
    this.group.add(this.shieldMesh);

    // 8. Boost Aura (Vayu wind trails)
    const boostGeo = new THREE.CylinderGeometry(0.8, 1.2, 2.2, 16, 1, true);
    boostGeo.rotateX(Math.PI / 2);
    const boostMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    this.boostAura = new THREE.Mesh(boostGeo, boostMat);
    this.boostAura.position.set(0, 1.2, -0.5);
    this.boostAura.visible = false;
    this.group.add(this.boostAura);
  }

  public updateSkin(skin: CharacterSkin) {
    this.jacketMat.color.set(skin.jacketColor);
    this.pantsMat.color.set(skin.pantsColor);
    this.shoeMat.color.set(skin.shoeColor);
    this.skinMat.color.set(skin.skinTone);
    this.backpackMat.color.set(skin.backpackColor);
  }

  public animate(
    state: 'run' | 'jump' | 'slide' | 'stumble' | 'dead' | 'boost',
    time: number,
    jumpProgress: number,
    slideProgress: number
  ) {
    // Shield pulse
    if (this.shieldMesh.visible) {
      this.shieldMesh.rotation.y += 0.03;
      this.shieldMesh.rotation.z += 0.02;
      const s = 1.35 + Math.sin(time * 8) * 0.05;
      this.shieldMesh.scale.set(s, s, s);
    }

    // Boost aura pulse
    if (this.boostAura.visible) {
      this.boostAura.rotation.z += 0.15;
      this.boostAura.scale.x = 1 + Math.sin(time * 20) * 0.15;
    }

    if (state === 'jump') {
      // In the air: athletic tucked leap
      this.torso.position.y = 1.35;
      this.torso.rotation.x = -0.15;
      this.headGroup.position.y = 2.05;
      this.headGroup.rotation.x = -0.1;

      this.leftArmGroup.rotation.x = -1.2;
      this.rightArmGroup.rotation.x = -1.2;
      this.leftArmGroup.rotation.z = -0.4;
      this.rightArmGroup.rotation.z = 0.4;

      // Legs tuck upward
      this.leftLegGroup.rotation.x = 0.9;
      this.rightLegGroup.rotation.x = 0.7;
      this.leftLegGroup.position.y = 1.0;
      this.rightLegGroup.position.y = 1.0;

      // Shadow stays grounded while Sajid jumps
      const jumpY = Math.sin(jumpProgress * Math.PI) * 2.2;
      this.shadowMesh.position.y = -jumpY + 0.02;
      const shadowScale = Math.max(0.3, 1.0 - jumpY * 0.25);
      this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
      return;
    }

    // Reset shadow
    this.shadowMesh.position.y = 0.02;
    this.shadowMesh.scale.set(1, 1, 1);

    if (state === 'slide') {
      // Sliding: Drop down, tilt torso back, legs extended forward
      const p = Math.sin(slideProgress * Math.PI);
      this.torso.position.y = 0.55;
      this.torso.rotation.x = 1.25; // Leaning back
      this.headGroup.position.y = 0.85;
      this.headGroup.rotation.x = -0.4;

      this.leftArmGroup.rotation.x = 0.5;
      this.leftArmGroup.rotation.z = -0.6;
      this.rightArmGroup.rotation.x = 0.5;
      this.rightArmGroup.rotation.z = 0.6;

      this.leftLegGroup.position.y = 0.35;
      this.rightLegGroup.position.y = 0.35;
      this.leftLegGroup.rotation.x = -1.3; // Stretched out front
      this.rightLegGroup.rotation.x = -1.1;
      return;
    }

    if (state === 'dead') {
      // Knocked back onto ground
      this.torso.position.y = 0.3;
      this.torso.rotation.x = 1.4;
      this.headGroup.position.y = 0.4;
      this.leftArmGroup.rotation.x = 1.5;
      this.rightArmGroup.rotation.x = 1.5;
      this.leftLegGroup.rotation.x = -0.2;
      this.rightLegGroup.rotation.x = -0.2;
      return;
    }

    if (state === 'stumble') {
      // Stumble arms flailing
      this.torso.position.y = 1.25;
      this.torso.rotation.x = 0.4;
      this.leftArmGroup.rotation.x = Math.sin(time * 15) * 1.2;
      this.rightArmGroup.rotation.x = -Math.sin(time * 15) * 1.2;
      this.leftArmGroup.rotation.z = -0.8;
      this.rightArmGroup.rotation.z = 0.8;
      return;
    }

    // --- NORMAL RUNNING / BOOST CYCLE ---
    const runSpeed = state === 'boost' ? 24 : 14;
    const cycle = time * runSpeed;

    // Torso slight bob and twist
    this.torso.position.y = 1.35 + Math.abs(Math.sin(cycle)) * 0.12;
    this.torso.rotation.x = state === 'boost' ? 0.35 : 0.15; // Leaning into speed
    this.torso.rotation.y = Math.sin(cycle) * 0.08;

    // Head subtle bob
    this.headGroup.position.y = 2.05 + Math.abs(Math.sin(cycle)) * 0.1;
    this.headGroup.rotation.x = -0.05;
    this.headGroup.rotation.y = -Math.sin(cycle) * 0.04;

    // Arms swing in counter-motion to legs
    this.leftArmGroup.rotation.x = Math.sin(cycle) * 0.85;
    this.rightArmGroup.rotation.x = -Math.sin(cycle) * 0.85;
    this.leftArmGroup.rotation.z = -0.15;
    this.rightArmGroup.rotation.z = 0.15;

    // Legs full running stride
    this.leftLegGroup.position.y = 0.9;
    this.rightLegGroup.position.y = 0.9;
    this.leftLegGroup.rotation.x = -Math.sin(cycle) * 0.95;
    this.rightLegGroup.rotation.x = Math.sin(cycle) * 0.95;

    // Backpack bounce
    this.backpackGroup.position.y = Math.abs(Math.sin(cycle - 0.4)) * 0.08;
  }
}
