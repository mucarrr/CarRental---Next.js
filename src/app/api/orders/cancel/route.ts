import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/order'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	typescript: true,
})

export async function POST(req: Request) {
	try {
		const { sessionId } = await req.json()
		
		if (!sessionId) {
			return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 })
		}

		await connectDB()
		
		// Check if session exists and is not paid
		const session = await stripe.checkout.sessions.retrieve(sessionId)
		
		if (session.payment_status !== 'paid') {
			// Update order to cancelled
			await Order.findOneAndUpdate(
				{ stripeSessionId: sessionId },
				{ status: 'cancelled' }
			)
			return NextResponse.json({ success: true, status: 'cancelled' })
		}
		
		return NextResponse.json({ success: true, status: session.payment_status })
	} catch (err: any) {
		return NextResponse.json({ success: false, error: err.message ?? 'Internal error' }, { status: 500 })
	}
}

