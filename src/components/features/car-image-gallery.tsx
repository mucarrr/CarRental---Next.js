'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface CarImageGalleryProps {
	images: string[]
	brand: string
	modelName: string
}

export default function CarImageGallery({ images, brand, modelName }: CarImageGalleryProps) {
	const [selectedImage, setSelectedImage] = useState(0)
	const [isLightboxOpen, setIsLightboxOpen] = useState(false)

	const handlePrevious = () => {
		setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
	}

	const handleNext = () => {
		setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
	}

	return (
		<>
			<div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
				{/* Main Image */}
				<div
					className="relative h-96 w-full cursor-pointer"
					onClick={() => setIsLightboxOpen(true)}
				>
					<Image
						src={images[selectedImage]}
						alt={`${brand} ${modelName}`}
						fill
						className="object-cover transition-transform duration-300 hover:scale-105"
						priority
					/>
					<div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
						{selectedImage + 1} / {images.length}
					</div>
				</div>

				{/* Thumbnails */}
				{images.length > 1 && (
					<div className="grid grid-cols-4 gap-2 p-4">
						{images.map((img, idx) => (
							<button
								key={idx}
								onClick={() => setSelectedImage(idx)}
								className={`relative h-24 overflow-hidden rounded-lg transition-all ${
									selectedImage === idx
										? 'ring-2 ring-blue-600 ring-offset-2'
										: 'opacity-70 hover:opacity-100'
								}`}
							>
								<Image src={img} alt={`${brand} ${modelName} ${idx + 1}`} fill className="object-cover" />
							</button>
						))}
					</div>
				)}
			</div>

			{/* Lightbox */}
			{isLightboxOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
					{/* Close Button */}
					<button
						onClick={() => setIsLightboxOpen(false)}
						className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
					>
						<X className="h-6 w-6" />
					</button>

					{/* Navigation */}
					{images.length > 1 && (
						<>
							<button
								onClick={handlePrevious}
								className="absolute left-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
							>
								<ChevronLeft className="h-6 w-6" />
							</button>
							<button
								onClick={handleNext}
								className="absolute right-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
							>
								<ChevronRight className="h-6 w-6" />
							</button>
						</>
					)}

					{/* Image */}
					<div className="relative h-[80vh] w-[90vw]">
						<Image
							src={images[selectedImage]}
							alt={`${brand} ${modelName}`}
							fill
							className="object-contain"
							quality={100}
						/>
					</div>

					{/* Counter */}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
						{selectedImage + 1} / {images.length}
					</div>
				</div>
			)}
		</>
	)
}

