import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Tenant } from '@/types/database'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getTenant(slug: string): Promise<Tenant | null> {
  const supabase = createServerClient()
  const { data } = await supabase
    .rpc('get_tenant_by_slug', { slug_param: slug })
    .single()
  return data as Tenant | null
}

interface TenantData {
  categories: any[];
  products: Array<{ is_cup_base: boolean; is_topping: boolean }>;
  cupSizes: any[];
  deliveryFees: any[];
}

async function getTenantData(tenantId: string): Promise<TenantData> {
  const supabase = createServerClient()

  const [categories, products, cupSizes, deliveryFees] = await Promise.all([
    supabase.rpc('get_tenant_categories', { tenant_id_param: tenantId }),
    supabase.rpc('get_tenant_products', { tenant_id_param: tenantId }),
    supabase.rpc('get_tenant_cup_sizes', { tenant_id_param: tenantId }),
    supabase.rpc('get_tenant_delivery_fees', { tenant_id_param: tenantId }),
  ])

  return {
    categories: categories.data || [],
    products: products.data || [],
    cupSizes: cupSizes.data || [],
    deliveryFees: deliveryFees.data || [],
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tenant = await getTenant(slug)

  if (!tenant) {
    return {
      title: 'Loja não encontrada | Monte Açaí GA',
    }
  }

  return {
    title: `${tenant.name} | Monte seu Açaí`,
    description: `Monte seu açaí personalizado na ${tenant.name} e peça pelo WhatsApp. Entrega rápida e sabores incríveis!`,
    openGraph: {
      title: `${tenant.name} | Monte seu Açaí`,
      description: `Monte seu açaí personalizado na ${tenant.name} e peça pelo WhatsApp.`,
      images: tenant.logo_url ? [tenant.logo_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tenant.name} | Monte seu Açaí`,
      description: `Monte seu açaí personalizado na ${tenant.name} e peça pelo WhatsApp.`,
      images: tenant.logo_url ? [tenant.logo_url] : [],
    },
  }
}

export default async function PublicMenuPage({ params }: PageProps) {
  const { slug } = await params
  const tenant = await getTenant(slug)

  if (!tenant) {
    notFound()
  }

  const { categories, products, cupSizes, deliveryFees } = await getTenantData(tenant.id)

  const bases = products.filter(p => p.is_cup_base)
  const toppings = products.filter(p => p.is_topping)

  const primaryColor = tenant.primary_color || '#03DAC6'
  const primaryGlow = primaryColor.replace(')', ', 0.6)').replace('rgb', 'rgba').replace('#', '')

  return (
    <html lang="pt-BR">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${primaryColor};
              --primary-glow: ${primaryColor}99;
            }
            .neon-border-custom { box-shadow: 0 0 20px ${primaryColor}66, 0 0 40px ${primaryColor}33; }
            .btn-primary { background: ${primaryColor}; color: #0A0A0A; }
            .btn-primary:hover { box-shadow: 0 0 30px ${primaryColor}80, 0 0 60px ${primaryColor}4d; }
            .text-gradient-custom { background: linear-gradient(to right, ${primaryColor}, #03DAC6); -webkit-background-clip: text; background-clip: text; color: transparent; }
          `
        }} />
      </head>
      <body className="min-h-screen bg-background font-sans">
        {/* Background */}
        <div className="fixed inset-0 bg-grid-neon opacity-50" aria-hidden="true" />
        <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float" style={{ backgroundColor: primaryColor }} aria-hidden="true" />

        <main className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="px-4 py-4 lg:px-8 border-b border-neutral-800 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3" aria-label="Voltar ao Monte Açaí GA">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center">
                  <svg className="w-5 h-5 text-background" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <span className="font-display text-lg font-bold text-gradient-neon hidden sm:block">Monte Açaí GA</span>
              </Link>

              <div className="flex-1 max-w-md mx-4">
                <div className="flex items-center gap-2 bg-surface/50 border border-neutral-700 rounded-xl px-4 py-2">
                  {tenant.logo_url ? (
                    <img src={tenant.logo_url} alt={tenant.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center">
                      <span className="text-background font-bold text-lg">{tenant.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="font-semibold text-foreground truncate">{tenant.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="btn-ghost px-4 py-2 text-sm"
                  id="cart-toggle"
                  aria-label="Ver carrinho"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="hidden sm:inline">Carrinho</span>
                  <span className="w-5 h-5 bg-neon-purple text-background text-xs font-bold rounded-full flex items-center justify-center" id="cart-count">0</span>
                </button>
              </div>
            </div>
          </header>

          {/* Hero/Banner */}
          <section className="relative px-4 py-8 lg:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="glass-card rounded-3xl p-6 lg:p-10 relative overflow-hidden neon-border-custom">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-transparent" aria-hidden="true" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
                  <div className="text-center lg:text-left">
                    <h1 className="font-display text-3xl lg:text-5xl font-bold mb-3">
                      Monte seu <span className="text-gradient-custom">{tenant.name}</span>
                    </h1>
                    <p className="text-neutral-300 text-lg">
                      Escolha o tamanho, a base, os complementos e peça no WhatsApp!
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-400 text-sm">
                    <div className="flex items-center gap-2 bg-surface/50 px-3 py-2 rounded-xl border border-neutral-700">
                      <svg className="w-5 h-5 text-neon-green" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span>Entrega disponível</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface/50 px-3 py-2 rounded-xl border border-neutral-700">
                      <svg className="w-5 h-5 text-neon-purple" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      <a href={`https://wa.me/${tenant.whatsapp_phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors">
                        {formatPhone(tenant.whatsapp_phone)}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cup Builder - Placeholder para Etapa 2 */}
          <section className="flex-1 px-4 py-8 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="glass-card rounded-3xl p-8 lg:p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-neon-purple/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h2 className="font-display text-3xl font-bold mb-4">
                  Builder Visual <span className="text-gradient-neon">em desenvolvimento</span>
                </h2>
                <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
                  A interface interativa de montagem do copo com animações fluidas,
                  seleção de ingredientes em tempo real e cálculo de preço dinâmico
                  será implementada na <strong className="text-foreground">Etapa 2</strong>.
                </p>

                {/* Preview dos dados carregados */}
                <div className="grid md:grid-cols-4 gap-4 mt-8 text-left">
                  <DataPreviewCard title="Tamanhos" count={cupSizes.length} icon="🥤" color="neon-purple" />
                  <DataPreviewCard title="Bases" count={bases.length} icon="🍯" color="neon-green" />
                  <DataPreviewCard title="Complementos" count={toppings.length} icon="🍓" color="neon-purple" />
                  <DataPreviewCard title="Categorias" count={categories.length} icon="📂" color="neon-green" />
                </div>

                <div className="mt-8 pt-8 border-t border-neutral-800">
                  <p className="text-neutral-500 text-sm mb-4">Próximos passos da Etapa 2:</p>
                  <ul className="space-y-2 text-sm text-neutral-400 text-left max-w-md mx-auto">
                    <li className="flex items-center gap-2">✅ Animação de ingredientes caindo no copo</li>
                    <li className="flex items-center gap-2">✅ Seleção múltipla de toppings com quantidade</li>
                    <li className="flex items-center gap-2">✅ Cálculo de preço em tempo real</li>
                    <li className="flex items-center gap-2">✅ Validação de pedido mínimo</li>
                    <li className="flex items-center gap-2">✅ Envio formatado para WhatsApp</li>
                    <li className="flex items-center gap-2">✅ Captura de lead (nome + WhatsApp)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Footer simples */}
          <footer className="px-4 py-6 border-t border-neutral-800 bg-surface/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
              <p>Desenvolvido por <strong className="text-foreground">GA DEV SYSTEM</strong></p>
              <div className="flex items-center gap-4">
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors">
                  Suporte WhatsApp
                </a>
              </div>
            </div>
          </footer>
        </main>

        {/* Cart Sidebar - Placeholder */}
        <div
          id="cart-sidebar"
          className="fixed inset-0 z-50 hidden lg:block"
          role="dialog"
          aria-label="Carrinho de compras"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-surface border-l border-neon-purple/30 shadow-neon-purple-lg flex flex-col">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Seu Pedido</h3>
              <button
                id="cart-close"
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                aria-label="Fechar carrinho"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center py-12 text-neutral-500">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p>Seu carrinho está vazio</p>
                <p className="text-sm mt-1">Monte seu açaí para começar</p>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-800 bg-surface/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">Subtotal</span>
                <span id="cart-subtotal" className="font-semibold">R$ 0,00</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">Entrega</span>
                <span id="cart-delivery" className="font-semibold">R$ 0,00</span>
              </div>
              <div className="flex justify-between text-lg font-bold mb-4 text-neon-green">
                <span>Total</span>
                <span id="cart-total">R$ 0,00</span>
              </div>
              <button
                className="btn-primary w-full py-3 rounded-xl font-semibold disabled:opacity-50"
                disabled
                id="checkout-btn"
              >
                Finalizar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

function DataPreviewCard({ title, count, icon, color }: { title: string; count: number; icon: string; color: 'neon-purple' | 'neon-green' }) {
  return (
    <div className={`glass rounded-xl p-4 text-center border border-${color}/30`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-display text-3xl font-bold text-gradient-neon">{count}</div>
      <div className="text-neutral-400 text-sm">{title}</div>
    </div>
  )
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

// Import Link for the header
import Link from 'next/link'