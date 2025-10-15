'use client'

import { useState } from 'react'

interface CarBookingCardProps {
	pricePerDay: number
	isAvailable: boolean
}

export default function CarBookingCard({ pricePerDay, isAvailable }: CarBookingCardProps) {
	const [pickupDate, setPickupDate] = useState('')
	const [dropoffDate, setDropoffDate] = useState('')

	const calculateDays = () => {
		if (!pickupDate || !dropoffDate) return 3
		const pickup = new Date(pickupDate)
		const dropoff = new Date(dropoffDate)
		const diffTime = Math.abs(dropoff.getTime() - pickup.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays || 1
	}

	const days = calculateDays()
	const subtotal = pricePerDay * days
	const serviceFee = 50
	const total = subtotal + serviceFee

	return (
		<div className="sticky top-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<div className="mb-6">
				<div className="mb-2 text-sm text-gray-600">Price per day</div>
				<div className="flex items-baseline gap-2">
					<span className="text-4xl font-bold text-blue-600">₺{pricePerDay}</span>
					<span className="text-gray-500">/day</span>
				</div>
			</div>

			<div className="mb-4 space-y-3">
				<div>
					<label className="label-field mb-2">Pick-up Date</label>
					<input
						type="date"
						className="input-field"
						value={pickupDate}
						onChange={(e) => setPickupDate(e.target.value)}
					/>
				</div>
				<div>
					<label className="label-field mb-2">Drop-off Date</label>
					<input
						type="date"
						className="input-field"
						value={dropoffDate}
						onChange={(e) => setDropoffDate(e.target.value)}
					/>
				</div>
			</div>

			<button
				disabled={!isAvailable}
				className="mb-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			>
				{isAvailable ? 'Book Now' : 'Not Available'}
			</button>

			<div className="space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-600">
				<div className="flex justify-between">
					<span>₺{pricePerDay} x {days} days</span>
					<span>₺{subtotal}</span>
				</div>
				<div className="flex justify-between">
					<span>Service fee</span>
					<span>₺{serviceFee}</span>
				</div>
				<div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
					<span>Total</span>
					<span>₺{total}</span>
				</div>
			</div>
		</div>
	)
}

