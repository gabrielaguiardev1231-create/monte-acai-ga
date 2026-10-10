'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CupIngredient } from '@/types/acai';

interface AcaiCupProps {
  ingredients: CupIngredient[];
  size?: string;
  className?: string;
}

const ACAI_GRADIENT = 'linear-gradient(to top, #2b0a3d 0%, #360e4b 40%, #4a156e 78%, #5c1d82 100%)';
const CUP_CLIP = 'polygon(3% 0%, 97% 0%, 84% 100%, 16% 100%)';
const CUP_INNER_CLIP = 'polygon(5% 0%, 95% 0%, 83% 100%, 17% 100%)';

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function rotationFor(id: string): number {
  const h = hashString(id);
  return (h % 25) - 12;
}

function getFillPercent(size: string | undefined, itemCount: number): number {
  const s = (size ?? '').toLowerCase();
  let base = 0;
  if (s.includes('350')) base = 52;
  else if (s.includes('500')) base = 62;
  else if (s.includes('700')) base = 72;
  else if (s.includes('litro') || s.includes('1000')) base = 82;
  else if (size) base = 58;
  else if (itemCount > 0) base = 48;
  else return 0;
  const fill = base + Math.min(itemCount, 10) * 1.6;
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
  if (n.includes('condensado')) return '🥛';
  if (n.includes('amendoim') || n.includes('peanut') || n.includes('paçoca') || n.includes('pacoca')) return '🥜';
  if (n.includes('granola')) return '🥣';
  if (n.includes('aveia') || n.includes('chia')) return '🌾';
  if (n.includes('coco')) return '🥥';
  if (n.includes('m&m')) return '🟤';
  if (n.includes('confeito') || n.includes('granulado')) return '✨';
  if (n.includes('mel') || n.includes('honey')) return '🍯';
  if (n.includes('whey') || n.includes('protein')) return '💪';
  if (n.includes('pitaya') || n.includes('dragon')) return '🐉';
  if (n.includes('leite')) return '🥛';
  return '🫐';
}

function drizzleColor(ing: CupIngredient): string {
  const n = `${ing.id} ${ing.name}`.toLowerCase();
  if (n.includes('nutella') || n.includes('avelã') || n.includes('avela')) return '#4a2410';
  if (n.includes('amendoim') || n.includes('peanut')) return '#8a5a2b';
  if (n.includes('condensado')) return '#f2e3c2';
  if (n.includes('mel') || n.includes('honey')) return '#d99a26';
  return '#6b3a1f';
}

type PieceKind = 'slice' | 'dot' | 'sprinkle' | 'drizzle';

interface Piece {
  key: string;
  ing: CupIngredient;
  kind: PieceKind;
  leftPct: number;
  depth: number;
  w: number;
  h: number;
  rotate: number;
  order: number;
}

function expandIntoPieces(ingredients: CupIngredient[]): Piece[] {
  const pieces: Piece[] = [];
  ingredients.forEach((ing) => {
    const qty = Math.max(1, ing.quantity || 1);
    const cat = ing.category;
    if (cat === 'cremes' || cat === 'extras' && /mel|condensado/i.test(`${ing.id} ${ing.name}`)) {
      pieces.push({
        key: `${ing.id}#drizzle`,
        ing,
        kind: 'drizzle',
        leftPct: 50,
        depth: 0,
        w: 0,
        h: Math.min(12 + qty * 4, 24),
        rotate: 0,
        order: pieces.length,
      });
      return;
    }
    if (cat === 'frutas') {
      const count = Math.min(qty * 2, 6);
      for (let k = 0; k < count; k++) {
        if (pieces.length >= 40) break;
        const key = `${ing.id}#s${k}`;
        const h = hashString(key);
        pieces.push({
          key,
          ing,
          kind: 'slice',
          leftPct: 22 + (h % 56),
          depth: (h % 100) / 100,
          w: 42 + (h % 16),
          h: 0,
          rotate: rotationFor(key),
          order: pieces.length,
        });
      }
      return;
    }
    const count = Math.min(qty * 5, 12);
    const isDot = /m&m|confeito|granulado|uva|chia/i.test(`${ing.id} ${ing.name}`);
    for (let k = 0; k < count; k++) {
      if (pieces.length >= 40) break;
      const key = `${ing.id}#p${k}`;
      const h = hashString(key);
      pieces.push({
        key,
        ing,
        kind: isDot ? 'dot' : 'sprinkle',
        leftPct: 21 + (h % 58),
        depth: (h % 100) / 100,
        w: isDot ? 11 + (h % 7) : 13 + (h % 8),
        h: 0,
        rotate: rotationFor(key),
        order: pieces.length,
      });
    }
  });
  return pieces;
}

function PieceImage({ piece }: { piece: Piece }) {
  const [failed, setFailed] = useState(false);
  const emoji = useMemo(() => getFallbackEmoji(piece.ing), [piece.ing]);

  if (piece.kind === 'drizzle') {
    const color = drizzleColor(piece.ing);
    return (
      <div
        aria-label={piece.ing.name}
        style={{
          width: '100%',
          height: piece.h,
          borderRadius: '50%',
          background: `linear-gradient(to bottom, rgba(255,255,255,0.35), transparent 40%), linear-gradient(to bottom, ${color}, ${color}cc)`,
          boxShadow: '0 3px 8px rgba(0,0,0,0.45), inset 0 2px 3px rgba(255,255,255,0.3)',
          overflow: 'hidden',
        }}
      >
        {!failed ? (
          <img
            src={piece.ing.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable={false}
            onError={() => setFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, mixBlendMode: 'luminosity' }}
          />
        ) : null}
      </div>
    );
  }

  if (failed) {
    const fontSize = piece.kind === 'slice' ? 30 : piece.kind === 'dot' ? 13 : 15;
    return (
      <span aria-label={piece.ing.name} style={{ fontSize, lineHeight: 1, filter: 'saturate(1.2) drop-shadow(0 3px 3px rgba(0,0,0,0.5))' }}>
        {emoji}
      </span>
    );
  }

  if (piece.kind === 'slice') {
    const h = Math.round(piece.w * 0.68);
    return (
      <img
        src={piece.ing.image}
        alt={piece.ing.name}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
        style={{
          width: piece.w,
          height: h,
          objectFit: 'cover',
          borderRadius: '46% 46% 52% 52%',
          border: '1.5px solid rgba(255,255,255,0.4)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.35)',
          filter: 'saturate(1.25) contrast(1.06)',
          background: '#241031',
        }}
      />
    );
  }

  const round = piece.kind === 'dot' ? '50%' : '35%';
  return (
    <img
      src={piece.ing.image}
      alt={piece.ing.name}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      style={{
        width: piece.w,
        height: piece.w,
        objectFit: 'cover',
        borderRadius: round,
        border: '1px solid rgba(255,255,255,0.45)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.5)',
        filter: 'saturate(1.3) contrast(1.05)',
        background: '#241031',
      }}
    />
  );
}

export function AcaiCup({ ingredients, size, className = '' }: AcaiCupProps) {
  const totalCount = useMemo(
    () => ingredients.reduce((sum, i) => sum + (i.quantity || 1), 0),
    [ingredients]
  );
  const fillPct = getFillPercent(size, totalCount);
  const pieces = useMemo(() => expandIntoPieces(ingredients), [ingredients]);

  const surfaceTopPct = 100 - fillPct;

  return (
    <div className={`relative w-full max-w-[280px] mx-auto select-none ${className}`}>
      <div className="relative mx-auto" style={{ width: 250, height: 400 }}>
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-1 h-4 w-3/4 rounded-full bg-black/50 blur-xl"
          aria-hidden="true"
        />

        {/* Parede traseira do copo */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            clipPath: CUP_CLIP,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.3))',
          }}
        />

        {/* Miolo: açaí + ingredientes, recortado no formato cônico */}
        <div
          className="absolute overflow-hidden"
          style={{ left: 9, right: 9, top: 12, bottom: 12, clipPath: CUP_INNER_CLIP }}
        >
          {/* Creme de açaí */}
          <AnimatePresence>
            {fillPct > 0 && (
              <motion.div
                key="acai-fill"
                initial={{ height: '0%' }}
                animate={{ height: `${fillPct}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                className="absolute bottom-0 left-0 right-0"
                style={{ background: ACAI_GRADIENT }}
                aria-hidden="true"
              >
                <div
                  className="absolute left-[3%] right-[3%]"
                  style={{
                    top: -12,
                    height: 24,
                    borderRadius: '50%',
                    background:
                      'radial-gradient(ellipse at 35% 30%, #7c2d9e 0%, #5c1d82 35%, #4a156e 60%, #2b0a3d 100%)',
                    boxShadow: 'inset 0 3px 6px rgba(255,255,255,0.25), 0 -2px 10px rgba(0,0,0,0.45)',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background:
                      'radial-gradient(circle at 22% 72%, rgba(255,255,255,0.08) 0 5%, transparent 6%), radial-gradient(circle at 68% 58%, rgba(255,255,255,0.06) 0 4%, transparent 5%), radial-gradient(circle at 48% 86%, rgba(0,0,0,0.28) 0 7%, transparent 8%)',
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ingredientes acumulados dentro do creme */}
          {fillPct > 0 && (
            <div className="absolute inset-0" style={{ zIndex: 15 }}>
              <AnimatePresence mode="popLayout">
                {pieces.map((piece) => {
                  if (piece.kind === 'drizzle') {
                    return (
                      <motion.div
                        key={piece.key}
                        initial={{ y: -80, opacity: 0, scaleY: 0.4 }}
                        animate={{ y: 0, opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.18 } }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{
                          position: 'absolute',
                          left: '8%',
                          right: '8%',
                          top: `calc(${surfaceTopPct}% - 8px)`,
                          zIndex: 30,
                          pointerEvents: 'none',
                        }}
                      >
                        <PieceImage piece={piece} />
                      </motion.div>
                    );
                  }
                  const depthRange = Math.max(fillPct - 8, 10);
                  const topPct = surfaceTopPct + 1.5 + piece.depth * depthRange * 0.82;
                  return (
                    <motion.div
                      key={piece.key}
                      initial={{ y: -80, opacity: 0, scale: 0.6, rotate: piece.rotate * 2 }}
                      animate={{ y: 0, opacity: 1, scale: 1, rotate: piece.rotate }}
                      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.18 } }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: Math.min(piece.order * 0.03, 0.3),
                      }}
                      style={{
                        position: 'absolute',
                        left: `${piece.leftPct}%`,
                        top: `${Math.min(topPct, 93)}%`,
                        marginLeft: piece.kind === 'slice' ? -24 : -8,
                        marginTop: -8,
                        zIndex: 16 + Math.round((1 - piece.depth) * 10),
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 5px 6px rgba(0,0,0,0.5))',
                      }}
                    >
                      <PieceImage piece={piece} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {fillPct === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pb-16 pointer-events-none">
              <motion.div
                animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-7xl text-white/15"
                aria-hidden="true"
              >
                🥤
              </motion.div>
            </div>
          )}
        </div>

        {/* Vidro frontal por cima de tudo */}
        <div
          className="absolute pointer-events-none backdrop-blur-[2px]"
          style={{ left: 9, right: 9, top: 12, bottom: 12, clipPath: CUP_INNER_CLIP, zIndex: 40 }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(102deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 14%, transparent 28%, transparent 74%, rgba(255,255,255,0.04) 88%, rgba(255,255,255,0.09) 100%)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '5%',
              bottom: '7%',
              left: '9%',
              width: 17,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.08) 55%, transparent)',
              filter: 'blur(1px)',
              opacity: 0.75,
            }}
          />
          <div
            className="absolute rounded-full bg-white/25 blur-[1px] opacity-40"
            style={{ top: '9%', bottom: '11%', right: '12%', width: 7 }}
          />
          <div
            className="absolute left-0 right-0 top-0 h-6"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)' }}
          />
        </div>

        {/* Borda cônica + brilho neon contido */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 250 400"
          preserveAspectRatio="none"
          style={{ zIndex: 50 }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="acai-cup-edge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <path
            d="M7 4 L243 4 L211 396 L39 396 Z"
            fill="none"
            stroke="url(#acai-cup-edge)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            opacity="0.8"
            style={{ filter: 'drop-shadow(0 0 7px rgba(34,197,94,0.4)) drop-shadow(0 0 14px rgba(139,92,246,0.3))' }}
          />
          <path d="M18 12 L34 388" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
          <rect x="4" y="0" width="242" height="10" rx="5" fill="rgba(255,255,255,0.14)" />
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
