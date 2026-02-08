import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Environment, PerspectiveCamera, Sphere, RoundedBox, Plane } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MetricCard } from '../shared/MetricCard';
import { ChartCard } from '../shared/ChartCard';
import { StatusBadge } from '../shared/StatusBadge';
import { Activity, Cpu, Gauge, Zap, RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ===================== 3D COMPONENTS =====================

// River with flowing water effect
function River() {
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (waterRef.current) {
      const material = waterRef.current.material as THREE.MeshStandardMaterial;
      if (material.map) {
        material.map.offset.x = state.clock.elapsedTime * 0.02;
      }
    }
  });

  return (
    <group position={[-8, -0.3, 0]}>
      {/* River bed */}
      <Box args={[4, 0.2, 20]} position={[0, -0.15, 0]}>
        <meshStandardMaterial color="#1e3a5f" />
      </Box>
      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 20]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Bridge */}
      <Box args={[4.5, 0.15, 2]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.4} />
      </Box>
      {/* Bridge railings */}
      {[-0.85, 0.85].map((z, i) => (
        <group key={i} position={[0, 0.5, z]}>
          {[-1.8, -0.9, 0, 0.9, 1.8].map((x, j) => (
            <Cylinder key={j} args={[0.03, 0.03, 0.4]} position={[x, 0, 0]}>
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
            </Cylinder>
          ))}
          <Box args={[4.2, 0.05, 0.05]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
          </Box>
        </group>
      ))}
    </group>
  );
}

// Road with markings
function Road() {
  return (
    <group position={[0, 0.01, -7]}>
      {/* Main road surface */}
      <Box args={[20, 0.02, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* Road markings */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Box key={i} args={[0.8, 0.03, 0.1]} position={[-9 + i * 1.6, 0.02, 0]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>
      ))}
      {/* Side curbs */}
      {[-1.6, 1.6].map((z, i) => (
        <Box key={i} args={[20, 0.1, 0.2]} position={[0, 0.05, z]}>
          <meshStandardMaterial color="#6b7280" />
        </Box>
      ))}
    </group>
  );
}

// Power Plant with cooling towers
function PowerPlant({ position }: { position: [number, number, number] }) {
  const smokeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (smokeRef.current) {
      smokeRef.current.children.forEach((child, i) => {
        child.position.y = 2.5 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.2;
        child.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 0.3 + i * 0.5) * 0.2);
      });
    }
  });

  return (
    <group position={position}>
      {/* Cooling Tower 1 */}
      <Cylinder args={[0.6, 0.9, 2, 16]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.7} />
      </Cylinder>
      {/* Cooling Tower 2 */}
      <Cylinder args={[0.5, 0.75, 1.8, 16]} position={[1.5, 0.9, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.7} />
      </Cylinder>
      {/* Main building */}
      <RoundedBox args={[2, 1.2, 1.5]} radius={0.05} position={[0.7, 0.6, 1.2]}>
        <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.5} />
      </RoundedBox>
      {/* Chimney */}
      <Cylinder args={[0.15, 0.18, 2.5]} position={[0.7, 1.85, 1.2]}>
        <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.3} />
      </Cylinder>
      {/* Smoke particles */}
      <group ref={smokeRef} position={[0.7, 3.2, 1.2]}>
        {[0, 1, 2].map((i) => (
          <Sphere key={i} args={[0.15 + i * 0.08]} position={[i * 0.1, i * 0.3, 0]}>
            <meshStandardMaterial color="#94a3b8" transparent opacity={0.4 - i * 0.1} />
          </Sphere>
        ))}
      </group>
      {/* Power lines */}
      <Cylinder args={[0.04, 0.04, 3]} position={[-0.5, 1.5, -0.8]}>
        <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
      </Cylinder>
    </group>
  );
}

// Advanced Robotic Arm with multiple joints
function RoboticArm({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const baseRef = useRef<THREE.Group>(null);
  const arm1Ref = useRef<THREE.Group>(null);
  const arm2Ref = useRef<THREE.Group>(null);
  const gripperRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (baseRef.current) baseRef.current.rotation.y = Math.sin(t * 0.4) * 0.5 + rotation;
    if (arm1Ref.current) arm1Ref.current.rotation.z = Math.sin(t * 0.6) * 0.2 - 0.3;
    if (arm2Ref.current) arm2Ref.current.rotation.z = Math.sin(t * 0.8 + 1) * 0.3 - 0.2;
    if (gripperRef.current) {
      const grip = Math.sin(t * 2) * 0.02 + 0.04;
      gripperRef.current.children[0].position.z = -grip;
      gripperRef.current.children[1].position.z = grip;
    }
  });

  return (
    <group position={position}>
      {/* Heavy base */}
      <Cylinder args={[0.35, 0.4, 0.2]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </Cylinder>
      <group ref={baseRef}>
        {/* Main column */}
        <Cylinder args={[0.12, 0.15, 0.7]} position={[0, 0.55, 0]}>
          <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} />
        </Cylinder>
        {/* Shoulder joint */}
        <Sphere args={[0.12]} position={[0, 0.9, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
        </Sphere>
        {/* First arm segment */}
        <group ref={arm1Ref} position={[0, 0.9, 0]}>
          <Box args={[0.08, 0.55, 0.08]} position={[0.25, 0.2, 0]}>
            <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} />
          </Box>
          {/* Elbow joint */}
          <Sphere args={[0.08]} position={[0.45, 0.45, 0]}>
            <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
          </Sphere>
          {/* Second arm segment */}
          <group ref={arm2Ref} position={[0.45, 0.45, 0]}>
            <Box args={[0.06, 0.4, 0.06]} position={[0.18, 0.15, 0]}>
              <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} />
            </Box>
            {/* Wrist */}
            <Sphere args={[0.05]} position={[0.35, 0.3, 0]}>
              <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
            </Sphere>
            {/* Gripper */}
            <group ref={gripperRef} position={[0.45, 0.35, 0]}>
              <Box args={[0.04, 0.1, 0.02]} position={[0, 0, -0.04]}>
                <meshStandardMaterial color="#6b7280" metalness={0.95} roughness={0.05} />
              </Box>
              <Box args={[0.04, 0.1, 0.02]} position={[0, 0, 0.04]}>
                <meshStandardMaterial color="#6b7280" metalness={0.95} roughness={0.05} />
              </Box>
            </group>
          </group>
        </group>
      </group>
      {/* Status indicator */}
      <Sphere args={[0.03]} position={[0.25, 0.15, 0.2]}>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
      </Sphere>
    </group>
  );
}

// Heavy Industrial Press
function HydraulicPress({ position }: { position: [number, number, number] }) {
  const pressRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (pressRef.current) {
      pressRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <Box args={[1.2, 0.3, 1]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
      </Box>
      {/* Frame pillars */}
      {[[-0.45, -0.35], [-0.45, 0.35], [0.45, -0.35], [0.45, 0.35]].map(([x, z], i) => (
        <Box key={i} args={[0.12, 1.8, 0.12]} position={[x, 1.2, z]}>
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </Box>
      ))}
      {/* Top frame */}
      <Box args={[1.3, 0.15, 0.9]} position={[0, 2.1, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Hydraulic cylinder */}
      <Cylinder args={[0.15, 0.15, 0.6]} position={[0, 1.8, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </Cylinder>
      {/* Moving press head */}
      <Box ref={pressRef} args={[0.8, 0.25, 0.7]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.3} />
      </Box>
      {/* Work table */}
      <Box args={[0.9, 0.1, 0.8]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </Box>
    </group>
  );
}

// CNC Machine with active spindle
function CNCMachine({ position, status }: { position: [number, number, number]; status: 'running' | 'idle' | 'maintenance' }) {
  const spindleRef = useRef<THREE.Mesh>(null);
  const statusColor = status === 'running' ? '#22c55e' : status === 'idle' ? '#f59e0b' : '#ef4444';
  
  useFrame(() => {
    if (spindleRef.current && status === 'running') {
      spindleRef.current.rotation.y += 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Machine Base */}
      <RoundedBox args={[1.6, 0.25, 1.2]} radius={0.03} position={[0, 0.125, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Main Housing */}
      <RoundedBox args={[1.4, 1, 1]} radius={0.05} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      {/* Glass Window */}
      <Box args={[0.9, 0.5, 0.02]} position={[0, 0.85, 0.51]}>
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.25} metalness={0.95} roughness={0.05} />
      </Box>
      {/* Spindle Head */}
      <group position={[0, 0.6, 0]}>
        <Box args={[0.25, 0.3, 0.25]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
        </Box>
        <Cylinder ref={spindleRef} args={[0.06, 0.04, 0.35]} position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#9ca3af" metalness={0.98} roughness={0.02} />
        </Cylinder>
      </group>
      {/* Control Panel */}
      <Box args={[0.35, 0.2, 0.06]} position={[0.5, 0.6, 0.53]}>
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[0.28, 0.12, 0.01]} position={[0.5, 0.62, 0.56]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </Box>
      {/* Status Light */}
      <Sphere args={[0.045]} position={[0.55, 1.3, 0]}>
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={2} />
      </Sphere>
    </group>
  );
}

// Conveyor Belt with moving packages
function ConveyorBelt({ position }: { position: [number, number, number] }) {
  const itemsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (itemsRef.current) {
      itemsRef.current.children.forEach((item, i) => {
        item.position.x = ((state.clock.elapsedTime * 0.4 + i * 0.9) % 5) - 2.5;
      });
    }
  });

  return (
    <group position={position}>
      {/* Belt Frame */}
      <Box args={[6, 0.12, 0.6]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Belt Surface */}
      <Box args={[5.8, 0.03, 0.55]} position={[0, 0.13, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.4} roughness={0.7} />
      </Box>
      {/* Rollers */}
      {[-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => (
        <Cylinder key={i} args={[0.07, 0.07, 0.65]} position={[x, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.95} roughness={0.05} />
        </Cylinder>
      ))}
      {/* Packages on belt */}
      <group ref={itemsRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <RoundedBox key={i} args={[0.22, 0.18, 0.22]} radius={0.02} position={[0, 0.24, 0]}>
            <meshStandardMaterial color={['#3b82f6', '#22c55e', '#f97316'][i % 3]} metalness={0.3} roughness={0.7} />
          </RoundedBox>
        ))}
      </group>
      {/* Support legs */}
      {[-2.4, 2.4].map((x) => (
        [-0.2, 0.2].map((z, j) => (
          <Box key={`${x}-${j}`} args={[0.1, 0.4, 0.1]} position={[x, -0.2, z]}>
            <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.4} />
          </Box>
        ))
      ))}
    </group>
  );
}

// Industrial Tank with liquid level
function Tank({ position, fillLevel = 0.7 }: { position: [number, number, number]; fillLevel?: number }) {
  return (
    <group position={position}>
      <Cylinder args={[0.45, 0.45, 1.4]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#6b7280" metalness={0.85} roughness={0.15} transparent opacity={0.55} />
      </Cylinder>
      <Cylinder args={[0.38, 0.38, 1.25 * fillLevel]} position={[0, 0.1 + (1.25 * fillLevel) / 2, 0]}>
        <meshStandardMaterial color="#22c55e" transparent opacity={0.75} />
      </Cylinder>
      <Cylinder args={[0.48, 0.48, 0.08]} position={[0, 1.44, 0]}>
        <meshStandardMaterial color="#4b5563" metalness={0.95} roughness={0.05} />
      </Cylinder>
      {/* Gauge */}
      <Cylinder args={[0.08, 0.08, 0.03]} position={[0, 0.9, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Sphere args={[0.06]} position={[0, 0.9, 0.5]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
}

// Factory Floor with zones
function FactoryFloor() {
  return (
    <group>
      {/* Main concrete floor */}
      <Box args={[18, 0.15, 16]} position={[0, -0.075, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.85} />
      </Box>
      {/* Safety markings - yellow lines */}
      {[[-7, 0], [7, 0]].map(([x], i) => (
        <Box key={`v-${i}`} args={[0.08, 0.16, 14]} position={[x, 0.01, 0]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>
      ))}
      {[[6], [-6]].map(([z], i) => (
        <Box key={`h-${i}`} args={[14, 0.16, 0.08]} position={[0, 0.01, z]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>
      ))}
      {/* Work zone markings */}
      {[[-4, -3], [-4, 3], [0, -3], [0, 3], [4, -3], [4, 3]].map(([x, z], i) => (
        <Box key={`zone-${i}`} args={[2.2, 0.16, 2.2]} position={[x, 0.005, z]}>
          <meshStandardMaterial color="#334155" transparent opacity={0.4} />
        </Box>
      ))}
    </group>
  );
}

// Control Cabinet
function ControlCabinet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.55, 1.7, 0.35]} radius={0.03} position={[0, 0.85, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      <Box args={[0.4, 0.3, 0.02]} position={[0, 1.25, 0.18]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
      </Box>
      {[0.4, 0.6, 0.8].map((y, i) => (
        <Sphere key={i} args={[0.025]} position={[0.18, y + 0.5, 0.18]}>
          <meshStandardMaterial 
            color={['#22c55e', '#f59e0b', '#ef4444'][i]} 
            emissive={['#22c55e', '#f59e0b', '#ef4444'][i]}
            emissiveIntensity={1.2}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Laser Cutter Machine
function LaserCutter({ position }: { position: [number, number, number] }) {
  const laserRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (laserRef.current) {
      laserRef.current.position.x = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      laserRef.current.position.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.2;
    }
    if (beamRef.current) {
      beamRef.current.scale.y = 0.8 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Base platform */}
      <Box args={[1.8, 0.15, 1.4]} position={[0, 0.075, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Enclosure */}
      <Box args={[1.6, 0.8, 1.2]} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} transparent opacity={0.9} />
      </Box>
      {/* Glass viewing panel */}
      <Box args={[1.4, 0.5, 0.02]} position={[0, 0.55, 0.61]}>
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.2} metalness={0.95} roughness={0.05} />
      </Box>
      {/* Laser head rail */}
      <Box args={[1.4, 0.06, 0.06]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Moving laser head */}
      <group ref={laserRef} position={[0, 0.8, 0]}>
        <Box args={[0.12, 0.15, 0.12]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Laser beam */}
        <mesh ref={beamRef} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.005, 0.002, 0.4]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} transparent opacity={0.8} />
        </mesh>
      </group>
      {/* Status light */}
      <Sphere args={[0.035]} position={[0.7, 1, 0.5]}>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
      </Sphere>
    </group>
  );
}

// Welding Station with sparks
function WeldingStation({ position }: { position: [number, number, number] }) {
  const armRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      armRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 1.5) * 0.2;
    }
    if (sparksRef.current) {
      sparksRef.current.children.forEach((spark, i) => {
        const t = (state.clock.elapsedTime * 3 + i * 0.5) % 1;
        spark.position.x = (Math.random() - 0.5) * 0.3 * t;
        spark.position.y = t * 0.4;
        spark.position.z = (Math.random() - 0.5) * 0.3 * t;
        spark.scale.setScalar(1 - t);
      });
    }
  });

  return (
    <group position={position}>
      {/* Work table */}
      <Box args={[1.4, 0.1, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Table legs */}
      {[[-0.6, -0.4], [-0.6, 0.4], [0.6, -0.4], [0.6, 0.4]].map(([x, z], i) => (
        <Box key={i} args={[0.08, 0.5, 0.08]} position={[x, 0.25, z]}>
          <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
        </Box>
      ))}
      {/* Welding arm base */}
      <Cylinder args={[0.15, 0.18, 0.3]} position={[0.5, 0.7, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </Cylinder>
      {/* Welding arm */}
      <group ref={armRef} position={[0.5, 0.85, 0]}>
        <Cylinder args={[0.04, 0.04, 0.5]} position={[-0.15, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} />
        </Cylinder>
        {/* Welding torch */}
        <Cylinder args={[0.025, 0.02, 0.15]} position={[-0.35, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#6b7280" metalness={0.95} roughness={0.05} />
        </Cylinder>
        {/* Sparks */}
        <group ref={sparksRef} position={[-0.4, 0.2, 0]}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Sphere key={i} args={[0.015]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} />
            </Sphere>
          ))}
        </group>
      </group>
      {/* Work piece */}
      <Box args={[0.4, 0.08, 0.3]} position={[-0.2, 0.59, 0]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.05} />
      </Box>
    </group>
  );
}

// Industrial Crane
function OverheadCrane({ position }: { position: [number, number, number] }) {
  const trolleyRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (trolleyRef.current) {
      trolleyRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 3;
    }
    if (hookRef.current) {
      hookRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Main beam */}
      <Box args={[12, 0.3, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </Box>
      {/* Support rails */}
      {[-6, 6].map((x) => (
        <Box key={x} args={[0.2, 3.5, 0.2]} position={[x, -1.75, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </Box>
      ))}
      {/* Trolley */}
      <group ref={trolleyRef} position={[0, -0.3, 0]}>
        <Box args={[0.8, 0.25, 0.5]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
        </Box>
        {/* Cable */}
        <Cylinder args={[0.015, 0.015, 1.5]} position={[0, -0.75, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
        </Cylinder>
        {/* Hook assembly */}
        <group ref={hookRef} position={[0, -1.5, 0]}>
          <Box args={[0.15, 0.1, 0.15]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
          </Box>
          {/* Hook */}
          <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#f97316" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Storage Rack
function StorageRack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Vertical posts */}
      {[-0.8, 0, 0.8].map((x) => (
        <Box key={x} args={[0.06, 2.2, 0.06]} position={[x, 1.1, 0]}>
          <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
        </Box>
      ))}
      {/* Shelves */}
      {[0.4, 0.9, 1.4, 1.9].map((y, i) => (
        <Box key={y} args={[1.8, 0.04, 0.5]} position={[0, y, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
        </Box>
      ))}
      {/* Boxes on shelves */}
      {[[0.5, 0.5], [-0.4, 0.5], [0.2, 1], [-0.5, 1.5], [0.5, 1.5], [0, 2]].map(([x, y], i) => (
        <RoundedBox key={i} args={[0.25, 0.18, 0.25]} radius={0.02} position={[x, y, 0]}>
          <meshStandardMaterial color={['#3b82f6', '#22c55e', '#f97316', '#8b5cf6'][i % 4]} metalness={0.3} roughness={0.7} />
        </RoundedBox>
      ))}
    </group>
  );
}

// Trees for landscaping
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.08, 0.12, 0.6]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#7c3aed" />
      </Cylinder>
      <Sphere args={[0.35]} position={[0, 0.85, 0]}>
        <meshStandardMaterial color="#22c55e" />
      </Sphere>
      <Sphere args={[0.25]} position={[0.15, 1.1, 0.1]}>
        <meshStandardMaterial color="#16a34a" />
      </Sphere>
    </group>
  );
}

// ===================== DATA =====================

const productionData = [
  { time: '00:00', output: 120, target: 140, efficiency: 86 },
  { time: '04:00', output: 135, target: 140, efficiency: 96 },
  { time: '08:00', output: 148, target: 140, efficiency: 100 },
  { time: '12:00', output: 142, target: 140, efficiency: 100 },
  { time: '16:00', output: 138, target: 140, efficiency: 99 },
  { time: '20:00', output: 145, target: 140, efficiency: 100 },
];

const machineStatus = [
  { name: 'CNC Mill A1', status: 'running' as const, efficiency: 94, temperature: 42, uptime: '12h 34m' },
  { name: 'CNC Mill A2', status: 'running' as const, efficiency: 91, temperature: 45, uptime: '8h 12m' },
  { name: 'Assembly Robot B1', status: 'running' as const, efficiency: 98, temperature: 38, uptime: '23h 45m' },
  { name: 'Hydraulic Press C1', status: 'idle' as const, efficiency: 0, temperature: 28, uptime: '0h 0m' },
  { name: 'Laser Cutter D1', status: 'maintenance' as const, efficiency: 0, temperature: 25, uptime: '0h 0m' },
  { name: 'Welding Station E1', status: 'running' as const, efficiency: 87, temperature: 52, uptime: '6h 18m' },
];

const pieData = [
  { name: 'Running', value: 4, color: '#22c55e' },
  { name: 'Idle', value: 1, color: '#f59e0b' },
  { name: 'Maintenance', value: 1, color: '#ef4444' },
];

const weeklyOutput = [
  { day: 'Mon', units: 1420 },
  { day: 'Tue', units: 1580 },
  { day: 'Wed', units: 1350 },
  { day: 'Thu', units: 1620 },
  { day: 'Fri', units: 1490 },
  { day: 'Sat', units: 890 },
  { day: 'Sun', units: 0 },
];

// ===================== MAIN COMPONENT =====================

export function DigitalTwinTab() {
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const handleFullscreen = useCallback(() => {
    if (!canvasContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      canvasContainerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const currentDistance = controlsRef.current.getDistance();
      controlsRef.current.dollyTo(Math.max(currentDistance * 0.7, 5), true);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const currentDistance = controlsRef.current.getDistance();
      controlsRef.current.dollyTo(Math.min(currentDistance * 1.3, 25), true);
    }
  }, []);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">Smart Factory Digital Twin</h2>
          <p className="text-muted-foreground">Real-time 3D visualization of Heilbronn Manufacturing Facility</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-500">Live Sync</span>
          </div>
          <span className="text-xs text-muted-foreground">Updated 2s ago</span>
        </div>
      </motion.div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Equipment Effectiveness"
          value="87.4%"
          change={3.2}
          changeLabel="vs last week"
          icon={Gauge}
          iconColor="text-primary"
          delay={0}
        />
        <MetricCard
          title="Units Produced Today"
          value="1,847"
          change={12}
          changeLabel="above target"
          icon={Activity}
          iconColor="text-accent"
          delay={0.1}
        />
        <MetricCard
          title="Active Machines"
          value="4 / 6"
          subtitle="2 offline (1 maintenance)"
          icon={Cpu}
          iconColor="text-green-500"
          delay={0.2}
        />
        <MetricCard
          title="Energy Consumption"
          value="342 kWh"
          change={-8}
          changeLabel="efficiency gain"
          icon={Zap}
          iconColor="text-amber-500"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 3D Factory View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div 
            ref={canvasContainerRef}
            className={`rounded-xl border-2 border-border bg-card overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : ''}`}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">3D Factory Floor</span>
                <span className="text-xs text-muted-foreground">• Interactive digital twin with environment</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Reset View" onClick={handleResetView}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Zoom In" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Zoom Out" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Fullscreen" onClick={handleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {/* 3D Canvas */}
            <div className={`${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-[420px]'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900`}>
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={45} />
                <ambientLight intensity={0.35} />
                <directionalLight position={[15, 20, 10]} intensity={1.2} castShadow />
                <pointLight position={[-10, 10, -10]} intensity={0.4} color="#60a5fa" />
                <pointLight position={[10, 8, -10]} intensity={0.3} color="#f59e0b" />
                
                {/* Environment */}
                <River />
                <Road />
                <PowerPlant position={[10, 0, 6]} />
                
                {/* Landscaping */}
                <Tree position={[-9, 0, 5]} />
                <Tree position={[-9, 0, -5]} />
                <Tree position={[9, 0, -6]} />
                
                {/* Factory Floor */}
                <FactoryFloor />
                
                {/* CNC Machines */}
                <CNCMachine position={[-4, 0, -3]} status="running" />
                <CNCMachine position={[-4, 0, 3]} status="running" />
                <CNCMachine position={[0, 0, -3]} status="idle" />
                <CNCMachine position={[0, 0, 3]} status="maintenance" />
                
                {/* Robotic Arms */}
                <RoboticArm position={[4, 0, -3]} rotation={0} />
                <RoboticArm position={[4, 0, 3]} rotation={Math.PI} />
                
                {/* Hydraulic Press */}
                <HydraulicPress position={[-2, 0, 0]} />
                
                {/* Laser Cutter */}
                <LaserCutter position={[2, 0, -5]} />
                
                {/* Welding Station */}
                <WeldingStation position={[2, 0, 5]} />
                
                {/* Overhead Crane */}
                <OverheadCrane position={[0, 4, 0]} />
                
                {/* Storage Racks */}
                <StorageRack position={[-6.5, 0, -4]} />
                <StorageRack position={[-6.5, 0, -6]} />
                
                {/* Conveyor Belt */}
                <ConveyorBelt position={[1.5, 0.4, 0]} />
                
                {/* Tanks */}
                <Tank position={[-6.5, 0, 0]} fillLevel={0.8} />
                <Tank position={[-6.5, 0, 3]} fillLevel={0.5} />
                
                {/* Control Cabinets */}
                <ControlCabinet position={[6.5, 0, -4]} />
                <ControlCabinet position={[6.5, 0, -1]} />
                <ControlCabinet position={[6.5, 0, 2]} />
                
                <OrbitControls 
                  ref={controlsRef}
                  enablePan={true} 
                  maxPolarAngle={Math.PI / 2.1} 
                  minDistance={6}
                  maxDistance={25}
                />
                <Environment preset="warehouse" />
              </Canvas>
            </div>
            
            {/* AI Insight */}
            <div className="px-4 py-3 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-primary">AI Analysis:</span> Machine B1 (Assembly Robot) shows 98% efficiency - consider replicating its maintenance schedule to other units. Power plant integration reduces grid dependency by 23%.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Machine Status Panel */}
        <ChartCard
          title="Machine Status"
          subtitle="Click to view details"
          delay={0.5}
          className="max-h-[580px] overflow-auto"
        >
          <div className="space-y-3">
            {machineStatus.map((machine, i) => (
              <motion.div
                key={machine.name}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMachine === machine.name 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => setSelectedMachine(machine.name === selectedMachine ? null : machine.name)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{machine.name}</span>
                  <StatusBadge
                    status={machine.status === 'running' ? 'success' : machine.status === 'idle' ? 'warning' : 'danger'}
                    label={machine.status}
                    pulse={machine.status === 'running'}
                  />
                </div>
                {selectedMachine === machine.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-2 border-t border-border"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="font-medium">{machine.efficiency}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Temperature</span>
                      <span className={`font-medium ${machine.temperature > 50 ? 'text-amber-500' : ''}`}>
                        {machine.temperature}°C
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-medium">{machine.uptime}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard
          title="24h Production Output"
          subtitle="Units produced vs target"
          className="lg:col-span-2"
          delay={0.6}
          insight="Production peaked at 08:00 with 148 units (106% of target). Consider extending shift overlap during this window for maximum efficiency."
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={productionData}>
              <defs>
                <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="output" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#colorOutput)" 
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Equipment Status"
          subtitle="Current distribution"
          delay={0.7}
        >
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Weekly Output */}
      <ChartCard
        title="Weekly Production Summary"
        subtitle="Units produced by day"
        delay={0.8}
        insight="Thursday achieved the highest output (1,620 units). Saturday's reduced capacity is expected due to planned maintenance window. Week-over-week improvement: +8.3%"
      >
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyOutput}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(var(--foreground))'
              }} 
            />
            <Bar dataKey="units" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
