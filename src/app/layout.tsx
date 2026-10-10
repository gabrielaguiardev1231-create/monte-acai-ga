import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Monte Açaí GA - Monte seu açaí e peça no WhatsApp',
    template: '%s | Monte Açaí GA',
  },
  description:
    'Cardápio visual interativo para açaiterias. O cliente monta o copo com animação e envia o pedido direto para o WhatsApp da loja. Sistema SaaS multi-tenant da GA DEV SYSTEM.',
  keywords: [
    'açaí',
    'delivery',
    'whatsapp',
    'cardápio digital',
    'monte seu açaí',
    'saas',
    'multi-tenant',
  ],
  authors: [{ name: 'GA DEV SYSTEM', url: 'https://gadevsystem.com.br' }],
  creator: 'GA DEV SYSTEM',
  publisher: 'GA DEV SYSTEM',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://monteacai.com.br',
    siteName: 'Monte Açaí GA',
    title: 'Monte Açaí GA - Monte seu açaí e peça no WhatsApp',
    description:
      'Cardápio visual interativo para açaiterias. Monte seu copo com animação e peça no WhatsApp.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Monte Açaí GA - Cardápio Visual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monte Açaí GA',
    description: 'Monte seu açaí visualmente e peça no WhatsApp',
    images: ['/og-image.png'],
    creator: '@gadevsystem',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  )
}