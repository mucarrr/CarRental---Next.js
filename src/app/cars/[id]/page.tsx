import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import CarImageGallery from '@/components/features/car-image-gallery'
import CarDetailHeader from './_components/car-detail-header'
import CarSpecifications from './_components/car-specifications'
import CarDescription from './_components/car-description'
import CarFeatures from './_components/car-features'
import CarAdditionalInfo from './_components/car-additional-info'
import CarBookingCard from './_components/car-booking-card'
import CarReviews from './_components/car-reviews'
import PaymentSuccessModal from './_components/payment-success-modal'
import PaymentCancelModal from './_components/payment-cancel-modal'

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params
	const car = await getCar(id)

	if (!car) {
		return {
			title: 'Car Not Found',
		}
	}

	const title = `${car.brand} ${car.modelName} ${car.year} - Rent Now | DRIVIO`
	const description = `Rent ${car.brand} ${car.modelName} ${car.year} from DRIVIO. ${car.transmission} transmission, ${car.seats} seats, ${car.fuelType} fuel. Price: ₺${car.pricePerDay}/day. Book now!`
	const images = car.images?.[0] || '/og-image.jpg'

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			images: [
				{
					url: images,
					width: 1200,
					height: 630,
					alt: `${car.brand} ${car.modelName}`,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [images],
		},
	}
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const car = await getCar(id)

	if (!car) {
		notFound()
	}

	// Structured Data (JSON-LD)
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: `${car.brand} ${car.modelName}`,
		description: car.description || `${car.brand} ${car.modelName} ${car.year} - ${car.transmission} transmission, ${car.seats} seats`,
		brand: {
			'@type': 'Brand',
			name: car.brand,
		},
		model: car.modelName,
		productionDate: car.year.toString(),
		image: car.images || [],
		offers: {
			'@type': 'Offer',
			price: car.pricePerDay,
			priceCurrency: 'TRY',
			availability: car.isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
			url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/cars/${id}`,
		},
		aggregateRating: car.averageRating
			? {
					'@type': 'AggregateRating',
					ratingValue: car.averageRating,
					reviewCount: car.totalReviews,
				}
			: undefined,
		additionalProperty: [
			{
				'@type': 'PropertyValue',
				name: 'Transmission',
				value: car.transmission,
			},
			{
				'@type': 'PropertyValue',
				name: 'Fuel Type',
				value: car.fuelType,
			},
			{
				'@type': 'PropertyValue',
				name: 'Seats',
				value: car.seats.toString(),
			},
			{
				'@type': 'PropertyValue',
				name: 'Car Type',
				value: car.carType,
			},
		],
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<article className="min-h-screen bg-gray-50">
				<PaymentSuccessModal />
				<PaymentCancelModal carId={car._id.toString()} />
				{/* Back Button */}
				<nav className="border-b border-gray-200 bg-white px-4 py-4" aria-label="Breadcrumb">
				<div className="container mx-auto max-w-7xl">
					<Link
						href="/cars"
						className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
					>
						← Back to all cars
					</Link>
				</div>
			</nav>

			<div className="container mx-auto max-w-7xl px-4 py-8">
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<section className="lg:col-span-2">
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
					</section>

					{/* Booking Card */}
					<aside className="lg:col-span-1">
						<CarBookingCard pricePerDay={car.pricePerDay} isAvailable={car.isAvailable} carId={car._id.toString()} />
					</aside>
				</div>
			</div>
			</article>
		</>
	)
}
