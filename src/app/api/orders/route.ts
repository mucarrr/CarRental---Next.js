import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getCurrentUser } from '@/lib/auth-utils'
import Order from '@/models/order'
import Car from '@/models/car'
import mongoose from 'mongoose'

export async function GET() {
	try {
		await connectDB()
		const user = await getCurrentUser()
		if (!user?.id) {
			return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
		}
		// Support both ObjectId and string userId (for old records)
		const userIdObjId = new mongoose.Types.ObjectId(user.id)
		console.log('Searching orders for userId:', user.id, 'as ObjectId:', userIdObjId.toString())
		
		// Debug: Check all orders first
		const allOrders = await Order.find({}).lean()
		console.log('All orders in DB:', allOrders.length)
		allOrders.forEach((o: any) => {
			console.log('Order userId type:', typeof o.userId, 'value:', o.userId?.toString(), 'matches?', 
				o.userId?.toString() === user.id || o.userId?.toString() === userIdObjId.toString())
		})
		
		const orders = await Order.find({
			$or: [
				{ userId: userIdObjId },
				{ userId: user.id }
			]
		})
			.sort({ createdAt: -1 })
			.lean()
		console.log('Found orders:', orders.length, 'for user:', user.id)
		const carIds = orders.map((o: any) => o.carId)
		const cars = await Car.find({ _id: { $in: carIds } })
			.select('brand modelName images pricePerDay')
			.lean()
		const carMap = new Map(cars.map((c: any) => [c._id.toString(), c]))
		const data = orders.map((o: any) => ({
			...o,
			_id: o._id.toString(),
			car: carMap.get(o.carId.toString()) ?? null,
		}))
		return NextResponse.json({ success: true, data })
	} catch (err: any) {
		return NextResponse.json({ success: false, error: err.message ?? 'Internal error' }, { status: 500 })
	}
}

export async function POST(req: Request) {
	try {
		await connectDB()
		const user = await getCurrentUser()
		if (!user?.id) {
			return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
		}
		const body = await req.json()
		const order = await Order.create({ ...body, userId: new mongoose.Types.ObjectId(user.id) })
		return NextResponse.json({ success: true, data: { id: (order as any)._id.toString() } })
	} catch (err: any) {
		return NextResponse.json({ success: false, error: err.message ?? 'Internal error' }, { status: 500 })
	}
}


