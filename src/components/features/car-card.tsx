import Image from 'next/image'
import Link from 'next/link'
import { Star, Users, Fuel, Settings } from 'lucide-react'

interface CarCardProps {
	id: string
	brand: string
	modelName: string
	year: number
	transmission: string
	fuelType: string
	seats: number
	pricePerDay: number
	images: string[]
	averageRating: number
	totalReviews: number
	carType: string
}

export default function CarCard({
	id,
	brand,
	modelName,
	year,
	transmission,
	fuelType,
	seats,
	pricePerDay,
	images,
	averageRating,
	totalReviews,
	carType,
}: CarCardProps) {
	return (
		<Link
			href={`/cars/${id}`}
			className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl"
		>
			{/* Image */}
			<div className="relative h-48 w-full overflow-hidden bg-gray-100">
				<Image
					src={images[0]}
					alt={`${brand} ${modelName}`}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-110"
				/>
				<div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow">
					{carType.charAt(0).toUpperCase() + carType.slice(1)}
				</div>
			</div>

			{/* Content */}
			<div className="p-4">
				{/* Title */}
				<h3 className="mb-1 text-lg font-bold text-gray-900">
					{brand} {modelName}
				</h3>
				<p className="mb-3 text-sm text-gray-500">{year}</p>

				{/* Rating */}
				<div className="mb-4 flex items-center gap-2">
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm font-medium text-gray-900">{averageRating.toFixed(1)}</span>
					</div>
					<span className="text-xs text-gray-500">({totalReviews} reviews)</span>
				</div>

				{/* Features */}
				<div className="mb-4 grid grid-cols-3 gap-2">
					<div className="flex items-center gap-1.5 text-gray-600">
						<Users className="h-4 w-4" />
						<span className="text-xs">{seats} seats</span>
					</div>
					<div className="flex items-center gap-1.5 text-gray-600">
						<Settings className="h-4 w-4" />
						<span className="text-xs capitalize">{transmission}</span>
					</div>
					<div className="flex items-center gap-1.5 text-gray-600">
						<Fuel className="h-4 w-4" />
						<span className="text-xs capitalize">{fuelType}</span>
					</div>
				</div>

				{/* Price */}
				<div className="flex items-center justify-between border-t border-gray-100 pt-3">
					<div>
						<span className="text-2xl font-bold text-blue-600">₺{pricePerDay}</span>
						<span className="text-sm text-gray-500">/day</span>
					</div>
					<button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
						Rent Now
					</button>
				</div>
			</div>
		</Link>
	)
}

