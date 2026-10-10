// Tipos gerados do Supabase - Database Schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          slug: string
          name: string
          logo_url: string | null
          whatsapp_phone: string
          primary_color: string
          active_subscription: boolean
          mp_customer_id: string | null
          mp_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          logo_url?: string | null
          whatsapp_phone: string
          primary_color?: string
          active_subscription?: boolean
          mp_customer_id?: string | null
          mp_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          logo_url?: string | null
          whatsapp_phone?: string
          primary_color?: string
          active_subscription?: boolean
          mp_customer_id?: string | null
          mp_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tenants_mp_customer_id_fkey'
            columns: ['mp_customer_id']
            isOneToOne: false
            referencedRelation: 'mercadopago_customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tenants_mp_subscription_id_fkey'
            columns: ['mp_subscription_id']
            isOneToOne: false
            referencedRelation: 'mercadopago_subscriptions'
            referencedColumns: ['id']
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          tenant_id: string
          status: 'active' | 'pending' | 'canceled' | 'past_due'
          plan_price: number
          current_period_end: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          status: 'active' | 'pending' | 'canceled' | 'past_due'
          plan_price: number
          current_period_end: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          status?: 'active' | 'pending' | 'canceled' | 'past_due'
          plan_price?: number
          current_period_end?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
        Row: {
          id: string
          tenant_id: string
          name: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          id: string
          tenant_id: string
          category_id: string | null
          name: string
          price: number
          image_url: string | null
          is_cup_base: boolean
          is_topping: boolean
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          category_id?: string | null
          name: string
          price: number
          image_url?: string | null
          is_cup_base?: boolean
          is_topping?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          category_id?: string | null
          name?: string
          price?: number
          image_url?: string | null
          is_cup_base?: boolean
          is_topping?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      cup_sizes: {
        Row: {
          id: string
          tenant_id: string
          size_ml: number
          base_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          size_ml: number
          base_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          size_ml?: number
          base_price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cup_sizes_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          }
        ]
      }
      delivery_fees: {
        Row: {
          id: string
          tenant_id: string
          neighborhood_name: string
          fee_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          neighborhood_name: string
          fee_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          neighborhood_name?: string
          fee_amount?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'delivery_fees_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          }
        ]
      }
      leads: {
        Row: {
          id: string
          tenant_id: string
          name: string
          whatsapp: string
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          whatsapp: string
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          whatsapp?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          }
        ]
      }
      orders: {
        Row: {
          id: string
          tenant_id: string
          customer_name: string
          customer_whatsapp: string
          items: Json
          total_amount: number
          delivery_fee: number
          delivery_neighborhood: string | null
          status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'canceled'
          payment_method: 'whatsapp' | 'pix' | 'card' | 'cash'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          customer_name: string
          customer_whatsapp: string
          items: Json
          total_amount: number
          delivery_fee: number
          delivery_neighborhood?: string | null
          status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'canceled'
          payment_method?: 'whatsapp' | 'pix' | 'card' | 'cash'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          customer_name?: string
          customer_whatsapp?: string
          items?: Json
          total_amount?: number
          delivery_fee?: number
          delivery_neighborhood?: string | null
          status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'canceled'
          payment_method?: 'whatsapp' | 'pix' | 'card' | 'cash'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'tenant_owner' | 'tenant_staff'
          tenant_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'tenant_owner' | 'tenant_staff'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'tenant_owner' | 'tenant_staff'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tenant_by_slug: {
        Args: { slug_param: string }
        Returns: {
          id: string
          slug: string
          name: string
          logo_url: string | null
          whatsapp_phone: string
          primary_color: string
          active_subscription: boolean
        }[]
      }
      get_tenant_products: {
        Args: { tenant_id_param: string }
        Returns: {
          id: string
          tenant_id: string
          category_id: string | null
          name: string
          price: number
          image_url: string | null
          is_cup_base: boolean
          is_topping: boolean
          is_available: boolean
        }[]
      }
      get_tenant_categories: {
        Args: { tenant_id_param: string }
        Returns: {
          id: string
          tenant_id: string
          name: string
          position: number
        }[]
      }
    }
    Enums: {
      subscription_status: 'active' | 'pending' | 'canceled' | 'past_due'
      order_status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'canceled'
      payment_method: 'whatsapp' | 'pix' | 'card' | 'cash'
      user_role: 'admin' | 'tenant_owner' | 'tenant_staff'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para uso na aplicação
export type Tenant = Database['public']['Tables']['tenants']['Row']
export type TenantInsert = Database['public']['Tables']['tenants']['Insert']
export type TenantUpdate = Database['public']['Tables']['tenants']['Update']

export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type CupSize = Database['public']['Tables']['cup_sizes']['Row']
export type CupSizeInsert = Database['public']['Tables']['cup_sizes']['Insert']
export type CupSizeUpdate = Database['public']['Tables']['cup_sizes']['Update']

export type DeliveryFee = Database['public']['Tables']['delivery_fees']['Row']
export type DeliveryFeeInsert = Database['public']['Tables']['delivery_fees']['Insert']
export type DeliveryFeeUpdate = Database['public']['Tables']['delivery_fees']['Update']

export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Tipos para o builder de açaí
export interface CupBuilderState {
  size: CupSize | null
  base: Product | null
  toppings: Product[]
  quantities: Record<string, number>
  delivery: {
    neighborhood: DeliveryFee | null
    address: string
    notes: string
  }
  customer: {
    name: string
    whatsapp: string
  }
}

export interface OrderSummary {
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
}