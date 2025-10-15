import { Star } from 'lucide-react'

interface CarDetailHeaderProps {
	brand: string
	modelName: string
	year: number
	carType: string
	averageRating: number
	totalReviews: number
}

export default function CarDetailHeader({
	brand,
	modelName,
	year,
	carType,
	averageRating,
	totalReviews,
}: CarDetailHeaderProps) {
	return (
		<div className="mb-6 flex items-start justify-between">
			<div>
				<div className="mb-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
					{carType.charAt(0).toUpperCase() + carType.slice(1)}
				</div>
				<h1 className="mt-2 text-3xl font-bold text-gray-900">
					{brand} {modelName}
				</h1>
				<p className="mt-1 text-gray-600">{year}</p>
			</div>
			<div className="flex items-center gap-2">
				<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
				<span className="text-lg font-bold text-gray-900">{averageRating.toFixed(1)}</span>
				<span className="text-sm text-gray-500">({totalReviews} reviews)</span>
			</div>
		</div>
	)
}

