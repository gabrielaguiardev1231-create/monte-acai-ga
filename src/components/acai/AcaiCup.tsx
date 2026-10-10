'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CupIngredient } from '@/types/acai';

interface AcaiCupProps {
  ingredients: CupIngredient[];
  size?: string;
  className?: string;
}

// Posicionamento dos ingredientes dentro do copo
// Simula o empilhamento natural
function getIngredientPosition(index: number, total: number) {
  const cupHeight = 280; // altura interna do copo
  const cupWidth = 200; // largura interna do copo
  
  // Distribui os ingredientes em camadas de baixo para cima
  const layerHeight = cupHeight / Math.max(total, 1);
  const baseY = cupHeight - (index + 1) * layerHeight + layerHeight / 2;
  
  // Posição X aleatória mas dentro do copo
  const xOffset = (Math.sin(index * 2.5) * 0.3 + Math.cos(index * 1.7) * 0.2) * (cupWidth * 0.35);
  
  // Rotação aleatória entre -15 e 15 graus
  const rotate = (Math.sin(index * 3.14) * 15 + Math.cos(index * 2.71) * 10);
  
  // Escala baseada na "profundidade" (itens de trás menores)
  const scale = 0.7 + (index / Math.max(total, 1)) * 0.3;
  
  return {
    x: xOffset,
    y: -baseY, // Negativo porque o eixo Y do CSS cresce para baixo
    rotate,
    scale,
    zIndex: total - index,
  };
}

function IngredientItem({ 
  ingredient, 
  index, 
  total,
  isNew 
}: { 
  ingredient: CupIngredient; 
  index: number; 
  total: number;
  isNew: boolean;
}) {
  const position = getIngredientPosition(index, total);
  
  // Para ingredientes novos, animar a queda
  const initialY = isNew ? -150 : position.y;
  const initialRotation = isNew ? (Math.random() * 30 - 15) : position.rotate;
  const initialScale = isNew ? 0.3 : position.scale;
  const initialOpacity = isNew ? 0 : 1;
  
  return (
    <motion.div
      key={`${ingredient.id}-${ingredient.quantity}`}
      initial={{
        y: initialY,
        rotate: initialRotation,
        scale: initialScale,
        opacity: initialOpacity,
      }}
      animate={{
        y: position.y,
        rotate: position.rotate,
        scale: position.scale,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        mass: 0.8,
        delay: isNew ? index * 0.05 : 0,
      }}
      style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transformOrigin: 'center center',
        zIndex: position.zIndex,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
      }}
      className="ingredient-item"
    >
      <img
        src={ingredient.image}
        alt={ingredient.name}
        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-white/20 shadow-lg"
        loading="lazy"
      />
      {/* Indicador de quantidade se > 1 */}
      {ingredient.quantity > 1 && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-neon-green text-background text-xs font-bold rounded-full flex items-center justify-center shadow-neon-green"
        >
          x{ingredient.quantity}
        </motion.span>
      )}
    </motion.div>
  );
}

export function AcaiCup({ ingredients, size, className = '' }: AcaiCupProps) {
  // Controla quais ingredientes são "novos" para animação
  const [prevIngredients, setPrevIngredients] = React.useState<CupIngredient[]>([]);
  
  React.useEffect(() => {
    setPrevIngredients(ingredients);
  }, [ingredients.map(i => `${i.id}-${i.quantity}`).join(',')]);
  
  // Determina quais ingredientes são novos
  const isNewIngredient = (ingredient: CupIngredient, index: number) => {
    const prev = prevIngredients[index];
    if (!prev) return true;
    return prev.id !== ingredient.id || prev.quantity !== ingredient.quantity;
  };

  const totalIngredients = ingredients.length;
  
  return (
    <div className={`relative w-full max-w-xs mx-auto ${className}`}>
      {/* Container principal do copo */}
      <div className="relative" style={{ aspectRatio: '1 / 1.6' }}>
        {/* 1. Camada traseira - Sombra e reflexo traseiro do copo */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/30 rounded-full blur-xl" />
          
          {/* Silhueta do copo vazia (fundo) */}
          <svg 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full text-surface-elevated/50" 
            viewBox="0 0 200 320" 
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="cupGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#2d2d4a" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            {/* Corpo do copo */}
            <path
              d="M40 300 Q30 300 30 280 L30 40 Q30 20 50 20 L150 20 Q170 20 170 40 L170 280 Q170 300 160 300 Z"
              fill="url(#cupGlass)"
              stroke="rgba(187,134,252,0.1)"
              strokeWidth="1"
            />
            {/* Base do copo */}
            <ellipse cx="100" cy="305" rx="55" ry="8" fill="rgba(26,26,46,0.2)" />
          </svg>
        </div>
        
        {/* 2. Camada interna - Ingredientes (preenchimento) */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-[85%] z-10 overflow-hidden rounded-b-xl" style={{ borderRadius: '0 0 40px 40px' }}>
          {/* Efeito de preenchimento gradual baseado na quantidade de ingredientes */}
          <AnimatePresence mode="popLayout">
            {ingredients.map((ingredient, index) => (
              <IngredientItem
                key={`${ingredient.id}-${ingredient.quantity}-${index}`}
                ingredient={ingredient}
                index={index}
                total={totalIngredients}
                isNew={isNewIngredient(ingredient, index)}
              />
            ))}
          </AnimatePresence>
          
          {/* Efeito de "líquido" de base no fundo */}
          {ingredients.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0.3 }}
              animate={{ 
                height: `${Math.min(40 + ingredients.length * 15, 120)}px`, 
                opacity: 0.6 
              }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute bottom-0 left-0 right-0 rounded-b-xl"
              style={{
                background: 'linear-gradient(to top, rgba(113,34,134,0.6), rgba(34,197,94,0.2))',
                borderRadius: '0 0 40px 40px',
              }}
              aria-hidden="true"
            />
          )}
        </div>
        
        {/* 3. Camada frontal - Efeito vidro/glassmorphism */}
        <svg 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full z-20 pointer-events-none" 
          viewBox="0 0 200 320" 
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Gradiente para reflexo de vidro */}
            <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="20%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            
            {/* Gradiente para borda neon */}
            <linearGradient id="neonRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(187,134,252,0.3)" />
              <stop offset="50%" stopColor="rgba(3,218,198,0.4)" />
              <stop offset="100%" stopColor="rgba(187,134,252,0.3)" />
            </linearGradient>
          </defs>
          
          {/* Reflexo lateral esquerdo (vidro) */}
          <path
            d="M50 20 Q55 40 55 100 L55 280 Q55 300 45 300"
            fill="none"
            stroke="url(#glassReflection)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          {/* Reflexo lateral direito (vidro) */}
          <path
            d="M150 20 Q145 40 145 100 L145 280 Q145 300 155 300"
            fill="none"
            stroke="url(#glassReflection)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.4"
          />
          
          {/* Borda superior neon */}
          <path
            d="M50 20 L150 20"
            fill="none"
            stroke="url(#neonRim)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="drop-shadow(0 0 8px rgba(187,134,252,0.6))"
          />
          
          {/* Contorno do copo */}
          <path
            d="M40 300 Q30 300 30 280 L30 40 Q30 20 50 20 L150 20 Q170 20 170 40 L170 280 Q170 300 160 300 Z"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
          />
          
          {/* Base do copo */}
          <ellipse 
            cx="100" 
            cy="305" 
            rx="55" 
            ry="8" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="1.5"
          />
          
          {/* Reflexo na base */}
          <ellipse 
            cx="100" 
            cy="302" 
            rx="45" 
            ry="4" 
            fill="url(#glassReflection)" 
            opacity="0.3"
          />
        </svg>
        
        {/* Indicador de tamanho do copo */}
        {size && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-background/90 backdrop-blur rounded-full text-xs font-medium text-neon-green border border-neon-green/30 shadow-neon-green whitespace-nowrap"
            aria-label={`Tamanho: ${size}`}
          >
            {size}
          </motion.div>
        )}
        
        {/* Placeholder quando vazio */}
        {ingredients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-5 pointer-events-none"
            style={{ 
              borderRadius: '0 0 40px 40px',
              paddingBottom: '80px'
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl md:text-8xl text-neutral-700 mb-2"
            >
              🥤
            </motion.div>
            <p className="text-neutral-500 text-sm font-medium text-center px-4">
              Adicione ingredientes<br />para montar seu açaí
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Legenda de quantidade total */}
      {ingredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-neutral-400"
        >
          {ingredients.reduce((sum, i) => sum + i.quantity, 0)} ingrediente{ingredients.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''} no copo
        </motion.div>
      )}
    </div>
  );
}