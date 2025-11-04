'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import { X, MapPin, Calendar, Clock, Tag, CreditCard } from 'lucide-react'

interface OrderDetailModalProps {
	order: any
	isOpen: boolean
	onClose: () => void
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
	if (!isOpen || !order) return null

	const statusColors = {
		pending: 'bg-yellow-100 text-yellow-800',
		paid: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800',
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
			<div
				className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
					<h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
					<button
						onClick={onClose}
						className="rounded-lg p-2 transition-colors hover:bg-gray-100 active:scale-95"
					>
						<X className="h-5 w-5 text-gray-500" />
					</button>
				</div>

				{/* Content */}
				<div className="max-h-[70vh] overflow-y-auto p-6">
					{/* Car Info */}
					{order.car && (
						<div className="mb-6 flex gap-5 rounded-xl border-2 border-gray-200 bg-gray-50 p-5">
							{order.car.images?.[0] && (
								<div className="relative h-28 w-40 overflow-hidden rounded-lg">
									<Image
										src={order.car.images[0]}
										alt={order.car.modelName}
										fill
										className="object-cover"
									/>
								</div>
							)}
							<div className="flex-1">
								<h3 className="mb-2 text-xl font-bold text-gray-900">
									{order.car.brand} {order.car.modelName}
								</h3>
								<p className="text-sm font-medium text-gray-600">Price per day: ₺{order.car.pricePerDay}</p>
							</div>
						</div>
					)}

					{/* Order Details Grid */}
					<div className="grid gap-4 md:grid-cols-2">
						{/* Pickup Location */}
						<div className="rounded-xl border-2 border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
							<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<MapPin className="h-5 w-5 text-blue-600" />
								Pick-up Location
							</div>
							<p className="text-base font-medium text-gray-900">{order.pickupLocation}</p>
						</div>

						{/* Dropoff Location */}
						<div className="rounded-xl border-2 border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
							<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<MapPin className="h-5 w-5 text-blue-600" />
								Drop-off Location
							</div>
							<p className="text-base font-medium text-gray-900">{order.dropoffLocation}</p>
						</div>

						{/* Pickup Date & Time */}
						<div className="rounded-xl border-2 border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
							<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Calendar className="h-5 w-5 text-blue-600" />
								Pick-up Date
							</div>
							<p className="mb-4 text-base font-medium text-gray-900">{order.pickupDate}</p>
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Clock className="h-5 w-5 text-blue-600" />
								Time
							</div>
							<p className="text-base font-medium text-gray-900">{order.pickupTime}</p>
						</div>

						{/* Dropoff Date & Time */}
						<div className="rounded-xl border-2 border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
							<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Calendar className="h-5 w-5 text-blue-600" />
								Drop-off Date
							</div>
							<p className="mb-4 text-base font-medium text-gray-900">{order.dropoffDate}</p>
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Clock className="h-5 w-5 text-blue-600" />
								Time
							</div>
							<p className="text-base font-medium text-gray-900">{order.dropoffTime}</p>
						</div>
					</div>

					{/* Additional Info */}
					<div className="mt-4 rounded-xl border-2 border-gray-200 bg-white p-5">
						<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Tag className="h-5 w-5 text-blue-600" />
							Rental Period
						</div>
						<p className="text-base font-medium text-gray-900">{order.days} {order.days === 1 ? 'day' : 'days'}</p>
					</div>

					{/* Payment Summary */}
					<div className="mt-4 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-5">
						<div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<CreditCard className="h-5 w-5 text-blue-600" />
							Payment Summary
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Subtotal ({order.days} days)</span>
								<span className="text-gray-900">₺{order.total - 50}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Service fee</span>
								<span className="text-gray-900">₺50</span>
							</div>
							<div className="border-t border-gray-200 pt-2">
								<div className="flex justify-between font-semibold">
									<span>Total</span>
									<span>₺{order.total}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Status */}
					<div className="mt-4 flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-5">
						<span className="text-sm font-semibold text-gray-700">Status</span>
						<span
							className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
								statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
							}`}
						>
							{order.status}
						</span>
					</div>
				</div>

				{/* Footer */}
				<div className="border-t border-gray-200 px-6 py-5">
					<button
						onClick={onClose}
						className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	)
}

