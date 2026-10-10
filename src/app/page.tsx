import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-neon" aria-hidden="true" />

      {/* Floating orbs for neon glow effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} aria-hidden="true" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-6 lg:px-12">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center shadow-neon-purple">
                <svg className="w-6 h-6 text-background" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-gradient-neon">Monte Açaí GA</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="btn-ghost hidden sm:inline-flex"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="btn-neon-purple"
              >
                Começar Grátis
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-6 lg:px-12 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-8 animate-in">
              <span className="text-xs font-medium text-neon-purple">NOVO</span>
              <span className="text-xs font-medium text-neon-green">Cardápio Visual com Animação</span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold mb-6 animate-in delay-100">
              Monte seu <span className="text-gradient-neon">Açaí Perfeito</span>
              <br />
              <span className="text-neon-green">Peça no WhatsApp</span>
            </h1>

            <p className="text-lg lg:text-xl text-neutral-300 max-w-3xl mx-auto mb-10 animate-in delay-200">
              Cardápio digital interativo para açaiterias. Seu cliente monta o copo visualmente,
              vê o preço em tempo real e envia o pedido direto para o WhatsApp da loja.
              Sistema SaaS completo com gestão de assinaturas via Mercado Pago.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in delay-300">
              <Link
                href="/builder"
                className="btn-neon-green w-full sm:w-auto text-lg px-8 py-4"
              >
                Testar Builder do Copo
              </Link>
              <Link
                href="/register"
                className="btn-neon-purple w-full sm:w-auto text-lg px-8 py-4"
              >
                Criar Minha Loja
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-neutral-500 text-sm animate-in delay-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-green" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-green" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Sem taxa de instalação</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-green" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Pagamento via PIX/Cartão</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-green" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Suporte GA DEV SYSTEM</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="demo" className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">
                Tudo que sua <span className="text-gradient-neon">açaiteria precisa</span>
              </h2>
              <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                Plataforma completa para gerenciar seu cardápio, pedidos e assinaturas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 lg:px-12 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">
                Como <span className="text-gradient-neon">funciona</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-12 lg:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-green/10" aria-hidden="true" />
              <div className="relative z-10">
                <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6">
                  Pronto para <span className="text-gradient-neon">começar</span>?
                </h2>
                <p className="text-lg text-neutral-300 mb-8 max-w-lg mx-auto">
                  Crie sua loja em minutos. 14 dias grátis, sem cartão de crédito.
                  Cancele quando quiser.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="btn-neon-green text-lg px-10 py-4 w-full sm:w-auto"
                  >
                    Começar Grátis por 14 Dias
                  </Link>
                  <Link
                    href="#contact"
                    className="btn-ghost text-lg px-10 py-4 w-full sm:w-auto"
                  >
                    Falar com Vendas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-12 px-6 lg:px-12 border-t border-neutral-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center shadow-neon-purple">
                    <svg className="w-6 h-6 text-background" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="font-display text-xl font-bold text-gradient-neon">Monte Açaí GA</span>
                </div>
                <p className="text-neutral-400 max-w-sm">
                  Desenvolvido pela <strong className="text-foreground">GA DEV SYSTEM</strong> —
                  Soluções tecnológicas para negócios de alimentação.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Produto</h4>
                <ul className="space-y-2 text-neutral-400 text-sm">
                  <li><Link href="#features" className="hover:text-neon-green transition-colors">Funcionalidades</Link></li>
                  <li><Link href="#pricing" className="hover:text-neon-green transition-colors">Preços</Link></li>
                  <li><Link href="#demo" className="hover:text-neon-green transition-colors">Demo</Link></li>
                  <li><Link href="/docs" className="hover:text-neon-green transition-colors">Documentação</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2 text-neutral-400 text-sm">
                  <li><Link href="/about" className="hover:text-neon-green transition-colors">Sobre</Link></li>
                  <li><Link href="/blog" className="hover:text-neon-green transition-colors">Blog</Link></li>
                  <li><Link href="/careers" className="hover:text-neon-green transition-colors">Carreiras</Link></li>
                  <li><Link href="/contact" className="hover:text-neon-green transition-colors">Contato</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-neutral-500 text-sm">
                © {new Date().getFullYear()} Monte Açaí GA. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-6 text-neutral-500 text-sm">
                <Link href="/privacy" className="hover:text-neon-green transition-colors">Privacidade</Link>
                <Link href="/terms" className="hover:text-neon-green transition-colors">Termos</Link>
                <Link href="/cookies" className="hover:text-neon-green transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

const features = [
  {
    title: 'Builder Visual',
    description: 'Cliente monta o copo arrastando ingredientes com animação fluida e vê o preço em tempo real.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: 'Pedido no WhatsApp',
    description: 'Pedido formatado automaticamente com todos os detalhes, enviado direto para o WhatsApp da loja.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.372-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 3.43 3.43 0 01-.966-2.464 4.21 4.21 0 001.474-2.364 3.74 3.74 0 01.865-2.472c.297-.149 1.09.13 1.292 0 .213-.14.997-2.096 2.18-2.337.933-.19 1.786.19 2.146.708.412.598.276 1.313.1 1.757-.173.443-1.2.996-2.443 1.266-.372.08-1.577.273-1.577.669 0 .31.33.606.643.733.36.148.434.162.905.099.47-.065 1.583-.534 1.834-1.207.237-.631.197-1.06.124-1.184-.074-.124-.432-.075-.805-.173a14.07 14.07 0 01-2.443-2.516 10.46 10.46 0 00-3.946-.687c-.777 0-1.77.224-3.002 2.21-1.738 2.806-1.906 3.748-1.906 3.748H3.194v5.262c0 .606.414 1.127 1.04 1.37.857.347 5.412 1.878 5.412 5.123 0 1.832-.68 3.73-2.658 4.601-1.286.56-2.61.76-3.166 1.029-.307.152-.592.08-.793-.05zm.03-11.197c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.372-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
      </svg>
    ),
  },
  {
    title: 'Gestão de Assinaturas',
    description: 'Cobrança automática via Mercado Pago (PIX/Cartão). Webhook atualiza status de acesso em tempo real.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Multi-Tenant',
    description: 'Cada açaiteria tem seu subdomínio (slug), cardápio próprio, cores, WhatsApp e configurações isoladas.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
]

const steps = [
  {
    number: '01',
    title: 'Cadastre sua Loja',
    description: 'Crie sua conta, configure nome, logo, WhatsApp, cores da marca e preços dos ingredientes.',
  },
  {
    number: '02',
    title: 'Configure o Cardápio',
    description: 'Adicione bases, complementos, tamanhos de copo, bairros de entrega e taxas.',
  },
  {
    number: '03',
    title: 'Compartilhe seu Link',
    description: 'Divulgue seu link exclusivo (seuloja.monteacai.com.br) e receba pedidos no WhatsApp.',
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <div className="glass-card rounded-2xl p-6 card-hover animate-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
      <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-4">
        {feature.icon}
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
    </div>
  )
}

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  return (
    <div className="glass-card rounded-2xl p-6 relative animate-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
      <div className="absolute -top-3 left-6 w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center text-background font-bold text-lg">
        {step.number}
      </div>
      <div className="pt-4">
        <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
      </div>
    </div>
  )
}