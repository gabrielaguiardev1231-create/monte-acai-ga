'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, X, Plus, Minus, ShoppingCart, 
  ArrowRight, Loader2, CupSoda
} from 'lucide-react';
import { CupState, CupSize, CupIngredient, formatPrice, calculateTotal } from '@/types/acai';
import { MOCK_SIZES } from '@/lib/mocks/productsMock';

interface CupSummaryProps {
  cupState: CupState;
  onRemoveIngredient: (ingredientId: string) => void;
  onUpdateQuantity: (ingredientId: string, quantity: number) => void;
  onClearCup: () => void;
  onCheckout: () => void;
  onSelectSize: (size: CupSize) => void;
  isLoading?: boolean;
  className?: string;
}

function SizeSelector({ 
  currentSize, 
  onSelect 
}: { 
  currentSize: CupSize | null; 
  onSelect: (size: CupSize) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-neutral-300">Tamanho do Copo</h4>
        <CupSoda className="w-5 h-5 text-neon-purple" aria-hidden="true" />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {MOCK_SIZES.map((size) => (
          <motion.button
            key={size.id}
            onClick={() => onSelect(size)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-3 rounded-xl text-center transition-all duration-300
              ${currentSize?.id === size.id 
                ? 'bg-gradient-to-br from-neon-purple/20 to-neon-green/20 border-2 border-neon-green shadow-neon-green' 
                : 'bg-surface/50 border border-neutral-800 hover:border-neon-purple/50'
              }
            `}
            aria-pressed={currentSize?.id === size.id}
          >
            <div className="font-bold text-sm">{size.volume}</div>
            <div className="text-xs text-neutral-400">{size.name}</div>
            <div className="font-bold text-neon-green mt-1">{formatPrice(size.price)}</div>
            
            {currentSize?.id === size.id && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute top-1 right-1 w-5 h-5 bg-neon-green text-background rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function IngredientListItem({ 
  ingredient, 
  onRemove, 
  onQuantityChange 
}: { 
  ingredient: CupIngredient; 
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}) {
  const quantity = ingredient.quantity;
  
  return (
    <motion.li
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="flex items-center gap-3 p-3 bg-surface/50 border border-neutral-800 rounded-xl hover:border-neon-purple/30 transition-colors"
    >
      <img
        src={ingredient.image}
        alt={ingredient.name}
        className="w-12 h-12 rounded-lg object-cover border border-neutral-700"
        loading="lazy"
      />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{ingredient.name}</p>
        <p className="text-xs text-neutral-400">{formatPrice(ingredient.price)} cada</p>
      </div>
      
      {/* Controle de quantidade */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-purple/20 hover:text-neon-green transition-colors"
          aria-label="Diminuir quantidade"
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </motion.button>
        
        <span className="w-10 text-center font-bold text-sm">{quantity}</span>
        
        <motion.button
          onClick={() => onQuantityChange(quantity + 1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center text-lg hover:bg-neon-green/20 hover:text-neon-green transition-colors"
          aria-label="Aumentar quantidade"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      </div>
      
      <div className="font-bold text-neon-green text-sm min-w-[60px] text-right">
        {formatPrice(ingredient.price * quantity)}
      </div>
      
      <motion.button
        onClick={onRemove}
        whileHover={{ scale: 1.2, rotate: 180 }}
        whileTap={{ scale: 0.8 }}
        className="w-8 h-8 rounded-lg bg-neutral-800/50 text-neutral-400 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
        aria-label={`Remover ${ingredient.name}`}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </motion.button>
    </motion.li>
  );
}

function BaseItem({ 
  base, 
  onRemove 
}: { 
  base: CupIngredient; 
  onRemove: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="flex items-center gap-3 p-3 bg-surface/50 border border-neutral-800 rounded-xl"
    >
      <img
        src={base.image}
        alt={base.name}
        className="w-12 h-12 rounded-lg object-cover border border-neutral-700"
        loading="lazy"
      />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{base.name}</p>
        <p className="text-xs text-neutral-400">Base do açaí</p>
      </div>
      
      <div className="font-bold text-neon-green text-sm">
        {base.price > 0 ? formatPrice(base.price) : 'Inclusa'}
      </div>
      
      <motion.button
        onClick={onRemove}
        whileHover={{ scale: 1.2 }}
        className="w-8 h-8 rounded-lg bg-neutral-800/50 text-neutral-400 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
        aria-label={`Remover base ${base.name}`}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </motion.button>
    </motion.li>
  );
}

export function CupSummary({ 
  cupState, 
  onRemoveIngredient, 
  onUpdateQuantity, 
  onClearCup, 
  onCheckout,
  onSelectSize,
  isLoading = false,
  className = ''
}: CupSummaryProps) {
  const { size, base, ingredients } = cupState;
  const total = calculateTotal(cupState);
  const hasItems = size || base || ingredients.length > 0;
  const totalItems = (size ? 1 : 0) + (base ? 1 : 0) + ingredients.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col h-full bg-surface/30 backdrop-blur-xl border border-neutral-800 rounded-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <CupSoda className="w-5 h-5 text-neon-purple" aria-hidden="true" />
          Seu Copo
        </h3>
        {hasItems && (
          <motion.button
            onClick={onClearCup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
            aria-label="Limpar copo"
          >
            <Trash2 className="w-3 h-3" aria-hidden="true" />
            Limpar
          </motion.button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Seletor de tamanho */}
        <SizeSelector currentSize={size} onSelect={onSelectSize} />
        
        {/* Base selecionada */}
        {base && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h4 className="font-medium text-sm text-neutral-300 flex items-center gap-2">
              Base
              <span className="px-2 py-0.5 text-xs bg-neon-purple/20 text-neon-purple rounded-full">Selecionada</span>
            </h4>
            <AnimatePresence>
              <BaseItem 
                key={base.id} 
                base={base} 
                onRemove={() => onRemoveIngredient(base.id)} 
              />
            </AnimatePresence>
          </motion.div>
        )}

        {/* Ingredientes adicionais */}
        {ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h4 className="font-medium text-sm text-neutral-300 flex items-center gap-2">
              Adicionais ({ingredients.reduce((sum, i) => sum + i.quantity, 0)})
            </h4>
            <AnimatePresence>
              <ul className="space-y-2" role="list" aria-label="Ingredientes no copo">
                {ingredients.map((ingredient) => (
                  <IngredientListItem
                    key={`${ingredient.id}-${ingredient.quantity}`}
                    ingredient={ingredient}
                    onRemove={() => onRemoveIngredient(ingredient.id)}
                    onQuantityChange={(qty) => onUpdateQuantity(ingredient.id, qty)}
                  />
                ))}
              </ul>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Estado vazio */}
        {!hasItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-neutral-500"
          >
            <CupSoda className="w-16 h-16 text-neutral-700 mb-3" aria-hidden="true" />
            <p className="text-center text-sm">Seu copo está vazio</p>
            <p className="text-xs text-neutral-600 mt-1">Selecione um tamanho e adicione ingredientes</p>
          </motion.div>
        )}
      </div>

      {/* Rodapé com total e checkout */}
      {hasItems && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-neutral-800 p-4 space-y-3"
        >
          {/* Resumo de preços */}
          <div className="space-y-2 text-sm">
            {size && (
              <div className="flex justify-between">
                <span className="text-neutral-400">{size.volume} - {size.name}</span>
                <span className="font-medium">{formatPrice(size.price)}</span>
              </div>
            )}
            {base && base.price > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Base: {base.name}</span>
                <span className="font-medium">{formatPrice(base.price)}</span>
              </div>
            )}
            {ingredients.length > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Adicionais ({ingredients.reduce((sum, i) => sum + i.quantity, 0)})</span>
                <span className="font-medium">
                  {formatPrice(ingredients.reduce((sum, i) => sum + i.price * i.quantity, 0))}
                </span>
              </div>
            )}
            
            <div className="border-t border-neutral-700 pt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-neon-green">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Info de itens */}
          <div className="text-xs text-neutral-500 text-center">
            {totalItems} item{totalItems !== 1 ? 's' : ''} no copo
          </div>

          {/* Botão de checkout */}
          <motion.button
            onClick={onCheckout}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2
              bg-gradient-to-r from-neon-green to-neon-purple text-background
              shadow-neon-green hover:shadow-neon-green-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            `}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                Processando...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                Avançar para Entrega
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}