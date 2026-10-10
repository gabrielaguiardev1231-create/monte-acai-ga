import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

// Configuração do Mercado Pago
const MERCADOPAGO_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET!

// Tipos de eventos do Mercado Pago que nos interessam
type MPEventType =
  | 'subscription_preapproval'
  | 'subscription_preapproval_plan'
  | 'subscription_authorized_payment'
  | 'payment'

interface MPWebhookPayload {
  id: number
  live_mode: boolean
  type: MPEventType
  date_created: string
  application_id: number
  user_id: number
  version: number
  api_version: string
  action: string
  data: {
    id: string
  }
}

async function verifySignature(payload: string, signature: string): Promise<boolean> {
  if (!MERCADOPAGO_WEBHOOK_SECRET) {
    console.warn('MERCADOPAGO_WEBHOOK_SECRET not configured')
    return true // Em desenvolvimento, permite sem verificação
  }

  const expectedSignature = crypto
    .createHmac('sha256', MERCADOPAGO_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

async function handleSubscriptionPreapproval(dataId: string, supabase: any) {
  // Buscar detalhes da assinatura no Mercado Pago
  const mpResponse = await fetch(
    `https://api.mercadopago.com/preapproval/${dataId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  )

  if (!mpResponse.ok) {
    throw new Error(`Failed to fetch subscription: ${mpResponse.statusText}`)
  }

  const subscription = await mpResponse.json()

  // Encontrar tenant pelo mp_customer_id ou external_reference
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('mp_customer_id', subscription.payer_email)
    .single()

  if (!tenant) {
    console.warn(`Tenant not found for subscription ${dataId}`)
    return
  }

  // Atualizar ou criar registro na tabela subscriptions
  const { error } = await supabase.from('subscriptions').upsert({
    tenant_id: tenant.id,
    status: mapMPStatus(subscription.status),
    plan_price: subscription.auto_recurring?.transaction_amount || 0,
    current_period_end: subscription.auto_recurring?.next_payment_date
      ? new Date(subscription.auto_recurring.next_payment_date).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) throw error

  // Atualizar tenant com subscription_id e status
  await supabase
    .from('tenants')
    .update({
      mp_subscription_id: dataId,
      active_subscription: subscription.status === 'authorized',
      updated_at: new Date().toISOString(),
    })
    .eq('id', tenant.id)
}

async function handleAuthorizedPayment(dataId: string, supabase: any) {
  const mpResponse = await fetch(
    `https://api.mercadopago.com/authorized_payments/${dataId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  )

  if (!mpResponse.ok) return

  const payment = await mpResponse.json()

  // Atualizar subscription se necessário
  if (payment.preapproval_id) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', (
        await supabase
          .from('tenants')
          .select('id')
          .eq('mp_subscription_id', payment.preapproval_id)
          .single()
      ).data?.id)
  }
}

function mapMPStatus(mpStatus: string): 'active' | 'pending' | 'canceled' | 'past_due' {
  switch (mpStatus) {
    case 'authorized':
      return 'active'
    case 'pending':
      return 'pending'
    case 'cancelled':
    case 'cancelled':
      return 'canceled'
    case 'past_due':
      return 'past_due'
    default:
      return 'pending'
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = headers()
    const signature = headersList.get('x-signature') || ''
    const payload = await request.text()

    // Verificar assinatura do webhook
    const isValid = await verifySignature(payload, signature.replace('sha256=', ''))
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body: MPWebhookPayload = JSON.parse(payload)
    const supabase = await createServiceClient()

    console.log(`Mercado Pago Webhook: ${body.type} - ${body.action} - ${body.data.id}`)

    switch (body.type) {
      case 'subscription_preapproval':
        if (body.action === 'created' || body.action === 'updated') {
          await handleSubscriptionPreapproval(body.data.id, supabase)
        }
        break

      case 'subscription_authorized_payment':
        if (body.action === 'created' || body.action === 'updated') {
          await handleAuthorizedPayment(body.data.id, supabase)
        }
        break

      case 'payment':
        // Pagamentos avulsos (não-assinatura)
        console.log('Payment event:', body.data.id)
        break

      default:
        console.log('Unhandled event type:', body.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Permitir GET para verificação do webhook no painel do Mercado Pago
export async function GET() {
  return NextResponse.json({
    message: 'Mercado Pago Webhook endpoint',
    status: 'active',
  })
}