import Link from 'next/link'
import { Search, MapPin, Calendar } from 'lucide-react'
import CarCard from '@/components/features/car-card'

async function getFeaturedCars() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/cars?limit=6&sortBy=averageRating&sortOrder=desc`, {
			cache: 'no-store',
		})
		
		if (!res.ok) return { data: [] }
		
		const result = await res.json()
		return result
	} catch (error) {
		console.error('Error fetching cars:', error)
		return { data: [] }
	}
}

export default async function HomePage() {
	const { data: featuredCars } = await getFeaturedCars()

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-white md:py-32">
				<div className="container mx-auto max-w-6xl">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
							Find Your Perfect Ride
						</h1>
						<p className="mb-8 text-lg text-blue-100 md:text-xl">
							Rent premium cars at the best prices. Easy booking, flexible options, and 24/7 support.
						</p>

						{/* Search Bar */}
						<div className="mx-auto max-w-4xl rounded-2xl bg-white p-4 shadow-2xl md:p-6">
							<div className="grid gap-4 md:grid-cols-3">
								<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
									<MapPin className="h-5 w-5 text-gray-400" />
									<input
										type="text"
										placeholder="Location"
										className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
									/>
								</div>
								<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
									<Calendar className="h-5 w-5 text-gray-400" />
									<input
										type="text"
										placeholder="Pick-up Date"
										className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
									/>
								</div>
								<Link
									href="/cars"
									className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
								>
									<Search className="h-4 w-4" />
									Search Cars
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
			</section>

			{/* Featured Cars */}
			<section className="px-4 py-16">
				<div className="container mx-auto max-w-7xl">
					<div className="mb-10 flex items-center justify-between">
						<div>
							<h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
							<p className="mt-2 text-gray-600">Our most popular and highly-rated vehicles</p>
						</div>
						<Link
							href="/cars"
							className="rounded-lg border border-blue-600 px-6 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
						>
							View All
						</Link>
					</div>

					{featuredCars.length > 0 ? (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{featuredCars.map((car: any) => (
								<CarCard
									key={car._id}
									id={car._id}
									brand={car.brand}
									modelName={car.modelName}
									year={car.year}
									transmission={car.transmission}
									fuelType={car.fuelType}
									seats={car.seats}
									pricePerDay={car.pricePerDay}
									images={car.images}
									averageRating={car.averageRating}
									totalReviews={car.totalReviews}
									carType={car.carType}
								/>
							))}
						</div>
					) : (
						<div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
							<p className="text-gray-600">No cars available at the moment.</p>
						</div>
					)}
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="bg-gray-50 px-4 py-16">
				<div className="container mx-auto max-w-7xl">
					<h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Why Choose Us</h2>
					<div className="grid gap-8 md:grid-cols-3">
						<div className="rounded-xl bg-white p-8 text-center shadow-sm">
							<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
								<Search className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="mb-3 text-xl font-bold text-gray-900">Easy Booking</h3>
							<p className="text-gray-600">
								Quick and simple booking process with instant confirmation
							</p>
						</div>
						<div className="rounded-xl bg-white p-8 text-center shadow-sm">
							<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
								<MapPin className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="mb-3 text-xl font-bold text-gray-900">Multiple Locations</h3>
							<p className="text-gray-600">
								Pick up and drop off at convenient locations across Turkey
							</p>
						</div>
						<div className="rounded-xl bg-white p-8 text-center shadow-sm">
							<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
								<Calendar className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="mb-3 text-xl font-bold text-gray-900">Flexible Plans</h3>
							<p className="text-gray-600">
								Daily, weekly, and monthly rental options to fit your needs
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}