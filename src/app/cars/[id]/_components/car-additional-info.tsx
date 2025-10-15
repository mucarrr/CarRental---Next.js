import { MapPin, Calendar } from 'lucide-react'

interface CarAdditionalInfoProps {
	location: string
	licensePlate: string
	color: string
	isAvailable: boolean
}

export default function CarAdditionalInfo({ location, licensePlate, color, isAvailable }: CarAdditionalInfoProps) {
	return (
		<div className="grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
			<div className="flex items-center gap-3">
				<MapPin className="h-5 w-5 text-gray-400" />
				<div>
					<p className="text-xs text-gray-500">Location</p>
					<p className="font-medium text-gray-900">{location}</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Calendar className="h-5 w-5 text-gray-400" />
				<div>
					<p className="text-xs text-gray-500">License Plate</p>
					<p className="font-medium text-gray-900">{licensePlate}</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<div className="h-5 w-5 rounded-full" style={{ backgroundColor: color.toLowerCase() }}></div>
				<div>
					<p className="text-xs text-gray-500">Color</p>
					<p className="font-medium text-gray-900">{color}</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<div className={`h-3 w-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
				<div>
					<p className="text-xs text-gray-500">Availability</p>
					<p className="font-medium text-gray-900">{isAvailable ? 'Available' : 'Not Available'}</p>
				</div>
			</div>
		</div>
	)
}

