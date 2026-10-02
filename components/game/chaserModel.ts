import * as THREE from 'three';

export class ChaserModel {
  public group: THREE.Group;
  private torso: THREE.Mesh;
  private headGroup: THREE.Group;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private eyeLeft: THREE.Mesh;
  private eyeRight: THREE.Mesh;
  private shadowMesh: THREE.Mesh;

  public distanceBehind: number = 8.5; // Normal distance behind Sajid
  public targetDistance: number = 8.5;

  constructor() {
    this.group = new THREE.Group();

    // Mythical Yaksha stone materials
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x27272a, // Dark obsidian/granite stone
      roughness: 0.8,
      metalness: 0.2,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Ancient Indian beaten brass
      roughness: 0.4,
      metalness: 0.7,
    });
    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Glowing demon ruby eyes
    });
    const runeMat = new THREE.MeshBasicMaterial({
      color: 0xf97316, // Glowing lava runes
    });

    // 1. Massive Stone Torso
    const torsoGeo = new THREE.BoxGeometry(1.4, 1.6, 0.9);
    this.torso = new THREE.Mesh(torsoGeo, stoneMat);
    this.torso.position.y = 1.8;
    this.torso.castShadow = true;
    this.group.add(this.torso);

    // Runic Chest Plate
    const runePlate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.1), runeMat);
    runePlate.position.set(0, 0.1, 0.46);
    this.torso.add(runePlate);

    // Spiked Stone Pauldrons / Shoulder Guards
    const pauldronGeo = new THREE.ConeGeometry(0.35, 0.6, 5);
    pauldronGeo.rotateZ(Math.PI / 4);
    const leftPauldron = new THREE.Mesh(pauldronGeo, brassMat);
    leftPauldron.position.set(-0.85, 0.65, 0);
    const rightPauldron = new THREE.Mesh(pauldronGeo, brassMat);
    rightPauldron.rotation.z = -Math.PI / 4;
    rightPauldron.position.set(0.85, 0.65, 0);
    this.torso.add(leftPauldron, rightPauldron);

    // 2. Demonic Guardian Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.9, 0.2);

    const headGeo = new THREE.BoxGeometry(0.8, 0.9, 0.8);
    const head = new THREE.Mesh(headGeo, stoneMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Giant Curved Horns
    const hornCurve = new THREE.CylinderGeometry(0.08, 0.22, 0.9, 8);
    hornCurve.rotateZ(0.6);
    hornCurve.rotateX(-0.3);
    const leftHorn = new THREE.Mesh(hornCurve, brassMat);
    leftHorn.position.set(-0.55, 0.55, -0.1);

    const rightHornCurve = new THREE.CylinderGeometry(0.08, 0.22, 0.9, 8);
    rightHornCurve.rotateZ(-0.6);
    rightHornCurve.rotateX(-0.3);
    const rightHorn = new THREE.Mesh(rightHornCurve, brassMat);
    rightHorn.position.set(0.55, 0.55, -0.1);
    this.headGroup.add(leftHorn, rightHorn);

    // Glowing Eyes
    const eyeGeo = new THREE.BoxGeometry(0.18, 0.1, 0.05);
    this.eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    this.eyeLeft.position.set(-0.22, 0.12, 0.42);
    this.eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
    this.eyeRight.position.set(0.22, 0.12, 0.42);
    this.headGroup.add(this.eyeLeft, this.eyeRight);

    // Fanged Jaw
    const jawGeo = new THREE.BoxGeometry(0.6, 0.25, 0.4);
    const jaw = new THREE.Mesh(jawGeo, brassMat);
    jaw.position.set(0, -0.3, 0.25);
    this.headGroup.add(jaw);

    this.group.add(this.headGroup);

    // 3. Claws / Arms reaching forward
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.9, 2.3, 0);
    const armGeo = new THREE.BoxGeometry(0.35, 1.2, 0.35);
    const leftArm = new THREE.Mesh(armGeo, stoneMat);
    leftArm.position.set(0, -0.5, 0.3);
    leftArm.rotation.x = -0.7; // reaching forward
    this.leftArmGroup.add(leftArm);
    this.group.add(this.leftArmGroup);

    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.9, 2.3, 0);
    const rightArm = new THREE.Mesh(armGeo, stoneMat);
    rightArm.position.set(0, -0.5, 0.3);
    rightArm.rotation.x = -0.7;
    this.rightArmGroup.add(rightArm);
    this.group.add(this.rightArmGroup);

    // 4. Ground Shadow
    const shadowGeo = new THREE.CircleGeometry(1.2, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    this.shadowMesh = new THREE.Mesh(
      shadowGeo,
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 })
    );
    this.shadowMesh.position.y = 0.03;
    this.group.add(this.shadowMesh);
  }

  public setProximity(closer: boolean) {
    this.targetDistance = closer ? 3.8 : 8.5;
  }

  public animate(time: number, speed: number, playerX: number, playerZ: number) {
    // Smoothly interpolate distance behind player
    this.distanceBehind += (this.targetDistance - this.distanceBehind) * 0.05;

    // Follow player X with slight lag
    this.group.position.x += (playerX - this.group.position.x) * 0.08;
    this.group.position.z = playerZ - this.distanceBehind;

    // Menacing rhythmic floating/striding motion
    const cycle = time * 12;
    this.torso.position.y = 1.8 + Math.abs(Math.sin(cycle)) * 0.3;
    this.headGroup.position.y = 2.9 + Math.abs(Math.sin(cycle)) * 0.25;

    // Claw lunges
    this.leftArmGroup.rotation.x = -0.5 + Math.sin(cycle) * 0.4;
    this.rightArmGroup.rotation.x = -0.5 - Math.sin(cycle) * 0.4;

    // Eye glow pulse
    const eyeScale = 1 + Math.sin(time * 10) * 0.2;
    this.eyeLeft.scale.set(eyeScale, eyeScale, 1);
    this.eyeRight.scale.set(eyeScale, eyeScale, 1);
  }
}
