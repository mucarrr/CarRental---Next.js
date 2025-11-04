import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/order'
import Stripe from 'stripe'
import { getCurrentUser } from '@/lib/auth-utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	typescript: true,
})

export async function POST(req: Request) {
	try {
		const user = await getCurrentUser()
		if (!user?.id) {
			return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
		}

		const { sessionId } = await req.json()
		if (!sessionId) {
			return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 })
		}

		await connectDB()

		// Stripe'dan session'ı kontrol et
		const session = await stripe.checkout.sessions.retrieve(sessionId)
		
		if (!session) {
			return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 })
		}

		// Order'ı bul
		const order = await Order.findOne({ stripeSessionId: sessionId })
		
		if (!order) {
			return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
		}

		// Kullanıcı kontrolü
		if (order.userId.toString() !== user.id) {
			return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
		}

		// Payment status'e göre order'ı güncelle
		if (session.payment_status === 'paid' && order.status !== 'paid') {
			await Order.findByIdAndUpdate(order._id, {
				status: 'paid',
				updatedAt: new Date(),
			})
			return NextResponse.json({ 
				success: true, 
				status: 'paid',
				message: 'Order updated to paid' 
			})
		}

		return NextResponse.json({ 
			success: true, 
			status: order.status,
			paymentStatus: session.payment_status,
		})
	} catch (err: any) {
		console.error('Verify payment error:', err)
		return NextResponse.json(
			{ success: false, error: err.message ?? 'Internal server error' },
			{ status: 500 }
		)
	}
}

