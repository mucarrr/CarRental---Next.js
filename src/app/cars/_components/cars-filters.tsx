'use client'

import { SlidersHorizontal, X } from 'lucide-react'

interface FiltersProps {
	filters: {
		carType: string
		location: string
		minPrice: string
		maxPrice: string
		transmission: string
		fuelType: string
		seats: string
	}
	onFilterChange: (key: string, value: string) => void
	onClearFilters: () => void
	showMobileFilters: boolean
	onToggleMobileFilters: () => void
	activeFiltersCount: number
}

export default function CarsFilters({
	filters,
	onFilterChange,
	onClearFilters,
	showMobileFilters,
	onToggleMobileFilters,
	activeFiltersCount,
}: FiltersProps) {
	const FilterContent = () => (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-900">Filters</h2>
				{activeFiltersCount > 0 && (
					<button
						onClick={onClearFilters}
						className="text-sm text-blue-600 hover:text-blue-700"
					>
						Clear all
					</button>
				)}
			</div>

			{/* Car Type */}
			<div>
				<label className="label-field">Car Type</label>
				<select
					value={filters.carType}
					onChange={(e) => onFilterChange('carType', e.target.value)}
					className="input-field"
				>
					<option value="">All Types</option>
					<option value="sedan">Sedan</option>
					<option value="suv">SUV</option>
					<option value="hatchback">Hatchback</option>
					<option value="luxury">Luxury</option>
					<option value="sports">Sports</option>
					<option value="van">Van</option>
				</select>
			</div>

			{/* Location */}
			<div>
				<label className="label-field">Location</label>
				<select
					value={filters.location}
					onChange={(e) => onFilterChange('location', e.target.value)}
					className="input-field"
				>
					<option value="">All Locations</option>
					<option value="Athens">Athens</option>
					<option value="Thessaloniki">Thessaloniki</option>
					<option value="Heraklion">Heraklion</option>
					<option value="Patras">Patras</option>
					<option value="Rhodes">Rhodes</option>
					<option value="Santorini">Santorini</option>
					<option value="Mykonos">Mykonos</option>
					<option value="Corfu">Corfu</option>
					<option value="Chania">Chania</option>
				</select>
			</div>

			{/* Price Range */}
			<div>
				<label className="label-field">Price Range (per day)</label>
				<div className="grid grid-cols-2 gap-2">
					<input
						type="number"
						placeholder="Min"
						value={filters.minPrice}
						onChange={(e) => onFilterChange('minPrice', e.target.value)}
						className="input-field"
					/>
					<input
						type="number"
						placeholder="Max"
						value={filters.maxPrice}
						onChange={(e) => onFilterChange('maxPrice', e.target.value)}
						className="input-field"
					/>
				</div>
			</div>

			{/* Transmission */}
			<div>
				<label className="label-field">Transmission</label>
				<select
					value={filters.transmission}
					onChange={(e) => onFilterChange('transmission', e.target.value)}
					className="input-field"
				>
					<option value="">All</option>
					<option value="automatic">Automatic</option>
					<option value="manual">Manual</option>
				</select>
			</div>

			{/* Fuel Type */}
			<div>
				<label className="label-field">Fuel Type</label>
				<select
					value={filters.fuelType}
					onChange={(e) => onFilterChange('fuelType', e.target.value)}
					className="input-field"
				>
					<option value="">All</option>
					<option value="petrol">Petrol</option>
					<option value="diesel">Diesel</option>
					<option value="electric">Electric</option>
					<option value="hybrid">Hybrid</option>
				</select>
			</div>

			{/* Seats */}
			<div>
				<label className="label-field">Seats</label>
				<select
					value={filters.seats}
					onChange={(e) => onFilterChange('seats', e.target.value)}
					className="input-field"
				>
					<option value="">All</option>
					<option value="4">4 Seats</option>
					<option value="5">5 Seats</option>
					<option value="7">7+ Seats</option>
				</select>
			</div>
		</div>
	)

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden lg:block lg:w-64">
				<div className="sticky top-20 rounded-lg bg-white p-6 shadow-sm">
					<FilterContent />
				</div>
			</aside>

			{/* Mobile Filter Button */}
			<button
				onClick={onToggleMobileFilters}
				className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
			>
				<SlidersHorizontal className="h-4 w-4" />
				Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
			</button>

			{/* Mobile Filter Modal */}
			{showMobileFilters && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div
						className="absolute inset-0 bg-black bg-opacity-50"
						onClick={onToggleMobileFilters}
					/>
					<div className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-white p-6 shadow-xl">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Filters</h2>
							<button
								onClick={onToggleMobileFilters}
								className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="overflow-y-auto">
							<FilterContent />
						</div>
					</div>
				</div>
			)}
		</>
	)
}

