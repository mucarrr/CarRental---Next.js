import { Check } from 'lucide-react'

interface CarFeaturesProps {
	features: string[]
}

export default function CarFeatures({ features }: CarFeaturesProps) {
	return (
		<div className="mb-6">
			<h2 className="mb-3 text-xl font-bold text-gray-900">Features</h2>
			<div className="grid gap-2 sm:grid-cols-2">
				{features.map((feature, idx) => (
					<div key={idx} className="flex items-center gap-2 text-gray-700">
						<Check className="h-4 w-4 text-green-600" />
						<span className="text-sm">{feature}</span>
					</div>
				))}
			</div>
		</div>
	)
}

