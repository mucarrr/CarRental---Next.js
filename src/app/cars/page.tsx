'use client'

import { useState } from 'react'
import CarsFilters from './_components/cars-filters'
import CarsGrid from './_components/cars-grid'

export default function CarsPage() {
	const [showMobileFilters, setShowMobileFilters] = useState(false)
	const [filters, setFilters] = useState({
		carType: '',
		location: '',
		minPrice: '',
		maxPrice: '',
		transmission: '',
		fuelType: '',
		seats: '',
	})

	const handleFilterChange = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
	}

	const clearFilters = () => {
		setFilters({
			carType: '',
			location: '',
			minPrice: '',
			maxPrice: '',
			transmission: '',
			fuelType: '',
			seats: '',
		})
	}

	const activeFiltersCount = Object.values(filters).filter((v) => v).length

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b border-gray-200 bg-white px-4 py-6">
				<div className="container mx-auto max-w-7xl">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent">
								Available Cars
							</h1>
							<p className="mt-1 text-gray-600">
								Find your perfect rental car
							</p>
						</div>
						<div className="lg:hidden">
							<CarsFilters
								filters={filters}
								onFilterChange={handleFilterChange}
								onClearFilters={clearFilters}
								showMobileFilters={showMobileFilters}
								onToggleMobileFilters={() =>
									setShowMobileFilters(!showMobileFilters)
								}
								activeFiltersCount={activeFiltersCount}
							/>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto max-w-7xl px-4 py-8">
				<div className="flex gap-8">
					{/* Filters Sidebar - Desktop */}
					<aside className="hidden lg:block">
						<CarsFilters
							filters={filters}
							onFilterChange={handleFilterChange}
							onClearFilters={clearFilters}
							showMobileFilters={showMobileFilters}
							onToggleMobileFilters={() =>
								setShowMobileFilters(!showMobileFilters)
							}
							activeFiltersCount={activeFiltersCount}
						/>
					</aside>

					{/* Cars Grid */}
					<article className="flex-1">
						<CarsGrid filters={filters} />
					</article>
				</div>
			</main>
		</div>
	)
}
