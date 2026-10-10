'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AcaiCup } from '@/components/acai/AcaiCup';
import { IngredientsMenu } from '@/components/acai/IngredientsMenu';
import { CupSummary } from '@/components/acai/CupSummary';
import { CupState, CupSize, Product, CupIngredient, calculateTotal } from '@/types/acai';
import { MOCK_SIZES, MOCK_BASES, MOCK_ALL_ADDITIONALS } from '@/lib/mocks/productsMock';

export default function AcaiBuilderDemo() {
  // Estado do copo
  const [cupState, setCupState] = useState<CupState>({
    size: null,
    base: null,
    ingredients: [],
  });

  // Categoria ativa no menu
  const [activeCategory, setActiveCategory] = useState<'tamanhos' | 'bases' | 'frutas' | 'cremes' | 'doces' | 'extras'>('tamanhos');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Selecionar tamanho
  const handleSelectSize = useCallback((size: CupSize) => {
    setCupState(prev => ({ ...prev, size }));
    // Auto-muda para bases após selecionar tamanho
    setActiveCategory('bases');
  }, []);

  // Selecionar base
  const handleSelectBase = useCallback((base: Product) => {
    setCupState(prev => ({ ...prev, base: { ...base, quantity: 1 } }));
    // Auto-muda para frutas após selecionar base
    setActiveCategory('frutas');
  }, []);

  // Adicionar ingrediente
  const handleAddIngredient = useCallback((product: Product) => {
    setCupState(prev => {
      const existingIndex = prev.ingredients.findIndex(i => i.id === product.id);
      let newIngredients: CupIngredient[];
      
      if (existingIndex >= 0) {
        // Incrementa quantidade
        newIngredients = prev.ingredients.map((ing, idx) => 
          idx === existingIndex 
            ? { ...ing, quantity: ing.quantity + 1 }
            : ing
        );
      } else {
        // Adiciona novo com rotação aleatória
        newIngredients = [
          ...prev.ingredients,
          { 
            ...product, 
            quantity: 1,
            rotation: Math.random() * 30 - 15 
          }
        ];
      }
      
      return { ...prev, ingredients: newIngredients };
    });
  }, []);

  // Remover ingrediente
  const handleRemoveIngredient = useCallback((ingredientId: string) => {
    setCupState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i.id !== ingredientId),
      base: prev.base?.id === ingredientId ? null : prev.base,
      size: prev.size?.id === ingredientId ? null : prev.size,
    }));
  }, []);

  // Atualizar quantidade
  const handleUpdateQuantity = useCallback((ingredientId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveIngredient(ingredientId);
      return;
    }
    
    setCupState(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => 
        ing.id === ingredientId ? { ...ing, quantity } : ing
      ),
    }));
  }, [handleRemoveIngredient]);

  // Limpar copo
  const handleClearCup = useCallback(() => {
    setCupState({
      size: null,
      base: null,
      ingredients: [],
    });
    setActiveCategory('tamanhos');
  }, []);

  // Checkout
  const handleCheckout = useCallback(async () => {
    if (!cupState.size) return;
    
    setIsLoading(true);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Monta mensagem para WhatsApp
    const items: string[] = [];
    if (cupState.size) items.push(`📏 ${cupState.size.volume} - ${cupState.size.name} (${cupState.size.price.toFixed(2).replace('.', ',')})`);
    if (cupState.base) items.push(`🍇 Base: ${cupState.base.name}${cupState.base.price > 0 ? ` (+R$ ${cupState.base.price.toFixed(2).replace('.', ',')})` : ' (inclusa)'}`);
    
    cupState.ingredients.forEach(ing => {
      items.push(`➕ ${ing.name} x${ing.quantity} (R$ ${(ing.price * ing.quantity).toFixed(2).replace('.', ',')})`);
    });
    
    const total = calculateTotal(cupState);
    const message = [
      `🥤 *Novo Pedido - Monte Açaí GA*`,
      ``,
      items.join('\n'),
      ``,
      `💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*`,
      ``,
      `Olá! Gostaria de fazer este pedido.`
    ].join('\n');
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsLoading(false);
  }, [cupState]);

  const total = calculateTotal(cupState);
  const hasItems = cupState.size || cupState.base || cupState.ingredients.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-neon" aria-hidden="true" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" aria-hidden="true" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} aria-hidden="true" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center shadow-neon-purple">
                <svg className="w-5 h-5 text-background" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="font-display text-lg font-bold text-gradient-neon hidden sm:block">Monte Açaí GA</span>
            </div>
            
            {/* Total rápido no header */}
            {hasItems && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-purple/10 to-neon-green/10 border border-neon-purple/30 rounded-xl"
              >
                <span className="text-sm text-neutral-300">Total:</span>
                <span className="font-display text-xl font-bold text-neon-green">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </motion.div>
            )}
          </div>
        </header>

        {/* Layout Principal */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* Lado Esquerdo - Copo Visual + Menu */}
            <div className="flex flex-col gap-6">
              {/* Copo Visual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-4 md:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold">Monte seu Copo</h2>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" aria-hidden="true"></span>
                    <span>Visualização em tempo real</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <AcaiCup 
                    ingredients={cupState.ingredients} 
                    size={cupState.size?.volume}
                  />
                </div>
              </motion.div>

              {/* Menu de Ingredientes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-4 md:p-6 flex-1 min-h-[400px]"
              >
                <IngredientsMenu
                  selectedCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  onAddIngredient={handleAddIngredient}
                  onSelectSize={handleSelectSize}
                  onSelectBase={handleSelectBase}
                  selectedSizeId={cupState.size?.id}
                  selectedBaseId={cupState.base?.id}
                />
              </motion.div>
            </div>

            {/* Lado Direito - Resumo */}
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CupSummary
                  cupState={cupState}
                  onRemoveIngredient={handleRemoveIngredient}
                  onUpdateQuantity={handleUpdateQuantity}
                  onClearCup={handleClearCup}
                  onCheckout={handleCheckout}
                  onSelectSize={handleSelectSize}
                  isLoading={isLoading}
                />
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 border-t border-neutral-800 mt-12">
          <div className="max-w-7xl mx-auto text-center text-sm text-neutral-500">
            <p>Demo do <strong className="text-foreground">Monte Açaí GA</strong> - Cardápio visual interativo para açaiterias</p>
            <p className="mt-1">Desenvolvido pela <a href="https://gadevsystem.com.br" target="_blank" rel="noopener" className="text-neon-purple hover:text-neon-green transition-colors">GA DEV SYSTEM</a></p>
          </div>
        </footer>
      </div>
    </div>
  );
}