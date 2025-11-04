import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDB from '@/lib/mongodb'
import Order from '@/models/order'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	typescript: true,
})

export async function POST(req: Request) {
	console.log('Webhook endpoint called')
	const signature = req.headers.get('stripe-signature')
	if (!signature) {
		console.log('No signature header')
		return NextResponse.json({ received: false }, { status: 400 })
	}

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
	if (!webhookSecret) {
		console.log('STRIPE_WEBHOOK_SECRET not configured')
		return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
	}

	const payload = await req.text()

	let event: Stripe.Event
	try {
		event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
	} catch (err: any) {
		return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
	}

	try {
		console.log('Webhook received event type:', event.type)
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session
				console.log('Processing checkout.session.completed for session:', session.id)
				await connectDB()
				const result = await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'paid' }
				)
				console.log('Order updated:', result ? 'success' : 'not found')
				break
			}
			case 'checkout.session.expired': {
				const session = event.data.object as Stripe.Checkout.Session
				await connectDB()
				await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'cancelled' }
				)
				break
			}
			case 'checkout.session.async_payment_succeeded': {
				const session = event.data.object as Stripe.Checkout.Session
				await connectDB()
				await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'paid' }
				)
				break
			}
			case 'checkout.session.async_payment_failed': {
				const session = event.data.object as Stripe.Checkout.Session
				await connectDB()
				await Order.findOneAndUpdate(
					{ stripeSessionId: session.id },
					{ status: 'cancelled' }
				)
				break
			}
			default:
				break
		}
		return NextResponse.json({ received: true })
	} catch (err: any) {
		console.error('Webhook error:', err)
		return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
	}
}

