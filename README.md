# Monte Açaí GA 🍇

SaaS Multi-tenant para açaiterias - Cardápio visual interativo onde o cliente monta o copo com animação e envia o pedido direto para o WhatsApp da loja.

Desenvolvido pela **GA DEV SYSTEM** com Next.js 14 (App Router), Supabase, Tailwind CSS e Mercado Pago.

---

## 🚀 Stack Tecnológica

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **Styling**: Tailwind CSS + CSS Variables (Tema Dark + Neon)
- **Payments**: Mercado Pago (Assinaturas + Webhooks)
- **Deploy**: Vercel (recomendado) + Supabase

---

## 📋 Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- Conta na [Vercel](https://vercel.com) (para deploy)

---

## ⚙️ Configuração Inicial

### 1. Clone e instale dependências

```bash
cd "D:\PROJETOS GA DEV SYSTEMS\MonteAçaí GA"
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
MERCADOPAGO_WEBHOOK_SECRET=seu-webhook-secret
MERCADOPAGO_PUBLIC_KEY=APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Monte Açaí GA"
```

### 3. Configure o Supabase

1. Crie um novo projeto no Supabase
2. Vá em **SQL Editor** e execute o script de migração:
   ```bash
   # O arquivo está em: supabase/migrations/20240101000000_initial_schema.sql
   ```
3. Copie a URL e as chaves (anon + service_role) para o `.env.local`
4. Em **Authentication > Settings**, configure:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Configure o Mercado Pago

1. Crie uma aplicação em [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Configure **Webhooks** para:
   - URL: `https://seu-dominio.vercel.app/api/webhooks/mercadopago`
   - Eventos: `subscription_preapproval`, `subscription_authorized_payment`, `payment`
3. Copie o **Access Token** e **Webhook Secret** para o `.env.local`

### 5. Rode o projeto

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── (public)/              # Rotas públicas (cardápio)
│   │   └── [slug]/            # Cardápio dinâmico por tenant
│   ├── (admin)/               # Área administrativa (protegida)
│   ├── api/
│   │   └── webhooks/
│   │       └── mercadopago/   # Webhook do Mercado Pago
│   ├── layout.tsx             # Layout raiz
│   ├── page.tsx               # Landing page
│   └── globals.css            # Estilos globais + tema neon
├── components/
│   ├── ui/                    # Componentes base (Button, Input, Card)
│   ├── builder/               # Componentes do builder de açaí
│   └── admin/                 # Componentes do painel admin
├── lib/
│   └── supabase/
│       ├── client.ts          # Cliente Supabase (browser)
│       └── server.ts          # Cliente Supabase (server + middleware)
├── types/
│   └── database.ts            # Tipos TypeScript gerados do Supabase
├── hooks/                     # Custom React hooks
├── utils/                     # Funções utilitárias
└── styles/                    # Estilos adicionais

supabase/
└── migrations/
    └── 20240101000000_initial_schema.sql  # Schema completo com RLS
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `tenants` | Empresas/Açaiterias (multi-tenant) |
| `subscriptions` | Assinaturas Mercado Pago |
| `categories` | Categorias de produtos por tenant |
| `products` | Produtos/Ingredientes (base, topping) |
| `cup_sizes` | Tamanhos de copo (350ml, 500ml, etc.) |
| `delivery_fees` | Taxas de entrega por bairro |
| `leads` | Leads capturados (nome + WhatsApp) |
| `orders` | Pedidos realizados |
| `profiles` | Perfis de usuários (admin, owner, staff) |

### Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado com políticas:
- **Público**: Leitura de dados de tenants ativos (cardápio)
- **Admin**: Acesso total
- **Tenant Owner**: Gerencia apenas seus próprios dados
- **Inserção pública**: Leads e pedidos para tenants ativos

---

## 🎨 Tema Visual (Dark + Neon)

### Cores Principais

```css
--neon-purple: #BB86FC
--neon-green:  #03DAC6
--surface:     #1E1E1E
--background:  #0A0A0A
```

### Classes Tailwind Customizadas

```css
.btn-neon-purple    /* Botão principal roxo neon */
.btn-neon-green     /* Botão secundário verde neon */
.btn-ghost          /* Botão outline */
.glass              /* Glassmorphism */
.neon-border-purple /* Borda com glow roxo */
.text-gradient-neon /* Texto com gradiente neon */
```

---

## 🔄 Fluxo de Assinatura (Mercado Pago)

1. **Tenant cria conta** → Redirecionado para checkout do Mercado Pago
2. **Pagamento aprovado** → Webhook `subscription_preapproval` recebido
3. **Sistema atualiza**:
   - `tenants.active_subscription = true`
   - `tenants.mp_subscription_id` preenchido
   - `subscriptions` criada com status `active`
4. **Renovação mensal** → Webhook `subscription_authorized_payment`
5. **Cancelamento/Falha** → Status atualizado para `canceled`/`past_due`

---

## 📱 Cardápio Público (Multi-tenant)

Cada açaiteria tem sua URL única:

```
https://seu-dominio.com/[slug]
# Exemplo: https://monteacai.com.br/acai-do-joao
```

O slug é único e configurado no cadastro do tenant.

---

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # ESLint
```

---

## 📦 Deploy na Vercel

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente (mesmas do `.env.local`)
3. **Importante**: Configure o domínio personalizado
4. Atualize o webhook do Mercado Pago para a URL da Vercel

### Variáveis de Ambiente na Vercel

Todas as variáveis do `.env.local` +:
- `NEXT_PUBLIC_APP_URL`: `https://seu-dominio.vercel.app`

---

## 🔐 Autenticação e Autorização

### Roles de Usuário

| Role | Permissões |
|------|------------|
| `admin` | Acesso total ao sistema (GA DEV SYSTEM) |
| `tenant_owner` | Gerencia sua açaiteria (produtos, pedidos, configurações) |
| `tenant_staff` | Visualiza pedidos, gerencia preparo |

### Middleware

O `middleware.ts` protege:
- Rotas `/admin/*` → Requer autenticação + role adequada
- Rotas `/api/*` (exceto webhooks) → Requer autenticação
- Rotas públicas `/`, `/[slug]` → Acesso livre

---

## 🧪 Testes Locais do Webhook

Use **ngrok** para testar webhooks localmente:

```bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000

# Configure no Mercado Pago:
# https://abc123.ngrok.io/api/webhooks/mercadopago
```

---

## 📝 Próximas Etapas

- [ ] **Etapa 2**: Builder Visual do Açaí (animações, drag-drop, tempo real)
- [ ] **Etapa 3**: Painel Admin (gestão de produtos, pedidos, relatórios)
- [ ] **Etapa 4**: Página de Checkout/Assinatura + Onboarding
- [ ] **Etapa 5**: Notificações (Email, WhatsApp Business API)
- [ ] **Etapa 6**: PWA + Otimizações de Performance

---

## 🤝 Contribuição

Desenvolvido internamente pela **GA DEV SYSTEM**.

Para dúvidas ou sugestões: `contato@gadevsystem.com.br`

---

## 📄 Licença

Proprietário - GA DEV SYSTEM © 2024