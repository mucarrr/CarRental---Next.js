'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Car, ShoppingBag } from 'lucide-react'
import OrderDetailModal from './order-detail-modal'

interface OrdersClientProps {
	orders: any[]
}

export default function OrdersClient({ orders }: OrdersClientProps) {
	const [selectedOrder, setSelectedOrder] = useState<any>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleOrderClick = (order: any) => {
		setSelectedOrder(order)
		setIsModalOpen(true)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'paid':
				return 'bg-green-100 text-green-800'
			case 'pending':
				return 'bg-yellow-100 text-yellow-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
				<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
					<ShoppingBag className="h-10 w-10 text-gray-400" />
				</div>
				<h3 className="mb-2 text-xl font-semibold text-gray-900">No orders yet</h3>
				<p className="mb-6 text-gray-600">Start exploring our fleet and book your first rental.</p>
				<Link
					href="/cars"
					className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]"
				>
					<Car className="h-5 w-5" />
					<span className="whitespace-nowrap">Browse Cars</span>
				</Link>
			</div>
		)
	}

	return (
		<>
			<ul className="space-y-3">
				{orders.map((o: any) => (
					<li
						key={o._id}
						onClick={() => handleOrderClick(o)}
						className="group flex cursor-pointer items-center gap-5 rounded-xl border-2 border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg active:scale-[0.99]"
					>
						{Boolean(o.car?.images?.[0]) && (
							<div className="relative h-20 w-28 overflow-hidden rounded-lg">
								<Image
									src={o.car.images[0]}
									alt={o.car.modelName}
									fill
									className="object-cover transition-transform group-hover:scale-105"
								/>
							</div>
						)}
						<div className="flex-1">
							<h3 className="mb-1 text-lg font-semibold text-gray-900">
								{o.car?.brand} {o.car?.modelName}
							</h3>
							<p className="text-sm text-gray-600">
								{o.pickupDate} {o.pickupTime} → {o.dropoffDate} {o.dropoffTime}
							</p>
						</div>
						<div className="text-right">
							<p className="mb-2 text-xl font-bold text-gray-900">₺{o.total}</p>
							<span
								className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusColor(o.status)}`}
							>
								{o.status}
							</span>
						</div>
					</li>
				))}
			</ul>
			<OrderDetailModal
				order={selectedOrder}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	)
}

