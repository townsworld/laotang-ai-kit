"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarDustProps {
  count?: number;
  converging?: boolean;
  onConvergeComplete?: () => void;
}

// 星尘粒子系统 - 汇聚动画
export const StarDust: React.FC<StarDustProps> = ({ 
  count = 2000, 
  converging = false,
  onConvergeComplete 
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const convergedRef = useRef(false);

  // 初始化粒子位置
  const { positions, colors, scales, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // 随机散布在球形空间内
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // 颜色渐变（粉色到蓝色到紫色）
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 0.94; colors[i3 + 1] = 0.67; colors[i3 + 2] = 0.99; // 粉色
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.58; colors[i3 + 1] = 0.77; colors[i3 + 2] = 0.99; // 蓝色
      } else {
        colors[i3] = 0.77; colors[i3 + 1] = 0.71; colors[i3 + 2] = 0.99; // 紫色
      }

      // 粒子大小
      scales[i] = Math.random() * 0.5 + 0.1;

      // 向心速度
      velocities[i3] = -positions[i3] * 0.02;
      velocities[i3 + 1] = -positions[i3 + 1] * 0.02;
      velocities[i3 + 2] = -positions[i3 + 2] * 0.02;
    }

    return { positions, colors, scales, velocities };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    timeRef.current += delta;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    if (converging && !convergedRef.current) {
      // 汇聚模式：粒子向中心螺旋聚集
      let allConverged = true;
      let convergedCount = 0; // 统计已到达中心的粒子数量

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);

        if (distance > 0.5) {
          // 螺旋向心运动 - 降低汇聚速度，给加载留更长的视觉过渡
          // 旋转速度保持不变，仅减缓向心收缩速度
          const speedFactor = 0.12 + (timeRef.current * 0.02); 
          const spiral = timeRef.current * 2 + i * 0.1;
          const shrink = 0.975; // 原 0.95，收缩更慢
          const targetX = Math.cos(spiral) * distance * shrink;
          const targetZ = Math.sin(spiral) * distance * shrink;
          const targetY = y * shrink;

          positions[i3] = THREE.MathUtils.lerp(x, targetX, speedFactor);
          positions[i3 + 1] = THREE.MathUtils.lerp(y, targetY, speedFactor);
          positions[i3 + 2] = THREE.MathUtils.lerp(z, targetZ, speedFactor);
        } else {
          // 已到达中心
          convergedCount++;
          // 稍微抖动保持活力
          positions[i3] *= 0.95;
          positions[i3 + 1] *= 0.95;
          positions[i3 + 2] *= 0.95;
        }
      }

      // 只要 90% 的粒子到达中心就认为完成（不再强制 3 秒超时）
      if ((convergedCount > count * 0.9) && !convergedRef.current) {
        convergedRef.current = true;
        setTimeout(() => {
          onConvergeComplete?.();
        }, 100);
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    } else if (converging && convergedRef.current) {
      // 已经汇聚但在等待数据：保持微弱的闪烁/呼吸，避免“停住”的观感
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const jitter = Math.sin(timeRef.current * 3 + i * 0.37) * 0.02;
        positions[i3] *= 0.99;
        positions[i3 + 1] = positions[i3 + 1] * 0.99 + jitter * 0.5;
        positions[i3 + 2] *= 0.99;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    } else if (!converging) {
      // 待机模式：轻微漂浮
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const wave = Math.sin(timeRef.current + i * 0.1) * 0.02;
        positions[i3 + 1] += wave;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={count}
          array={scales}
          itemSize={1}
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 爆炸绽放效果（汇聚完成后的"砰"）
interface BloomBurstProps {
  trigger?: boolean;
}

export const BloomBurst: React.FC<BloomBurstProps> = ({ trigger = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || !trigger) return;

    timeRef.current += delta;

    if (timeRef.current < 0.5) {
      // 快速扩张
      const scale = timeRef.current * 20;
      meshRef.current.scale.setScalar(scale);
      
      // 透明度衰减
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 1 - timeRef.current * 2;
    } else {
      // 完成后隐藏
      meshRef.current.visible = false;
    }
  });

  if (!trigger) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#F0ABFC"
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
};
