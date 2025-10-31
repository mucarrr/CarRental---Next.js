'use client'

import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'

interface CarBookingCardProps {
	pricePerDay: number
	isAvailable: boolean
	carId: string
}

export default function CarBookingCard({ pricePerDay, isAvailable, carId }: CarBookingCardProps) {
	const [pickupDate, setPickupDate] = useState('')
	const [dropoffDate, setDropoffDate] = useState('')
	const [pickupLocation, setPickupLocation] = useState('')
	const [dropoffLocation, setDropoffLocation] = useState('')
	const [pickupTime, setPickupTime] = useState('')
	const [dropoffTime, setDropoffTime] = useState('')
	const [additionalNote, setAdditionalNote] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const locations = ['Athens', 'Thessaloniki', 'Heraklion', 'Patras', 'Rhodes', 'Santorini', 'Mykonos', 'Corfu', 'Chania']
	
	const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
   e.preventDefault()
   if (!isAvailable) {
    toast.error('Car is not available')
    return
   }
   if (!pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime || days === undefined || total === undefined) {
    toast.error('All fields are required')
    return
   }
   if (days < 1) {
    toast.error('Days must be at least 1')
    return
   }
   setIsLoading(true)
    const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            carId,
            pickupLocation,
            dropoffLocation,
            pickupDate,
            dropoffDate,
            pickupTime,
            dropoffTime,
            additionalNote,
            days,
            total,
        }),
    })
    const result = await res.json()
    if (result.success && result.session) {
		// Stripe Checkout URL'ine yönlendir
		window.location.href = result.session as string
		return
    } else if (result.success) {
        toast.success('Checkout successful')
        console.log('Checkout successful for user:', result.user)
        console.log('Checkout result:', result)
    } else {
        toast.error(result.error || 'Failed to checkout')
        console.error('Checkout error:', result.error)
    }
    setIsLoading(false)
   }

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

		<form onSubmit={handleSubmit} className="mb-4 space-y-3">
			<div>
				<label className="label-field mb-2">Pick-up Location</label>
				<select
					className="input-field"
					value={pickupLocation}
					onChange={(e) => setPickupLocation(e.target.value)}
					required
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
						required
					/>
				</div>
				<div>
					<label className="label-field mb-2">Time</label>
					<select
						className="input-field"
						value={pickupTime}
						onChange={(e) => setPickupTime(e.target.value)}
						required
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
					required
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
						required
					/>
				</div>
				<div>
					<label className="label-field mb-2">Time</label>
					<select
						className="input-field"
						value={dropoffTime}
						onChange={(e) => setDropoffTime(e.target.value)}
						required
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
			<button
			type="submit"
			disabled={!isAvailable || isLoading}
			className="mb-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
		>
			{isLoading ? 'Loading...' : isAvailable ? 'Book Now' : 'Not Available'}
		</button>
		</form>

		

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

