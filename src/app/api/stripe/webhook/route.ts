import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDB from '@/lib/mongodb'
import Order from '@/models/order'

// Vercel için gerekli config
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	typescript: true,
	apiVersion: '2025-10-29.clover',
})

export async function POST(req: Request) {
	const startTime = Date.now()
	console.log('[Webhook] Endpoint called at', new Date().toISOString())
	
	const signature = req.headers.get('stripe-signature')
	if (!signature) {
		console.error('[Webhook] No signature header found')
		return NextResponse.json(
			{ received: false, error: 'Missing stripe-signature header' },
			{ status: 400 }
		)
	}

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
	if (!webhookSecret) {
		console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured')
		return NextResponse.json(
			{ error: 'Webhook secret not configured' },
			{ status: 500 }
		)
	}

	let payload: string
	try {
		payload = await req.text()
	} catch (err: any) {
		console.error('[Webhook] Failed to read request body:', err)
		return NextResponse.json(
			{ error: 'Failed to read request body' },
			{ status: 400 }
		)
	}

	let event: Stripe.Event
	try {
		event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
		console.log('[Webhook] Event verified:', event.type, event.id)
	} catch (err: any) {
		console.error('[Webhook] Signature verification failed:', err.message)
		return NextResponse.json(
			{ error: `Webhook signature verification failed: ${err.message}` },
			{ status: 400 }
		)
	}

	try {
		// Database bağlantısını önce yap
		await connectDB()
		console.log('[Webhook] Database connected')

		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session
				console.log('[Webhook] Processing checkout.session.completed for session:', session.id)
				
				if (session.payment_status !== 'paid') {
					console.log('[Webhook] Session not paid, skipping:', session.payment_status)
					break
				}

				const result = await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'paid', updatedAt: new Date() },
					{ new: true }
				)
				
				if (result) {
					console.log('[Webhook] Order updated to paid:', result._id)
				} else {
					console.error('[Webhook] Order not found for session:', session.id)
				}
				break
			}
			case 'checkout.session.expired': {
				const session = event.data.object as Stripe.Checkout.Session
				console.log('[Webhook] Processing checkout.session.expired for session:', session.id)
				
				const result = await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'cancelled', updatedAt: new Date() },
					{ new: true }
				)
				
				if (result) {
					console.log('[Webhook] Order updated to cancelled:', result._id)
				} else {
					console.error('[Webhook] Order not found for session:', session.id)
				}
				break
			}
			case 'checkout.session.async_payment_succeeded': {
				const session = event.data.object as Stripe.Checkout.Session
				console.log('[Webhook] Processing async_payment_succeeded for session:', session.id)
				
				const result = await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'paid', updatedAt: new Date() },
					{ new: true }
				)
				
				if (result) {
					console.log('[Webhook] Order updated to paid (async):', result._id)
				}
				break
			}
			case 'checkout.session.async_payment_failed': {
				const session = event.data.object as Stripe.Checkout.Session
				console.log('[Webhook] Processing async_payment_failed for session:', session.id)
				
				const result = await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'cancelled', updatedAt: new Date() },
					{ new: true }
				)
				
				if (result) {
					console.log('[Webhook] Order updated to cancelled (async):', result._id)
				}
				break
			}
			default:
				console.log('[Webhook] Unhandled event type:', event.type)
				break
		}

		const duration = Date.now() - startTime
		console.log('[Webhook] Processing completed in', duration, 'ms')
		
		return NextResponse.json({ received: true, event: event.type })
	} catch (err: any) {
		console.error('[Webhook] Error processing event:', err)
		console.error('[Webhook] Error stack:', err.stack)
		return NextResponse.json(
			{ 
				error: err.message ?? 'Internal server error',
				event: event.type,
				eventId: event.id,
			},
			{ status: 500 }
		)
	}
}

