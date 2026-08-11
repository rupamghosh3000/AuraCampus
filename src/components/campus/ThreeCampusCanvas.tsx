import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Building, Room, NavigationPath, CampusEvent } from '../../types';

interface ThreeCampusCanvasProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  selectedFloor: number | null;
  selectedRoom: Room | null;
  activePath: NavigationPath | null;
  activeEvents: CampusEvent[];
  viewMode: '3d' | '2d';
  onSelectBuilding: (building: Building | null) => void;
  onSelectFloor: (floor: number) => void;
  onSelectRoom: (room: Room | null) => void;
}

export const ThreeCampusCanvas: React.FC<ThreeCampusCanvasProps> = ({
  buildings,
  selectedBuilding,
  selectedFloor,
  selectedRoom,
  activePath,
  activeEvents,
  viewMode,
  onSelectBuilding,
  onSelectFloor,
  onSelectRoom,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingGroupRef = useRef<THREE.Group | null>(null);
  const pathGroupRef = useRef<THREE.Group | null>(null);
  const environmentGroupRef = useRef<THREE.Group | null>(null);
  const cadGroupRef = useRef<THREE.Group | null>(null);
  const beaconGroupRef = useRef<THREE.Group | null>(null);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Camera smooth target controls
  const targetCameraPos = useRef(new THREE.Vector3(0, 36, 48));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Mouse orbit controls state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraAngle = useRef({ theta: Math.PI / 4, phi: Math.PI / 4.2, radius: 58 });

  // 1. Primary Scene Setup Effect
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.007);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 38, 50);
    cameraRef.current = camera;

    // WebGL Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
    } catch (e) {
      console.error('WebGL initialization failed:', e);
      return;
    }

    // Attach to mount element safely
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    sunLight.position.set(35, 60, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 160;
    const shadowD = 55;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
    fillLight.position.set(-35, 25, -25);
    scene.add(fillLight);

    // Groups
    const envGroup = new THREE.Group();
    environmentGroupRef.current = envGroup;
    scene.add(envGroup);

    const cadGroup = new THREE.Group();
    cadGroupRef.current = cadGroup;
    scene.add(cadGroup);

    const bGroup = new THREE.Group();
    buildingGroupRef.current = bGroup;
    scene.add(bGroup);

    const pGroup = new THREE.Group();
    pathGroupRef.current = pGroup;
    scene.add(pGroup);

    const beaconGroup = new THREE.Group();
    beaconGroupRef.current = beaconGroup;
    scene.add(beaconGroup);

    // Build Environment (3D & CAD Ground)
    buildCampusEnvironment(envGroup, cadGroup);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera Position Interpolation
      if (cameraRef.current) {
        if (viewMode === '2d') {
          targetCameraPos.current.set(0, 85, 0.001);
          targetLookAt.current.set(0, 0, 0);
        } else if (selectedBuilding) {
          const [bx, , bz] = selectedBuilding.position;
          targetCameraPos.current.set(bx + 18, 26, bz + 24);
          targetLookAt.current.set(bx, 5, bz);
        } else {
          const x = cameraAngle.current.radius * Math.sin(cameraAngle.current.phi) * Math.sin(cameraAngle.current.theta);
          const y = cameraAngle.current.radius * Math.cos(cameraAngle.current.phi);
          const z = cameraAngle.current.radius * Math.sin(cameraAngle.current.phi) * Math.cos(cameraAngle.current.theta);
          targetCameraPos.current.set(x, Math.max(y, 12), z);
          targetLookAt.current.set(0, 0, 0);
        }

        cameraRef.current.position.lerp(targetCameraPos.current, 0.06);
        currentLookAt.current.lerp(targetLookAt.current, 0.06);
        cameraRef.current.lookAt(currentLookAt.current);
      }

      // Animate Fountain Water
      const fountainWater = envGroup.getObjectByName('fountain_water');
      if (fountainWater) {
        fountainWater.rotation.z = elapsedTime * 0.5;
      }

      // Animate Office Beacon Ring & Floating Pin
      if (beaconGroupRef.current) {
        const beaconRing = beaconGroupRef.current.getObjectByName('beacon_ring');
        if (beaconRing) {
          beaconRing.rotation.z = elapsedTime * 2;
          const s = 1 + Math.sin(elapsedTime * 5) * 0.15;
          beaconRing.scale.set(s, s, s);
        }
        const pinObj = beaconGroupRef.current.getObjectByName('office_pin');
        if (pinObj) {
          pinObj.position.y = (pinObj.userData.baseY || 10) + Math.sin(elapsedTime * 4) * 0.6;
        }
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    const resizeTimeout = setTimeout(handleResize, 100);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (rendererRef.current) {
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  // 2. Toggle Environment / CAD visibility based on viewMode
  useEffect(() => {
    if (environmentGroupRef.current) {
      environmentGroupRef.current.visible = viewMode === '3d';
    }
    if (cadGroupRef.current) {
      cadGroupRef.current.visible = viewMode === '2d';
    }
  }, [viewMode]);

  // 3. Rebuild 3D & 2D Buildings when selection or mode changes
  useEffect(() => {
    if (buildingGroupRef.current) {
      rebuildBuildings(buildingGroupRef.current, buildings, selectedBuilding, selectedFloor, viewMode);
    }
  }, [buildings, selectedBuilding, selectedFloor, viewMode]);

  // 4. Update Office Location Beacon Pin when an office/room is located
  useEffect(() => {
    if (!beaconGroupRef.current) return;
    const bGroup = beaconGroupRef.current;
    while (bGroup.children.length > 0) {
      bGroup.remove(bGroup.children[0]);
    }

    if (selectedBuilding) {
      const [bx, , bz] = selectedBuilding.position;
      const floorsCount = selectedBuilding.floorsCount;
      const floorHeight = selectedBuilding.dimensions[1] / floorsCount;
      const targetFloorNum = selectedFloor || 1;

      // Base Y elevation of target office floor
      const floorY = (targetFloorNum - 1) * (floorHeight + 1.2) + floorHeight;

      // 1) Vertical Light Pillar Beam
      const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 30, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(bx, floorY + 15, bz);
      bGroup.add(beamMesh);

      // 2) Glowing Pulse Ring at floor base
      const ringGeo = new THREE.RingGeometry(2, 3.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(bx, floorY + 0.2, bz);
      ringMesh.name = 'beacon_ring';
      bGroup.add(ringMesh);

      // 3) Floating Location Marker Pin Sphere
      const pinY = floorY + 6;
      const pinGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(bx, pinY, bz);
      pinMesh.name = 'office_pin';
      pinMesh.userData = { baseY: pinY };
      bGroup.add(pinMesh);

      // Pin Pointer Cone
      const coneGeo = new THREE.ConeGeometry(0.8, 2, 16);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.rotation.x = Math.PI;
      coneMesh.position.set(bx, pinY - 1.4, bz);
      bGroup.add(coneMesh);
    }
  }, [selectedBuilding, selectedFloor, selectedRoom]);

  // 5. Navigation Path Tube
  useEffect(() => {
    if (!pathGroupRef.current) return;
    const group = pathGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (activePath && Array.isArray(activePath.pathPositions) && activePath.pathPositions.length > 1) {
      const validPoints = activePath.pathPositions
        .filter((p) => Array.isArray(p) && p.length >= 3 && typeof p[0] === 'number' && typeof p[2] === 'number')
        .map((p) => new THREE.Vector3(p[0], 0.35, p[2]));

      if (validPoints.length > 1) {
        const curve = new THREE.CatmullRomCurve3(validPoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.45, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0x2563eb,
          emissive: 0x1d4ed8,
          emissiveIntensity: 0.9,
          roughness: 0.2,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        group.add(tubeMesh);

        validPoints.forEach((pt) => {
          const nodeGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16);
          const nodeMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
          const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
          nodeMesh.position.copy(pt);
          group.add(nodeMesh);
        });
      }
    }
  }, [activePath]);

  // Helper to build realistic 3D Environment & 2D CAD blueprint ground
  const buildCampusEnvironment = (envGroup: THREE.Group, cadGroup: THREE.Group) => {
    // A. 3D ENVIRONMENT
    // 1) Ground Lawn Plane
    const lawnGeo = new THREE.PlaneGeometry(130, 130);
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.receiveShadow = true;
    envGroup.add(lawn);

    // 2) Perimeter Asphalt Ring Road
    const roadGeo = new THREE.RingGeometry(38, 48, 48);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const ringRoad = new THREE.Mesh(roadGeo, roadMat);
    ringRoad.rotation.x = -Math.PI / 2;
    ringRoad.position.y = 0.02;
    ringRoad.receiveShadow = true;
    envGroup.add(ringRoad);

    // Crosswalk Stripes on Ring Road
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const stripeGroup = new THREE.Group();
      for (let s = -2; s <= 2; s++) {
        const stripeGeo = new THREE.PlaneGeometry(1.2, 0.4);
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(s * 1.5, 0.04, 0);
        stripe.rotation.x = -Math.PI / 2;
        stripeGroup.add(stripe);
      }
      stripeGroup.position.set(Math.cos(angle) * 43, 0, Math.sin(angle) * 43);
      stripeGroup.rotation.y = -angle;
      envGroup.add(stripeGroup);
    }

    // 3) Granite Brick Pedestrian Walkways (Cross Plaza)
    const walkGeo1 = new THREE.PlaneGeometry(10, 80);
    const walkMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 });
    const walkway1 = new THREE.Mesh(walkGeo1, walkMat);
    walkway1.rotation.x = -Math.PI / 2;
    walkway1.position.y = 0.03;
    walkway1.receiveShadow = true;
    envGroup.add(walkway1);

    const walkway2 = new THREE.Mesh(walkGeo1, walkMat);
    walkway2.rotation.x = -Math.PI / 2;
    walkway2.rotation.z = Math.PI / 2;
    walkway2.position.y = 0.03;
    walkway2.receiveShadow = true;
    envGroup.add(walkway2);

    // 4) Central College Quadrangle & Fountain
    const quadPlazaGeo = new THREE.CylinderGeometry(14, 14, 0.2, 32);
    const quadPlazaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
    const quadPlaza = new THREE.Mesh(quadPlazaGeo, quadPlazaMat);
    quadPlaza.position.set(0, 0.1, 0);
    quadPlaza.receiveShadow = true;
    envGroup.add(quadPlaza);

    // Central Fountain Basin
    const basinGeo = new THREE.CylinderGeometry(6, 6.5, 0.8, 32);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.set(0, 0.5, 0);
    basin.castShadow = true;
    basin.receiveShadow = true;
    envGroup.add(basin);

    // Fountain Water Surface
    const waterGeo = new THREE.CircleGeometry(5.6, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.85, 0);
    water.name = 'fountain_water';
    envGroup.add(water);

    // Fountain Center Spout
    const spoutGeo = new THREE.CylinderGeometry(0.3, 0.5, 2, 16);
    const spoutMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const spout = new THREE.Mesh(spoutGeo, spoutMat);
    spout.position.set(0, 1.2, 0);
    envGroup.add(spout);

    // 5) 3D Campus Trees
    const treePositions = [
      [-12, 0, -12], [12, 0, -12], [-12, 0, 12], [12, 0, 12],
      [-28, 0, -5], [-28, 0, 5], [28, 0, -5], [28, 0, 5],
      [-15, 0, -32], [15, 0, -32], [-15, 0, 32], [15, 0, 32],
      [-32, 0, -28], [32, 0, -28], [-32, 0, 28], [32, 0, 28]
    ];

    treePositions.forEach(([tx, ty, tz]) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, ty, tz);

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Foliage Canopy
      const canopyGeo = new THREE.DodecahedronGeometry(2, 1);
      const canopyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.y = 3.2;
      canopy.castShadow = true;
      treeGroup.add(canopy);

      envGroup.add(treeGroup);
    });

    // 6) Outdoor Sports Court
    const courtGeo = new THREE.PlaneGeometry(18, 12);
    const courtMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const court = new THREE.Mesh(courtGeo, courtMat);
    court.rotation.x = -Math.PI / 2;
    court.position.set(32, 0.04, -28);
    court.receiveShadow = true;
    envGroup.add(court);

    // Court White Boundary Lines
    const lineGeo = new THREE.RingGeometry(2.5, 2.7, 24);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const centerCircle = new THREE.Mesh(lineGeo, lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.set(32, 0.05, -28);
    envGroup.add(centerCircle);

    // B. 2D CAD BLUEPRINT SCHEMATIC OVERLAY MODE
    const cadGroundGeo = new THREE.PlaneGeometry(130, 130);
    const cadGroundMat = new THREE.MeshBasicMaterial({ color: 0x0f172a }); // Dark Blueprint Blue
    const cadGround = new THREE.Mesh(cadGroundGeo, cadGroundMat);
    cadGround.rotation.x = -Math.PI / 2;
    cadGroup.add(cadGround);

    // Blueprint Structural Grid Lines
    const grid = new THREE.GridHelper(130, 65, 0x38bdf8, 0x1e293b);
    grid.position.y = 0.05;
    cadGroup.add(grid);

    // Blueprint Road Vector Lines
    const rdLineGeo = new THREE.RingGeometry(38, 48, 64);
    const rdLineMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true });
    const rdLine = new THREE.Mesh(rdLineGeo, rdLineMat);
    rdLine.rotation.x = -Math.PI / 2;
    rdLine.position.y = 0.08;
    cadGroup.add(rdLine);
  };

  // Helper to build 3D architectural geometry for buildings
  const rebuildBuildings = (
    group: THREE.Group,
    bList: Building[],
    selB: Building | null,
    selFloor: number | null,
    mode: '3d' | '2d'
  ) => {
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    bList.forEach((b) => {
      const isSelected = selB?.id === b.id;
      const bObj = new THREE.Group();
      bObj.name = `building_${b.id}`;
      bObj.userData = { building: b };
      bObj.position.set(b.position[0], b.position[1], b.position[2]);

      const [w, h, d] = b.dimensions;
      const floorsCount = b.floorsCount;
      const floorHeight = h / floorsCount;

      if (mode === '2d') {
        // ------------------ 2D CAD MODE FLOORPLAN FOOTPRINT ------------------
        const footGeo = new THREE.PlaneGeometry(w, d);
        const colorHex = isSelected ? 0x2563eb : 0x0284c7;
        const footMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: isSelected ? 0.85 : 0.4,
          side: THREE.DoubleSide,
        });
        const footprint = new THREE.Mesh(footGeo, footMat);
        footprint.rotation.x = -Math.PI / 2;
        footprint.position.y = 0.2;
        footprint.userData = { building: b, floorNumber: 1 };
        bObj.add(footprint);

        // 2D Wall Border Outline
        const edgesGeo = new THREE.EdgesGeometry(footGeo);
        const edgesMat = new THREE.LineBasicMaterial({ color: isSelected ? 0x60a5fa : 0x38bdf8, linewidth: 2 });
        const edges = new THREE.LineSegments(edgesGeo, edgesMat);
        edges.rotation.x = -Math.PI / 2;
        edges.position.y = 0.25;
        bObj.add(edges);

        // 2D Inner Room Partitions Lines
        for (let r = 1; r < floorsCount; r++) {
          const pGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-w / 2, 0.3, -d / 2 + (r * d) / floorsCount),
            new THREE.Vector3(w / 2, 0.3, -d / 2 + (r * d) / floorsCount),
          ]);
          const pMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.8, gapSize: 0.4 });
          const line = new THREE.Line(pGeo, pMat);
          line.computeLineDistances();
          bObj.add(line);
        }
      } else {
        // ------------------ 3D SPATIAL DIGITAL TWIN MODE ------------------
        // Base Plinth & Entrance Steps
        const baseGeo = new THREE.BoxGeometry(w + 1.2, 0.3, d + 1.2);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.set(0, 0.15, 0);
        baseMesh.receiveShadow = true;
        bObj.add(baseMesh);

        // Render Floor Stacks (Exploded view when selected!)
        for (let i = 0; i < floorsCount; i++) {
          const floorNum = i + 1;
          const isFloorSelected = isSelected && (selFloor === null || selFloor === floorNum);

          const yOffset = isSelected
            ? i * (floorHeight + 1.2) + floorHeight / 2 + 0.3
            : i * floorHeight + floorHeight / 2 + 0.3;

          const fGeo = new THREE.BoxGeometry(w, floorHeight - 0.25, d);

          let colorHex = b.color ? parseInt(b.color.replace('#', ''), 16) : 0x2563eb;
          if (isNaN(colorHex)) colorHex = 0x2563eb;
          if (isSelected) {
            colorHex = isFloorSelected ? 0x2563eb : 0x1e293b;
          }

          const fMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            roughness: 0.25,
            metalness: 0.2,
            transparent: true,
            opacity: isSelected ? (isFloorSelected ? 0.95 : 0.55) : 0.88,
          });

          const floorMesh = new THREE.Mesh(fGeo, fMat);
          floorMesh.position.set(0, yOffset, 0);
          floorMesh.castShadow = true;
          floorMesh.receiveShadow = true;
          floorMesh.userData = { building: b, floorNumber: floorNum };
          bObj.add(floorMesh);

          // Glass Window Pane Grid
          const windowGeo = new THREE.BoxGeometry(w + 0.08, floorHeight * 0.45, d + 0.08);
          const windowMat = new THREE.MeshStandardMaterial({
            color: isFloorSelected ? 0x60a5fa : 0x38bdf8,
            roughness: 0.1,
            metalness: 0.9,
            emissive: isFloorSelected ? 0x1d4ed8 : 0x0284c7,
            emissiveIntensity: isFloorSelected ? 0.5 : 0.2,
          });
          const windowMesh = new THREE.Mesh(windowGeo, windowMat);
          windowMesh.position.set(0, yOffset, 0);
          bObj.add(windowMesh);
        }

        // Entrance Canopy & Portico Pillars
        const porticoGeo = new THREE.BoxGeometry(w * 0.4, 0.4, 3);
        const porticoMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const portico = new THREE.Mesh(porticoGeo, porticoMat);
        portico.position.set(0, 1.2, d / 2 + 1.2);
        bObj.add(portico);

        const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
        const pillar1 = new THREE.Mesh(pillarGeo, pillarMat);
        pillar1.position.set(-w * 0.18, 0.6, d / 2 + 2.2);
        bObj.add(pillar1);
        const pillar2 = new THREE.Mesh(pillarGeo, pillarMat);
        pillar2.position.set(w * 0.18, 0.6, d / 2 + 2.2);
        bObj.add(pillar2);

        // Building Roof Top Structures
        const topY = isSelected ? floorsCount * (floorHeight + 1.2) + 0.3 : h + 0.3;
        const roofGeo = new THREE.BoxGeometry(w - 0.8, 0.5, d - 0.8);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        roofMesh.position.set(0, topY + 0.25, 0);
        bObj.add(roofMesh);

        // Building Specific Rooftop Equipment
        if (b.id === 'b-01' || b.id === 'b-02') {
          // HVAC Air Conditioning Units
          const hvacGeo = new THREE.BoxGeometry(2, 1.2, 2);
          const hvacMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
          const hvac1 = new THREE.Mesh(hvacGeo, hvacMat);
          hvac1.position.set(-w / 4, topY + 1, -d / 4);
          bObj.add(hvac1);
        } else if (b.id === 'b-04') {
          // Central Library Glass Dome Skylight
          const domeGeo = new THREE.SphereGeometry(2.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
          const domeMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.7,
          });
          const dome = new THREE.Mesh(domeGeo, domeMat);
          dome.position.set(0, topY + 0.5, 0);
          bObj.add(dome);
        } else if (b.id === 'b-07') {
          // Robotics Radar Dish Antenna
          const dishGeo = new THREE.CylinderGeometry(1.5, 0.2, 0.5, 16);
          const dishMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
          const dish = new THREE.Mesh(dishGeo, dishMat);
          dish.rotation.z = Math.PI / 4;
          dish.position.set(w / 4, topY + 1.5, 0);
          bObj.add(dish);
        }

        // Live Event Indicator Sphere
        const hasLiveEvent = activeEvents.some((e) => e.buildingId === b.id && e.status === 'Live');
        if (hasLiveEvent) {
          const beaconGeo = new THREE.SphereGeometry(0.9, 16, 16);
          const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
          const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
          beaconMesh.name = 'event_beacon';
          beaconMesh.position.set(0, topY + 2.8, 0);
          bObj.add(beaconMesh);
        }
      }

      group.add(bObj);
    });
  };

  // Mouse drag & raycasting interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !buildingGroupRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging.current && viewMode !== '2d') {
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraAngle.current.theta -= deltaX * 0.008;
      cameraAngle.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraAngle.current.phi - deltaY * 0.008));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      return;
    }

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(buildingGroupRef.current.children, true);

    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !obj.userData?.building && obj.parent) {
        obj = obj.parent;
      }
      if (obj && obj.userData?.building) {
        setHoveredBuilding(obj.userData.building);
        setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        mountRef.current.style.cursor = 'pointer';
        return;
      }
    }

    setHoveredBuilding(null);
    setHoverPosition(null);
    mountRef.current.style.cursor = 'default';
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !buildingGroupRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(buildingGroupRef.current.children, true);

    if (intersects.length > 0) {
      let currObj: THREE.Object3D | null = intersects[0].object;
      let bData: Building | undefined = undefined;
      let floorNum: number | undefined = undefined;

      while (currObj && !bData) {
        if (currObj.userData?.building) {
          bData = currObj.userData.building;
        }
        if (!floorNum && currObj.userData?.floorNumber) {
          floorNum = currObj.userData.floorNumber;
        }
        currObj = currObj.parent;
      }

      if (bData) {
        onSelectBuilding(bData);
        if (floorNum !== undefined) {
          onSelectFloor(floorNum);
        }
      }
    }
  };

  const handleZoom = (delta: number) => {
    cameraAngle.current.radius = Math.max(15, Math.min(95, cameraAngle.current.radius + delta));
  };

  return (
    <div
      className="w-full h-full relative select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onWheel={(e) => handleZoom(e.deltaY * 0.05)}
    >
      {/* 3D Canvas Isolated Mount Point */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Mode Indicator Banner (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="px-4 py-1.5 bg-[#1A1A1A]/90 backdrop-blur-md border border-slate-700 shadow-xl text-white text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
          {viewMode === '2d'
            ? '📐 2D CAD FLOORPLAN & SCHEMATIC MAP (OVERHEAD)'
            : '🌐 3D SPATIAL DIGITAL TWIN (ISOMETRIC)'}
        </div>
      </div>

      {/* Located Room / Office Highlight Banner */}
      {selectedBuilding && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
          <div className="px-4 py-2 bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-widest shadow-2xl border border-blue-400 flex items-center gap-2">
            <span>📍 LOCATED:</span>
            <span className="text-amber-300">
              {selectedRoom ? `${selectedRoom.code} • ${selectedRoom.name}` : `${selectedBuilding.name}`}
            </span>
            <span>(Floor 0{selectedFloor || 1})</span>
          </div>
        </div>
      )}

      {/* Floating Hover Tooltip */}
      {hoveredBuilding && hoverPosition && (
        <div
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-[#1A1A1A] text-white p-3 border border-slate-700 shadow-2xl transition-all duration-150"
          style={{ left: `${hoverPosition.x}px`, top: `${hoverPosition.y}px` }}
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{hoveredBuilding.code}</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wider">
              {hoveredBuilding.currentLoadPercentage}% LOAD
            </span>
          </div>
          <h4 className="text-xs font-semibold tracking-tight">{hoveredBuilding.name}</h4>
          <p className="text-[10px] text-slate-400 mt-1">{hoveredBuilding.zone}</p>
          <div className="mt-2 pt-2 border-t border-slate-800 flex gap-4 text-[10px] text-slate-300">
            <span>{hoveredBuilding.floorsCount} Floors</span>
            <span>{hoveredBuilding.roomsCount} Rooms</span>
            <span>{hoveredBuilding.labsCount} Labs</span>
          </div>
        </div>
      )}

      {/* Floating View Controls (Top Left of Canvas) */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 border border-slate-200 shadow-lg">
        <button
          onClick={() => {
            onSelectBuilding(null);
            onSelectRoom(null);
          }}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
            !selectedBuilding ? 'bg-[#1A1A1A] text-white' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          Reset View
        </button>
        <div className="w-[1px] h-4 bg-slate-200"></div>
        <button
          onClick={() => handleZoom(-10)}
          className="p-1.5 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(10)}
          className="p-1.5 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer"
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Status Map Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 p-3 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status Legend</span>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-none"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-none"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-none"></div>
          <span>Event / Live</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-none"></div>
          <span>Office Beacon</span>
        </div>
      </div>
    </div>
  );
};
