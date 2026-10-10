-- ============================================
-- MIGRAÇÃO INICIAL - MONTE AÇAÍ GA
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: tenants (Empresas/Açaiterias)
-- ============================================
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  whatsapp_phone TEXT NOT NULL,
  primary_color TEXT DEFAULT '#03DAC6',
  active_subscription BOOLEAN DEFAULT FALSE,
  mp_customer_id TEXT,
  mp_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tenants
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_active_subscription ON public.tenants(active_subscription);

-- RLS para tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - Tenants
-- Público: pode ler tenants ativos (para o cardápio público)
CREATE POLICY "Public can view active tenants" ON public.tenants
  FOR SELECT USING (active_subscription = TRUE);

-- Admin: acesso total
CREATE POLICY "Admin full access" ON public.tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tenant owner: pode ver e atualizar seu próprio tenant
CREATE POLICY "Tenant owner can manage own tenant" ON public.tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = tenants.id
    )
  );

-- ============================================
-- TABELA: subscriptions (Assinaturas Mercado Pago)
-- ============================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'canceled', 'past_due')),
  plan_price DECIMAL(10,2) NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_subscriptions_tenant_id ON public.subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access subscriptions" ON public.subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can view own subscription" ON public.subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = subscriptions.tenant_id
    )
  );

-- ============================================
-- TABELA: categories (Categorias de produtos)
-- ============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_categories_tenant_id ON public.categories(tenant_id);
CREATE INDEX idx_categories_position ON public.categories(tenant_id, position);

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories of active tenant" ON public.categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenants
      WHERE id = categories.tenant_id AND active_subscription = TRUE
    )
  );

CREATE POLICY "Admin full access categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can manage own categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = categories.tenant_id
    )
  );

-- ============================================
-- TABELA: products (Produtos/Ingredientes)
-- ============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_cup_base BOOLEAN DEFAULT FALSE,
  is_topping BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_products_tenant_id ON public.products(tenant_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_cup_base ON public.products(tenant_id, is_cup_base) WHERE is_cup_base = TRUE;
CREATE INDEX idx_products_is_topping ON public.products(tenant_id, is_topping) WHERE is_topping = TRUE;
CREATE INDEX idx_products_is_available ON public.products(tenant_id, is_available) WHERE is_available = TRUE;

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available products of active tenant" ON public.products
  FOR SELECT USING (
    is_available = TRUE AND
    EXISTS (
      SELECT 1 FROM public.tenants
      WHERE id = products.tenant_id AND active_subscription = TRUE
    )
  );

CREATE POLICY "Admin full access products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can manage own products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = products.tenant_id
    )
  );

-- ============================================
-- TABELA: cup_sizes (Tamanhos de copo)
-- ============================================
CREATE TABLE public.cup_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  size_ml INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_cup_sizes_tenant_id ON public.cup_sizes(tenant_id);

-- RLS
ALTER TABLE public.cup_sizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view cup sizes of active tenant" ON public.cup_sizes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenants
      WHERE id = cup_sizes.tenant_id AND active_subscription = TRUE
    )
  );

CREATE POLICY "Admin full access cup_sizes" ON public.cup_sizes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can manage own cup_sizes" ON public.cup_sizes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = cup_sizes.tenant_id
    )
  );

-- ============================================
-- TABELA: delivery_fees (Taxas de entrega por bairro)
-- ============================================
CREATE TABLE public.delivery_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  neighborhood_name TEXT NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_delivery_fees_tenant_id ON public.delivery_fees(tenant_id);

-- RLS
ALTER TABLE public.delivery_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view delivery fees of active tenant" ON public.delivery_fees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenants
      WHERE id = delivery_fees.tenant_id AND active_subscription = TRUE
    )
  );

CREATE POLICY "Admin full access delivery_fees" ON public.delivery_fees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can manage own delivery_fees" ON public.delivery_fees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = delivery_fees.tenant_id
    )
  );

-- ============================================
-- TABELA: leads (Leads de clientes interessados)
-- ============================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_leads_tenant_id ON public.leads(tenant_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert lead for active tenant" ON public.leads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants
      WHERE id = leads.tenant_id AND active_subscription = TRUE
    )
  );

CREATE POLICY "Admin full access leads" ON public.leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can view own leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = leads.tenant_id
    )
  );

-- ============================================
-- TABELA: orders (Pedidos realizados)
-- ============================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  delivery_neighborhood TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivered', 'canceled')),
  payment_method TEXT NOT NULL DEFAULT 'whatsapp' CHECK (payment_method IN ('whatsapp', 'pix', 'card', 'cash')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX idx_orders_status ON public.orders(tenant_id, status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_customer_whatsapp ON public.orders(customer_whatsapp);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert order for active tenant" ON public.orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants
      WHERE id = orders.tenant_id AND active_subscription = TRUE
    )
  );

CREATE POLICY "Admin full access orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can manage own orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tenant_id = orders.tenant_id
    )
  );

-- ============================================
-- TABELA: profiles (Perfis de usuários do auth)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'tenant_staff' CHECK (role IN ('admin', 'tenant_owner', 'tenant_staff')),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admin full access profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Tenant owner can view tenant profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.tenant_id = profiles.tenant_id AND p.role = 'tenant_owner'
    )
  );

-- ============================================
-- TRIGGERS PARA updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cup_sizes_updated_at BEFORE UPDATE ON public.cup_sizes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER delivery_fees_updated_at BEFORE UPDATE ON public.delivery_fees
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- FUNÇÕES AUXILIARES (RPC)
-- ============================================

-- Buscar tenant por slug (para cardápio público)
CREATE OR REPLACE FUNCTION public.get_tenant_by_slug(slug_param TEXT)
RETURNS SETOF public.tenants
LANGUAGE sql
STABLE
AS $$
  SELECT id, slug, name, logo_url, whatsapp_phone, primary_color, active_subscription
  FROM public.tenants
  WHERE slug = slug_param AND active_subscription = TRUE
  LIMIT 1;
$$;

-- Buscar produtos do tenant
CREATE OR REPLACE FUNCTION public.get_tenant_products(tenant_id_param UUID)
RETURNS SETOF public.products
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.products
  WHERE tenant_id = tenant_id_param AND is_available = TRUE
  ORDER BY
    CASE WHEN is_cup_base THEN 0 ELSE 1 END,
    category_id,
    name;
$$;

-- Buscar categorias do tenant
CREATE OR REPLACE FUNCTION public.get_tenant_categories(tenant_id_param UUID)
RETURNS SETOF public.categories
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.categories
  WHERE tenant_id = tenant_id_param
  ORDER BY position, name;
$$;

-- Buscar tamanhos de copo do tenant
CREATE OR REPLACE FUNCTION public.get_tenant_cup_sizes(tenant_id_param UUID)
RETURNS SETOF public.cup_sizes
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.cup_sizes
  WHERE tenant_id = tenant_id_param
  ORDER BY size_ml;
$$;

-- Buscar taxas de entrega do tenant
CREATE OR REPLACE FUNCTION public.get_tenant_delivery_fees(tenant_id_param UUID)
RETURNS SETOF public.delivery_fees
LANGUAGE sql
STABLE
AS $$
  SELECT * FROM public.delivery_fees
  WHERE tenant_id = tenant_id_param
  ORDER BY neighborhood_name;
$$;

-- ============================================
-- DADOS INICIAIS (OPCIONAL - PARA TESTES)
-- ============================================

-- Inserir tenant de exemplo (descomente para usar)
/*
INSERT INTO public.tenants (slug, name, whatsapp_phone, primary_color, active_subscription)
VALUES (
  'acai-teste',
  'Açaí Teste GA',
  '5511999999999',
  '#03DAC6',
  TRUE
);
*/

-- ============================================
-- GRANTS PARA ROLES DO SUPABASE
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON public.tenants TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.cup_sizes TO anon;
GRANT SELECT ON public.delivery_fees TO anon;
GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.orders TO anon;