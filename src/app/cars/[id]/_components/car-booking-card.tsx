'use client'

import { useState } from 'react'

interface CarBookingCardProps {
	pricePerDay: number
	isAvailable: boolean
}

export default function CarBookingCard({ pricePerDay, isAvailable }: CarBookingCardProps) {
	const [pickupDate, setPickupDate] = useState('')
	const [dropoffDate, setDropoffDate] = useState('')
	const [pickupLocation, setPickupLocation] = useState('')
	const [dropoffLocation, setDropoffLocation] = useState('')
	const [pickupTime, setPickupTime] = useState('')
	const [dropoffTime, setDropoffTime] = useState('')
	const [additionalNote, setAdditionalNote] = useState('')

	const locations = ['Athens', 'Thessaloniki', 'Heraklion', 'Patras', 'Rhodes', 'Santorini', 'Mykonos', 'Corfu', 'Chania']
	
	// Generate time slots from 09:00 to 20:00 with 30-minute intervals
	const times = Array.from({ length: 23 }, (_, i) => {
		const hour = Math.floor(i / 2) + 9
		const minute = i % 2 === 0 ? '00' : '30'
		return `${hour.toString().padStart(2, '0')}:${minute}`
	})

	const calculateDays = () => {
		if (!pickupDate || !dropoffDate) return 0
		const pickup = new Date(pickupDate)
		const dropoff = new Date(dropoffDate)
		const diffTime = Math.abs(dropoff.getTime() - pickup.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays || 1
	}

	const days = calculateDays()
	const subtotal = pricePerDay * days
	const serviceFee = days > 0 ? 50 : 0
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
				<label className="label-field mb-2">Pick-up Location</label>
				<select
					className="input-field"
					value={pickupLocation}
					onChange={(e) => setPickupLocation(e.target.value)}
				>
					<option value="">Select location</option>
					{locations.map((loc) => (
						<option key={loc} value={loc}>
							{loc}
						</option>
					))}
				</select>
			</div>
			<div className="grid grid-cols-2 gap-2">
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
					<label className="label-field mb-2">Time</label>
					<select
						className="input-field"
						value={pickupTime}
						onChange={(e) => setPickupTime(e.target.value)}
					>
						<option value="">Select time</option>
						{times.map((time) => (
							<option key={time} value={time}>
								{time}
							</option>
						))}
					</select>
				</div>
			</div>
			<div>
				<label className="label-field mb-2">Drop-off Location</label>
				<select
					className="input-field"
					value={dropoffLocation}
					onChange={(e) => setDropoffLocation(e.target.value)}
				>
					<option value="">Select location</option>
					{locations.map((loc) => (
						<option key={loc} value={loc}>
							{loc}
						</option>
					))}
				</select>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<div>
					<label className="label-field mb-2">Drop-off Date</label>
					<input
						type="date"
						className="input-field"
						value={dropoffDate}
						onChange={(e) => setDropoffDate(e.target.value)}
					/>
				</div>
				<div>
					<label className="label-field mb-2">Time</label>
					<select
						className="input-field"
						value={dropoffTime}
						onChange={(e) => setDropoffTime(e.target.value)}
					>
						<option value="">Select time</option>
						{times.map((time) => (
							<option key={time} value={time}>
								{time}
							</option>
						))}
					</select>
				</div>
			</div>
			<div>
				<label className="label-field mb-2">Additional Notes (Optional)</label>
				<textarea
					className="input-field resize-none"
					rows={3}
					maxLength={200}
					value={additionalNote}
					onChange={(e) => setAdditionalNote(e.target.value)}
					placeholder="Any special requests or requirements..."
				/>
				<p className="mt-1 text-xs text-gray-500">{additionalNote.length}/200</p>
			</div>
		</div>

		<button
			disabled={!isAvailable}
			className="mb-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
		>
			{isAvailable ? 'Book Now' : 'Not Available'}
		</button>

		{days > 0 ? (
			<div className="space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-600">
				<div className="flex justify-between">
					<span>₺{pricePerDay} x {days} {days === 1 ? 'day' : 'days'}</span>
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
		) : (
			<div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
				Select dates to see pricing
			</div>
		)}
		</div>
	)
}

