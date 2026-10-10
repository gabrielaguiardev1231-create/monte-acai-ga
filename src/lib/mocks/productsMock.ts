import { Product, CupSize } from '@/types/acai';

// Using placeholder images from a reliable source for testing
// In production, these would be actual product images
const IMG_BASE = 'https://images.unsplash.com/photo-';
const PLACEHOLDER_IMAGES = {
  // Tamanhos
  'copo-350': '1541783245831-57d6fb0926d3?w=200&h=200&fit=crop&crop=center',
  'copo-500': '1541783245831-57d6fb0926d3?w=200&h=200&fit=crop&crop=center',
  'copo-700': '1541783245831-57d6fb0926d3?w=200&h=200&fit=crop&crop=center',
  'copo-1000': '1541783245831-57d6fb0926d3?w=200&h=200&fit=crop&crop=center',
  
  // Bases
  'acai-tradicional': '1511690656952-34342bb7c2f2?w=200&h=200&fit=crop&crop=center',
  'acai-zero': '1511690656952-34342bb7c2f2?w=200&h=200&fit=crop&crop=center',
  'acai-premium': '1511690656952-34342bb7c2f2?w=200&h=200&fit=crop&crop=center',
  'pitaya': '1550258987-190a2d41a8bf?w=200&h=200&fit=crop&crop=center',
  
  // Frutas
  'morango': '1464965745694-3c7c4d1aef0f?w=200&h=200&fit=crop&crop=center',
  'banana': '1603833665858-e61d17a86224?w=200&h=200&fit=crop&crop=center',
  'kiwi': '1583864415369-0d4c3e3d7e4f?w=200&h=200&fit=crop&crop=center',
  'manga': '1625103608248-4d8e5177d952?w=200&h=200&fit=crop&crop=center',
  'abacaxi': '1615485500704-8e990f9900f7?w=200&h=200&fit=crop&crop=center',
  'uva': '1533174072545-7a4b6ad7a6c3?w=200&h=200&fit=crop&crop=center',
  
  // Cremes
  'nutella': '1626108644-1333751f7b2c?w=200&h=200&fit=crop&crop=center',
  'leite-condensado': '1589984035-3d79f0b5b7b5?w=200&h=200&fit=crop&crop=center',
  'creme-avela': '1626108644-1333751f7b2c?w=200&h=200&fit=crop&crop=center',
  'pasta-amendoim': '1589984035-3d79f0b5b7b5?w=200&h=200&fit=crop&crop=center',
  
  // Doces
  'leite-em-po': '1550989460-0adf9e6d9e8f?w=200&h=200&fit=crop&crop=center',
  'granola': '1517673400-26661b7d31a5?w=200&h=200&fit=crop&crop=center',
  'mms': '1583188150-6a18201c7d81?w=200&h=200&fit=crop&crop=center',
  'confeitos': '1583188150-6a18201c7d81?w=200&h=200&fit=crop&crop=center',
  'coco-ralado': '1550989460-0adf9e6d9e8f?w=200&h=200&fit=crop&crop=center',
  'paçoca': '1615485500704-8e990f9900f7?w=200&h=200&fit=crop&crop=center',
  
  // Extras
  'mel': '1587049352-3f1d1a1a5e8b?w=200&h=200&fit=crop&crop=center',
  'whey-protein': '1593095948071-474c5cc29897?w=200&h=200&fit=crop&crop=center',
  'chia': '1583864415369-0d4c3e3d7e4f?w=200&h=200&fit=crop&crop=center',
  'aveia': '1583864415369-0d4c3e3d7e4f?w=200&h=200&fit=crop&crop=center',
};

function img(key: keyof typeof PLACEHOLDER_IMAGES) {
  return `${IMG_BASE}${PLACEHOLDER_IMAGES[key]}`;
}

// Tamanhos dos copos
export const MOCK_SIZES: CupSize[] = [
  { id: 'tam-350', name: 'Pequeno', volume: '350ml', price: 14.90, image: img('copo-350') },
  { id: 'tam-500', name: 'Médio', volume: '500ml', price: 19.90, image: img('copo-500') },
  { id: 'tam-700', name: 'Grande', volume: '700ml', price: 24.90, image: img('copo-700') },
  { id: 'tam-1000', name: 'Família', volume: '1 Litro', price: 32.90, image: img('copo-1000') },
];

// Bases de açaí
export const MOCK_BASES: Product[] = [
  { id: 'base-acai-tradicional', name: 'Açaí Tradicional', price: 0, image: img('acai-tradicional'), category: 'bases', description: 'Açaí puro com guaraná, sabor autêntico' },
  { id: 'base-acai-zero', name: 'Açaí Zero Açúcar', price: 2.00, image: img('acai-zero'), category: 'bases', description: 'Sem adição de açúcares, adoçado com stevia' },
  { id: 'base-acai-premium', name: 'Açaí Premium', price: 4.00, image: img('acai-premium'), category: 'bases', description: 'Polpa de açaí extra concentrada, mais cremoso' },
  { id: 'base-pitaya', name: 'Pitaya (Dragon Fruit)', price: 5.00, image: img('pitaya'), category: 'bases', description: 'Base de pitaya rosa, refrescante e exótica' },
];

// Frutas
export const MOCK_FRUTAS: Product[] = [
  { id: 'fruta-morango', name: 'Morango', price: 2.50, image: img('morango'), category: 'frutas', description: 'Morangos frescos picados' },
  { id: 'fruta-banana', name: 'Banana', price: 1.50, image: img('banana'), category: 'frutas', description: 'Banana nanica em rodelas' },
  { id: 'fruta-kiwi', name: 'Kiwi', price: 3.00, image: img('kiwi'), category: 'frutas', description: 'Kiwi fresco em cubos' },
  { id: 'fruta-manga', name: 'Manga', price: 2.50, image: img('manga'), category: 'frutas', description: 'Manga palmer em cubos' },
  { id: 'fruta-abacaxi', name: 'Abacaxi', price: 2.00, image: img('abacaxi'), category: 'frutas', description: 'Abacaxi caramelizado' },
  { id: 'fruta-uva', name: 'Uva Verde', price: 3.00, image: img('uva'), category: 'frutas', description: 'Uvas sem sementes cortadas ao meio' },
];

// Cremes
export const MOCK_CROMES: Product[] = [
  { id: 'creme-nutella', name: 'Nutella', price: 4.00, image: img('nutella'), category: 'cremes', description: 'Creme de avelã com cacau' },
  { id: 'creme-leite-condensado', name: 'Leite Condensado', price: 2.00, image: img('leite-condensado'), category: 'cremes', description: 'Leite condensado cremoso' },
  { id: 'creme-avela', name: 'Creme de Avelã', price: 3.50, image: img('creme-avela'), category: 'cremes', description: 'Creme artesanal de avelã' },
  { id: 'creme-pasta-amendoim', name: 'Pasta de Amendoim', price: 3.00, image: img('pasta-amendoim'), category: 'cremes', description: 'Pasta de amendoim integral' },
];

// Doces
export const MOCK_DOCES: Product[] = [
  { id: 'doce-leite-em-po', name: 'Leite em Pó', price: 1.50, image: img('leite-em-po'), category: 'doces', description: 'Leite em pó polvilhado' },
  { id: 'doce-granola', name: 'Granola', price: 2.00, image: img('granola'), category: 'doces', description: 'Granola crocante com mel' },
  { id: 'doce-mms', name: 'M&Ms', price: 2.50, image: img('mms'), category: 'doces', description: 'M&Ms coloridos' },
  { id: 'doce-confeitos', name: 'Confeitos Coloridos', price: 1.50, image: img('confeitos'), category: 'doces', description: 'Granulados coloridos' },
  { id: 'doce-coco-ralado', name: 'Coco Ralado', price: 1.00, image: img('coco-ralado'), category: 'doces', description: 'Coco fresco ralado' },
  { id: 'doce-pacoca', name: 'Paçoca', price: 2.00, image: img('paçoca'), category: 'doces', description: 'Paçoca de amendoim esfarelada' },
];

// Extras
export const MOCK_EXTRAS: Product[] = [
  { id: 'extra-mel', name: 'Mel', price: 1.50, image: img('mel'), category: 'extras', description: 'Mel puro de flores silvestres' },
  { id: 'extra-whey', name: 'Whey Protein', price: 5.00, image: img('whey-protein'), category: 'extras', description: 'Proteína sabor baunilha ou chocolate' },
  { id: 'extra-chia', name: 'Chia', price: 2.00, image: img('chia'), category: 'extras', description: 'Sementes de chia hidratadas' },
  { id: 'extra-aveia', name: 'Aveia em Flocos', price: 1.50, image: img('aveia'), category: 'extras', description: 'Aveia integral em flocos finos' },
];

// Todos os produtos agrupados por categoria
export const MOCK_PRODUCTS_BY_CATEGORY: Record<string, Product[]> = {
  tamanhos: MOCK_SIZES as unknown as Product[],
  bases: MOCK_BASES,
  frutas: MOCK_FRUTAS,
  cremes: MOCK_CROMES,
  doces: MOCK_DOCES,
  extras: MOCK_EXTRAS,
};

// Array flat de todos os adicionais (exclui tamanhos e bases)
export const MOCK_ALL_ADDITIONALS: Product[] = [
  ...MOCK_FRUTAS,
  ...MOCK_CROMES,
  ...MOCK_DOCES,
  ...MOCK_EXTRAS,
];