'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CupIngredient } from '@/types/acai';

interface AcaiCupProps {
  ingredients: CupIngredient[];
  size?: string;
  className?: string;
}

const ACAI_GRADIENT = 'linear-gradient(to top, #2e0854 0%, #3b0a5e 45%, #4a1268 75%, #5b1a7a 100%)';
const CUP_CLIP = 'polygon(2% 0%, 98% 0%, 86% 100%, 14% 100%)';
const CUP_INNER_CLIP = 'polygon(4% 0%, 96% 0%, 85% 100%, 15% 100%)';

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function rotationFor(id: string, preset?: number): number {
  if (typeof preset === 'number' && Number.isFinite(preset)) {
    return Math.max(-15, Math.min(15, preset));
  }
  const h = hashString(id);
  return (h % 31) - 15;
}

function getFillPercent(size: string | undefined, itemCount: number): number {
  if (!size && itemCount === 0) return 0;
  let base = 42;
  const s = (size ?? '').toLowerCase();
  if (s.includes('350')) base = 52;
  else if (s.includes('500')) base = 62;
  else if (s.includes('700')) base = 72;
  else if (s.includes('1 litro') || s.includes('1000') || s.includes('litro')) base = 82;
  else if (size) base = 58;
  const fill = base + Math.min(itemCount, 10) * 2.2;
  return Math.max(0, Math.min(90, fill));
}

function getFallbackEmoji(ing: CupIngredient): string {
  const n = `${ing.id} ${ing.name} ${ing.category}`.toLowerCase();
  if (n.includes('morango') || n.includes('strawberry')) return '🍓';
  if (n.includes('banana')) return '🍌';
  if (n.includes('kiwi')) return '🥝';
  if (n.includes('manga') || n.includes('mango')) return '🥭';
  if (n.includes('abacaxi') || n.includes('pineapple')) return '🍍';
  if (n.includes('uva') || n.includes('grape')) return '🍇';
  if (n.includes('nutella') || n.includes('avelã') || n.includes('avela')) return '🍫';
  if (n.includes('leite condensado') || n.includes('condensado')) return '🥛';
  if (n.includes('amendoim') || n.includes('peanut') || n.includes('paçoca') || n.includes('pacoca')) return '🥜';
  if (n.includes('granola') || n.includes('aveia') || n.includes('chia')) return '🌾';
  if (n.includes('coco')) return '🥥';
  if (n.includes('m&m') || n.includes('confeito') || n.includes('granulado')) return '🍬';
  if (n.includes('mel') || n.includes('honey')) return '🍯';
  if (n.includes('whey') || n.includes('protein')) return '💪';
  if (n.includes('pitaya') || n.includes('dragon')) return '🐉';
  if (n.includes('leite em pó') || n.includes('leite-em-po') || n.includes('leite')) return '☁️';
  return '🫐';
}

interface VisualItem extends CupIngredient {
  visualKey: string;
  visualIndex: number;
}

function ToppingImage({ item }: { item: CupIngredient }) {
  const [failed, setFailed] = useState(false);
  const emoji = useMemo(() => getFallbackEmoji(item), [item]);

  if (failed) {
    return (
      <div
        aria-label={item.name}
        className="flex items-center justify-center rounded-full"
        style={{
          width: 46,
          height: 46,
          fontSize: 28,
          lineHeight: 1,
          background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), rgba(255,255,255,0.06) 55%, rgba(0,0,0,0.35))',
          boxShadow: '0 6px 14px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.25)',
          filter: 'saturate(1.15)',
        }}
      >
        <span aria-hidden="true">{emoji}</span>
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={item.name}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      style={{
        width: 46,
        height: 46,
        objectFit: 'cover',
        borderRadius: '9999px',
        border: '2px solid rgba(255,255,255,0.35)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.35)',
        filter: 'saturate(1.2) contrast(1.05)',
        background: '#1c0b2e',
      }}
    />
  );
}

function ToppingItem({
  item,
  leftPct,
  topPx,
  rotate,
}: {
  item: VisualItem;
  leftPct: number;
  topPx: number;
  rotate: number;
}) {
  return (
    <motion.div
      key={item.visualKey}
      initial={{ y: -120, opacity: 0, scale: 0.55, rotate: rotate * 2 }}
      animate={{ y: 0, opacity: 1, scale: 1, rotate }}
      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 17, mass: 0.9 }}
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: topPx,
        marginLeft: -23,
        zIndex: 20 + item.visualIndex,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))',
      }}
    >
      <ToppingImage item={item} />
    </motion.div>
  );
}

export function AcaiCup({ ingredients, size, className = '' }: AcaiCupProps) {
  const visualItems: VisualItem[] = useMemo(() => {
    const flat: VisualItem[] = [];
    ingredients.forEach((ing) => {
      const copies = Math.max(1, Math.min(ing.quantity || 1, 3));
      for (let k = 0; k < copies; k++) {
        if (flat.length >= 12) break;
        flat.push({ ...ing, visualKey: `${ing.id}#${k}`, visualIndex: flat.length });
      }
    });
    return flat;
  }, [ingredients]);

  const totalCount = useMemo(
    () => ingredients.reduce((sum, i) => sum + (i.quantity || 1), 0),
    [ingredients]
  );

  const fillPct = getFillPercent(size, totalCount);

  const positions = useMemo(() => {
    const n = visualItems.length;
    return visualItems.map((item, i) => {
      let leftPct: number;
      if (n === 1) leftPct = 50;
      else {
        const spread = 62;
        leftPct = 50 + (i / (n - 1) - 0.5) * spread;
        leftPct += ((hashString(item.visualKey) % 11) - 5) * 0.7;
        leftPct = Math.max(22, Math.min(78, leftPct));
      }
      const jitter = ((hashString(item.visualKey + ':y') % 13) - 6) * 1.6;
      const rotate = rotationFor(item.visualKey, item.rotation);
      return { leftPct, jitter, rotate };
    });
  }, [visualItems]);

  return (
    <div className={`relative w-full max-w-[280px] mx-auto select-none ${className}`}>
      <div className="relative mx-auto" style={{ width: 250, height: 400 }}>
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-2 h-4 w-3/4 rounded-full bg-black/50 blur-xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            clipPath: CUP_CLIP,
            background: 'rgba(255,255,255,0.045)',
            boxShadow: '0 0 24px rgba(34,197,94,0.22), 0 0 48px rgba(139,92,246,0.22)',
            filter: 'drop-shadow(0 0 14px rgba(34,197,94,0.28)) drop-shadow(0 0 26px rgba(139,92,246,0.22))',
          }}
        />

        <div
          className="absolute overflow-hidden"
          style={{
            left: 8,
            right: 8,
            top: 10,
            bottom: 10,
            clipPath: CUP_INNER_CLIP,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.01) 30%, rgba(0,0,0,0.25))',
          }}
        >
          <AnimatePresence mode="popLayout">
            {fillPct > 0 && (
              <motion.div
                key="acai-fill"
                initial={{ height: '0%' }}
                animate={{ height: `${fillPct}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                className="absolute bottom-0 left-0 right-0"
                style={{ background: ACAI_GRADIENT }}
                aria-hidden="true"
              >
                <div
                  className="absolute -top-[11px] left-[4%] right-[4%]"
                  style={{
                    height: 22,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at 35% 30%, #7c2d9e 0%, #5b1a7a 35%, #4a1268 60%, #2e0854 100%)',
                    boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.22), 0 -2px 10px rgba(0,0,0,0.4)',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      'radial-gradient(circle at 20% 70%, rgba(255,255,255,0.10) 0 6%, transparent 7%), radial-gradient(circle at 70% 55%, rgba(255,255,255,0.08) 0 5%, transparent 6%), radial-gradient(circle at 45% 85%, rgba(0,0,0,0.25) 0 8%, transparent 9%)',
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {visualItems.length > 0 && fillPct > 0 && (
            <div className="absolute inset-0" style={{ zIndex: 15 }}>
              <AnimatePresence mode="popLayout">
                {visualItems.map((item, i) => {
                  const surfaceTopPct = 100 - fillPct;
                  const innerH = 380;
                  const topPx = (surfaceTopPct / 100) * innerH - 26 + positions[i].jitter;
                  return (
                    <ToppingItem
                      key={item.visualKey}
                      item={item}
                      leftPct={positions[i].leftPct}
                      topPx={topPx}
                      rotate={positions[i].rotate}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {visualItems.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pb-16 pointer-events-none">
              <motion.div
                animate={{ y: [0, -8, 0], opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-7xl text-white/15"
                aria-hidden="true"
              >
                🥤
              </motion.div>
            </div>
          )}
        </div>

        <div
          className="absolute pointer-events-none backdrop-blur-[2px]"
          style={{ left: 8, right: 8, top: 10, bottom: 10, clipPath: CUP_INNER_CLIP, zIndex: 40 }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 12%, transparent 26%, transparent 72%, rgba(255,255,255,0.05) 88%, rgba(255,255,255,0.12) 100%)',
            }}
          />
          <div
            className="absolute top-[4%] bottom-[6%] left-[10%] w-[16px] rounded-full"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 60%, transparent)',
              filter: 'blur(1px)',
              opacity: 0.7,
            }}
          />
          <div
            className="absolute top-[8%] bottom-[10%] right-[13%] w-[7px] rounded-full bg-white/25 blur-[1px] opacity-50"
          />
        </div>

        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 250 400"
          preserveAspectRatio="none"
          style={{ zIndex: 50 }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="acai-cup-neon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M5 2 L245 2 L214 398 L36 398 Z"
            fill="none"
            stroke="url(#acai-cup-neon)"
            strokeWidth="3"
            strokeLinejoin="round"
            opacity="0.85"
            style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.55)) drop-shadow(0 0 16px rgba(139,92,246,0.4))' }}
          />
          <path
            d="M14 8 L30 390"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>

        {size && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-[60] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-[#0d0d0f]/90 backdrop-blur border border-[#22c55e]/40 text-[#22c55e]"
            style={{ boxShadow: '0 0 14px rgba(34,197,94,0.35)' }}
            aria-label={`Tamanho: ${size}`}
          >
            {size}
          </motion.div>
        )}
      </div>

      {totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-sm text-neutral-400"
        >
          {totalCount} {totalCount === 1 ? 'item no copo' : 'itens no copo'}
        </motion.div>
      )}
    </div>
  );
}
