'use client'

import { useState, useEffect } from 'react'
import CarCard from '@/components/features/car-card'

interface CarsGridProps {
	filters: {
		carType: string
		location: string
		minPrice: string
		maxPrice: string
		transmission: string
		fuelType: string
		seats: string
	}
}

export default function CarsGrid({ filters }: CarsGridProps) {
	const [cars, setCars] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 12,
		totalCount: 0,
		totalPages: 0,
	})

	useEffect(() => {
		fetchCars()
	}, [filters, pagination.page])

	const fetchCars = async () => {
		setLoading(true)
		try {
			const params = new URLSearchParams()
			Object.entries(filters).forEach(([key, value]) => {
				if (value) params.append(key, value)
			})
			params.append('page', pagination.page.toString())
			params.append('limit', pagination.limit.toString())

			const res = await fetch(`/api/cars?${params.toString()}`)
			const result = await res.json()

			if (result.success) {
				setCars(result.data)
				setPagination((prev) => ({
					...prev,
					totalCount: result.pagination.totalCount,
					totalPages: result.pagination.totalPages,
				}))
			}
		} catch (error) {
			console.error('Error fetching cars:', error)
		} finally {
			setLoading(false)
		}
	}

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }))
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Loading skeleton
	if (loading) {
		return (
			<div className="flex-1">
				<div className="mb-6">
					<div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
				</div>
				<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="h-96 animate-pulse rounded-lg bg-gray-200"
						/>
					))}
				</div>
			</div>
		)
	}

	// Empty state
	if (cars.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
						<svg
							className="h-8 w-8 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-semibold text-gray-900">
						No cars found
					</h3>
					<p className="text-gray-600">
						Try adjusting your filters to see more results
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex-1">
			{/* Results Count */}
			<div className="mb-6">
				<p className="text-sm text-gray-600">
					Showing {cars.length} of {pagination.totalCount} cars
				</p>
			</div>

		{/* Cars Grid */}
		<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
			{cars.map((car) => (
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

			{/* Pagination */}
			{pagination.totalPages > 1 && (
				<div className="mt-8 flex items-center justify-center gap-2">
					<button
						onClick={() => handlePageChange(pagination.page - 1)}
						disabled={pagination.page === 1}
						className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</button>

					<div className="flex gap-1">
						{[...Array(pagination.totalPages)].map((_, i) => {
							const pageNum = i + 1
							const isCurrentPage = pageNum === pagination.page
							const showPage =
								pageNum === 1 ||
								pageNum === pagination.totalPages ||
								Math.abs(pageNum - pagination.page) <= 1

							if (!showPage) {
								if (
									pageNum === pagination.page - 2 ||
									pageNum === pagination.page + 2
								) {
									return (
										<span key={i} className="px-2 text-gray-400">
											...
										</span>
									)
								}
								return null
							}

							return (
								<button
									key={i}
									onClick={() => handlePageChange(pageNum)}
									className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
										isCurrentPage
											? 'bg-blue-600 text-white'
											: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
									}`}
								>
									{pageNum}
								</button>
							)
						})}
					</div>

					<button
						onClick={() => handlePageChange(pagination.page + 1)}
						disabled={pagination.page === pagination.totalPages}
						className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next
					</button>
				</div>
			)}
		</div>
	)
}

