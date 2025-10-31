import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-utils'
import connectDB from '@/lib/mongodb'
import Order from '@/models/order'
import Car from '@/models/car'
import mongoose from 'mongoose'

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
		]
	})
		.sort({ createdAt: -1 })
		.lean()

	const carIds = orders.map((o: any) => o.carId)
	const cars = await Car.find({ _id: { $in: carIds } })
		.select('brand modelName images pricePerDay')
		.lean()
	const carMap = new Map(cars.map((c: any) => [c._id.toString(), c]))
	const ordersWithCars = orders.map((o: any) => ({
		...o,
		_id: o._id.toString(),
		car: carMap.get(o.carId.toString()) ?? null,
	}))

	return (
		<div className="container mx-auto max-w-5xl px-4 py-8">
			<h1 className="mb-6 text-2xl font-bold">My Orders</h1>
			{ordersWithCars.length === 0 ? (
				<div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
					No orders yet. <Link href="/cars" className="text-blue-600 underline">Browse cars</Link>
				</div>
			) : (
				<ul className="space-y-4">
					{ordersWithCars.map((o: any) => (
						<li key={o._id} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
							{Boolean(o.car?.images?.[0]) && (
								<Image src={o.car.images[0]} alt={o.car.modelName} width={96} height={72} className="h-18 w-24 rounded object-cover" />
							)}
							<div className="flex-1">
								<p className="font-medium">{o.car?.brand} {o.car?.modelName}</p>
								<p className="text-sm text-gray-600">{o.pickupDate} {o.pickupTime} → {o.dropoffDate} {o.dropoffTime}</p>
							</div>
							<div className="text-right">
								<p className="font-semibold">₺{o.total}</p>
								<p className="text-xs uppercase tracking-wide text-gray-500">{o.status}</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}


