"use client";

import { motion } from "framer-motion";

// Deterministic node layout (no Math.random to stay SSR-safe & stable).
const nodes = [
  { x: 12, y: 20 }, { x: 30, y: 12 }, { x: 22, y: 42 }, { x: 45, y: 30 },
  { x: 38, y: 58 }, { x: 60, y: 18 }, { x: 55, y: 46 }, { x: 70, y: 62 },
  { x: 82, y: 34 }, { x: 88, y: 66 }, { x: 15, y: 72 }, { x: 42, y: 82 },
  { x: 68, y: 84 }, { x: 90, y: 14 }, { x: 50, y: 68 },
];

const edges: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6],
  [5, 8], [6, 7], [6, 14], [7, 9], [8, 9], [8, 13], [10, 2], [10, 11],
  [11, 14], [11, 12], [12, 7], [14, 7], [5, 13], [4, 11],
];

export function NeuralNetwork() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="node">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
      </defs>

      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="url(#edge)"
          strokeWidth={0.3}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: i * 0.06, ease: "easeOut" }}
        />
      ))}

      {edges.map(([a, b], i) => (
        <motion.circle
          key={`p-${i}`}
          r={0.6}
          fill="#e0e7ff"
          initial={{ cx: nodes[a].x, cy: nodes[a].y, opacity: 0 }}
          animate={{
            cx: [nodes[a].x, nodes[b].x],
            cy: [nodes[a].y, nodes[b].y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: 1 + (i % 6) * 0.4,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {nodes.map((n, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          fill="url(#node)"
          initial={{ r: 0 }}
          animate={{ r: [1.1, 1.6, 1.1] }}
          transition={{
            r: {
              duration: 3,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </svg>
  );
}
