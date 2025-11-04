import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth-utils'
import connectDB from '@/lib/mongodb'
import Order from '@/models/order'
import Car from '@/models/car'
import mongoose from 'mongoose'
import OrdersClient from './_components/orders-client'

export const metadata: Metadata = {
	title: 'My Orders',
	description: 'View and manage your car rental orders. Track your bookings, payment status, and rental history.',
	robots: {
		index: false,
		follow: false,
	},
}

export default async function OrdersPage() {
	const user = await getCurrentUser()
	if (!user?.id) {
		redirect('/login')
	}

	await connectDB()
	const userIdObjId = new mongoose.Types.ObjectId(user.id)
	const orders = await Order.find({
		$or: [
			{ userId: userIdObjId },
			{ userId: user.id }
		],
		status: { $ne: 'cancelled' }
	})
		.sort({ createdAt: -1 })
		.lean()

	const carIds = orders.map((o: any) => o.carId)
	const cars = await Car.find({ _id: { $in: carIds } })
		.select('brand modelName images pricePerDay')
		.lean()
	const carMap = new Map(cars.map((c: any) => [c._id.toString(), {
		brand: c.brand,
		modelName: c.modelName,
		images: c.images,
		pricePerDay: c.pricePerDay,
	}]))
	const ordersWithCars = orders.map((o: any) => ({
		_id: o._id.toString(),
		userId: o.userId?.toString() ?? '',
		carId: o.carId?.toString() ?? '',
		pickupLocation: o.pickupLocation,
		dropoffLocation: o.dropoffLocation,
		pickupDate: o.pickupDate,
		dropoffDate: o.dropoffDate,
		pickupTime: o.pickupTime,
		dropoffTime: o.dropoffTime,
		days: o.days,
		total: o.total,
		status: o.status,
		stripeSessionId: o.stripeSessionId,
		createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : '',
		updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : '',
		car: carMap.get(o.carId?.toString() ?? '') ?? null,
	}))

	return (
		<main className="min-h-screen bg-gray-50">
			<div className="container mx-auto max-w-5xl px-4 py-8">
				<h1 className="mb-8 text-3xl font-bold text-gray-900">My Orders</h1>
				<OrdersClient orders={ordersWithCars} />
			</div>
		</main>
	)
}


