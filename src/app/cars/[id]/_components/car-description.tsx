interface CarDescriptionProps {
	description: string
}

export default function CarDescription({ description }: CarDescriptionProps) {
	return (
		<div className="mb-6">
			<h2 className="mb-3 text-xl font-bold text-gray-900">Description</h2>
			<p className="leading-relaxed text-gray-600">{description}</p>
		</div>
	)
}

