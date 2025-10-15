import { Users, Settings, Fuel, Gauge } from 'lucide-react'

interface CarSpecificationsProps {
	seats: number
	transmission: string
	fuelType: string
	mileage: number
}

export default function CarSpecifications({ seats, transmission, fuelType, mileage }: CarSpecificationsProps) {
	return (
		<div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
			<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
				<Users className="h-5 w-5 text-gray-600" />
				<div>
					<p className="text-xs text-gray-500">Seats</p>
					<p className="font-semibold text-gray-900">{seats}</p>
				</div>
			</div>
			<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
				<Settings className="h-5 w-5 text-gray-600" />
				<div>
					<p className="text-xs text-gray-500">Transmission</p>
					<p className="font-semibold capitalize text-gray-900">{transmission}</p>
				</div>
			</div>
			<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
				<Fuel className="h-5 w-5 text-gray-600" />
				<div>
					<p className="text-xs text-gray-500">Fuel Type</p>
					<p className="font-semibold capitalize text-gray-900">{fuelType}</p>
				</div>
			</div>
			<div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
				<Gauge className="h-5 w-5 text-gray-600" />
				<div>
					<p className="text-xs text-gray-500">Mileage</p>
					<p className="font-semibold text-gray-900">{mileage.toLocaleString()} km</p>
				</div>
			</div>
		</div>
	)
}

