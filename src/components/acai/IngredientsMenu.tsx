'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CupSoda, Droplet, Apple, IceCream, Candy, Sparkles,
  ChevronDown, ChevronUp, Plus, Search
} from 'lucide-react';
import { Product, CupSize, CategoryType, CATEGORIES } from '@/types/acai';
import { MOCK_PRODUCTS_BY_CATEGORY, MOCK_SIZES, MOCK_BASES } from '@/lib/mocks/productsMock';

interface IngredientsMenuProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  onAddIngredient: (product: Product) => void;
  onSelectSize: (size: typeof MOCK_SIZES[0]) => void;
  onSelectBase: (base: typeof MOCK_BASES[0]) => void;
  selectedSizeId?: string;
  selectedBaseId?: string;
  className?: string;
}

const CATEGORY_ICONS: Record<CategoryType, React.ComponentType<{ className?: string }>> = {
  tamanhos: CupSoda,
  bases: Droplet,
  frutas: Apple,
  cremes: IceCream,
  doces: Candy,
  extras: Sparkles,
};

function CategoryTabs({ 
  activeCategory, 
  onChange 
}: { 
  activeCategory: CategoryType; 
  onChange: (cat: CategoryType) => void; 
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2" role="tablist" aria-label="Categorias de ingredientes">
      {CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.id];
        const isActive = activeCategory === cat.id;
        return (
          <motion.button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${cat.id}`}
            id={`tab-${cat.id}`}
            onClick={() => onChange(cat.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CATEGORIES.indexOf(cat) * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300
              ${isActive 
                ? 'bg-gradient-to-r from-neon-purple/20 to-neon-green/20 text-neon-green border border-neon-green/30 shadow-neon-green' 
                : 'text-neutral-400 hover:text-foreground hover:bg-surface/50 border border-neutral-800'
              }
            `}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span>{cat.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function ProductCard({ 
  product, 
  onClick, 
  isSelected = false,
  variant = 'default',
  style 
}: { 
  product: Product | CupSize; 
  onClick: () => void;
  isSelected?: boolean;
  variant?: 'default' | 'size' | 'base';
  style?: React.CSSProperties;
}) {
  const isSize = variant === 'size';
  const isBase = variant === 'base';
  
  return (
    <motion.button
      onClick={onClick}
      style={style}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: isSize || isBase ? 1.02 : 1.05,
        y: -4,
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group flex flex-col items-center p-3 rounded-2xl transition-all duration-300
        ${isSize || isBase 
          ? 'w-full aspect-square min-h-[140px]' 
          : 'w-full aspect-square min-h-[120px]'
        }
        ${isSelected 
          ? 'bg-gradient-to-br from-neon-purple/20 to-neon-green/20 border-2 border-neon-green shadow-neon-green' 
          : 'bg-surface/50 border border-neutral-800 hover:border-neon-purple/50 hover:bg-surface'
        }
        ${isSize && 'justify-between'}
      `}
      aria-pressed={isSelected}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-background/50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`
            w-full h-full object-cover transition-transform duration-500
            ${isSize || isBase ? 'p-2' : 'p-1'}
            ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
          `}
        />
        
        {/* Badge de preço */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 px-2 py-1 bg-neon-purple/90 text-background text-xs font-bold rounded-full shadow-neon-purple"
        >
          +R$ {product.price.toFixed(2).replace('.', ',')}
        </motion.div>
        
        {/* Indicador de selecionado */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-2 left-2 w-5 h-5 bg-neon-green text-background rounded-full flex items-center justify-center"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>
      
      <div className="mt-3 w-full text-center">
        <h4 className="font-medium text-sm truncate pr-2">{product.name}</h4>
        {'description' in product && product.description && (
          <p className="text-xs text-neutral-500 truncate mt-0.5">{product.description}</p>
        )}
      </div>
      
      {/* Botão de adicionar para itens normais */}
      {!isSize && !isBase && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-2 w-full px-3 py-1.5 bg-gradient-to-r from-neon-purple to-neon-green text-background text-xs font-bold rounded-xl shadow-neon-purple opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Adicionar ${product.name}`}
        >
          <Plus className="w-3 h-3 inline-block mr-1" aria-hidden="true" />
          Adicionar
        </motion.button>
      )}
    </motion.button>
  );
}

function SizeSelector({ 
  sizes, 
  selectedId, 
  onSelect 
}: { 
  sizes: typeof MOCK_SIZES;
  selectedId?: string;
  onSelect: (size: typeof MOCK_SIZES[0]) => void;
}) {
  return (
    <motion.div
      id="panel-tamanhos"
      role="tabpanel"
      aria-labelledby="tab-tamanhos"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sizes.map((size, index) => (
          <ProductCard
            key={size.id}
            product={size}
            variant="size"
            isSelected={selectedId === size.id}
            onClick={() => onSelect(size)}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function BaseSelector({ 
  bases, 
  selectedId, 
  onSelect 
}: { 
  bases: typeof MOCK_BASES;
  selectedId?: string;
  onSelect: (base: typeof MOCK_BASES[0]) => void;
}) {
  return (
    <motion.div
      id="panel-bases"
      role="tabpanel"
      aria-labelledby="tab-bases"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bases.map((base, index) => (
          <ProductCard
            key={base.id}
            product={base}
            variant="base"
            isSelected={selectedId === base.id}
            onClick={() => onSelect(base)}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function AdditionsGrid({ 
  products, 
  onAdd,
  category 
}: { 
  products: Product[];
  onAdd: (product: Product) => void;
  category: CategoryType;
}) {
  return (
    <motion.div
      id={`panel-${category}`}
      role="tabpanel"
      aria-labelledby={`tab-${category}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onAdd(product)}
            style={{ animationDelay: `${index * 30}ms` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function IngredientsMenu({ 
  selectedCategory, 
  onCategoryChange, 
  onAddIngredient,
  onSelectSize,
  onSelectBase,
  selectedSizeId,
  selectedBaseId,
  className = ''
}: IngredientsMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtrar produtos baseado na busca
  const getFilteredProducts = (category: CategoryType) => {
    const products = MOCK_PRODUCTS_BY_CATEGORY[category] || [];
    if (!searchQuery.trim()) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const currentProducts = getFilteredProducts(selectedCategory);
  const isSizeCategory = selectedCategory === 'tamanhos';
  const isBaseCategory = selectedCategory === 'bases';

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header com busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" aria-hidden="true" />
        <input
          type="search"
          placeholder="Buscar ingredientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-neutral-800 rounded-xl text-foreground placeholder-neutral-500 focus:border-neon-purple/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all"
          aria-label="Buscar ingredientes"
        />
      </div>

      {/* Abas de categorias */}
      <CategoryTabs activeCategory={selectedCategory} onChange={onCategoryChange} />

      {/* Conteúdo do painel ativo */}
      <AnimatePresence mode="wait">
        {isSizeCategory && (
          <SizeSelector 
            sizes={MOCK_SIZES} 
            selectedId={selectedSizeId} 
            onSelect={onSelectSize} 
          />
        )}
        
        {isBaseCategory && (
          <BaseSelector 
            bases={MOCK_BASES} 
            selectedId={selectedBaseId} 
            onSelect={onSelectBase} 
          />
        )}
        
        {!isSizeCategory && !isBaseCategory && (
          <AdditionsGrid 
            products={currentProducts} 
            onAdd={onAddIngredient}
            category={selectedCategory}
          />
        )}
      </AnimatePresence>

      {/* Estado vazio de busca */}
      {searchQuery.trim() && currentProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-neutral-500"
        >
          <Sparkles className="w-12 h-12 mb-3 text-neutral-700" aria-hidden="true" />
          <p className="text-center">Nenhum ingrediente encontrado para "<span className="font-medium text-foreground">{searchQuery}</span>"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-sm text-neon-purple hover:text-neon-green transition-colors"
          >
            Limpar busca
          </button>
        </motion.div>
      )}
    </div>
  );
}