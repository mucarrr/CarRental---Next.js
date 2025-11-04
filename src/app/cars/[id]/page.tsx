import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import CarImageGallery from '@/components/features/car-image-gallery'
import CarDetailHeader from './_components/car-detail-header'
import CarSpecifications from './_components/car-specifications'
import CarDescription from './_components/car-description'
import CarFeatures from './_components/car-features'
import CarAdditionalInfo from './_components/car-additional-info'
import CarBookingCard from './_components/car-booking-card'
import CarReviews from './_components/car-reviews'
import PaymentSuccessModal from './_components/payment-success-modal'

async function getCar(id: string) {
	try {
		const hdrs = await headers()
		const proto = hdrs.get('x-forwarded-proto') || 'http'
		const host = hdrs.get('host')
		const base = `${proto}://${host}`
		const res = await fetch(`${base}/api/cars/${id}`, {
			cache: 'no-store',
		})

		if (!res.ok) return null

		const result = await res.json()
		return result.success ? result.data : null
	} catch (error) {
		console.error('Error fetching car:', error)
		return null
	}
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
	const car = await getCar(id)

	if (!car) {
		notFound()
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<PaymentSuccessModal />
			{/* Back Button */}
			<div className="border-b border-gray-200 bg-white px-4 py-4">
				<div className="container mx-auto max-w-7xl">
					<Link
						href="/cars"
						className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
					>
						← Back to all cars
					</Link>
				</div>
			</div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="lg:col-span-2">
						{/* Images */}
						<CarImageGallery images={car.images} brand={car.brand} modelName={car.modelName} />

					{/* Details */}
					<div className="rounded-xl bg-white p-6 shadow-sm">
						<CarDetailHeader
							brand={car.brand}
							modelName={car.modelName}
							year={car.year}
							carType={car.carType}
							averageRating={car.averageRating}
							totalReviews={car.totalReviews}
						/>

						<CarSpecifications
							seats={car.seats}
							transmission={car.transmission}
							fuelType={car.fuelType}
							mileage={car.mileage}
						/>

						<CarDescription description={car.description} />

						<CarFeatures features={car.features} />

						<CarAdditionalInfo
							location={car.location}
							licensePlate={car.licensePlate}
							color={car.color}
							isAvailable={car.isAvailable}
						/>
					</div>

					{/* Reviews */}
					<CarReviews
						carId={car._id.toString()}
						averageRating={car.averageRating}
						totalReviews={car.totalReviews}
					/>
				</div>

					{/* Booking Card */}
					<div className="lg:col-span-1">
						<CarBookingCard pricePerDay={car.pricePerDay} isAvailable={car.isAvailable} carId={car._id.toString()} />
					</div>
				</div>
			</div>
		</div>
	)
}
