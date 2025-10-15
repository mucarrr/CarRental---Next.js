import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Car from '@/models/car'

export async function GET(request: NextRequest) {
	try {
		await connectDB()

		const { searchParams } = new URL(request.url)

		// Build filter object
		const filter: any = {}

		// Car type filter
		const carType = searchParams.get('carType')
		if (carType) {
			filter.carType = carType
		}

		// Location filter
		const location = searchParams.get('location')
		if (location) {
			filter.location = { $regex: location, $options: 'i' }
		}

		// Price range filter
		const minPrice = searchParams.get('minPrice')
		const maxPrice = searchParams.get('maxPrice')
		if (minPrice || maxPrice) {
			filter.pricePerDay = {}
			if (minPrice) filter.pricePerDay.$gte = Number(minPrice)
			if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice)
		}

		// Transmission filter
		const transmission = searchParams.get('transmission')
		if (transmission) {
			filter.transmission = transmission
		}

		// Fuel type filter
		const fuelType = searchParams.get('fuelType')
		if (fuelType) {
			filter.fuelType = fuelType
		}

		// Number of seats filter
		const seats = searchParams.get('seats')
		if (seats) {
			filter.seats = Number(seats)
		}

		// Availability filter (default to available only)
		const showUnavailable = searchParams.get('showUnavailable')
		if (showUnavailable !== 'true') {
			filter.isAvailable = true
		}

		// Sorting
		const sortBy = searchParams.get('sortBy') || 'createdAt'
		const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1
		const sort: any = { [sortBy]: sortOrder }

		// Pagination
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '10')
		const skip = (page - 1) * limit

		// Execute query
		const [cars, totalCount] = await Promise.all([
			Car.find(filter)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.select('-__v')
				.lean(),
			Car.countDocuments(filter),
		])

		return NextResponse.json({
			success: true,
			data: cars,
			pagination: {
				page,
				limit,
				totalCount,
				totalPages: Math.ceil(totalCount / limit),
				hasNextPage: page < Math.ceil(totalCount / limit),
				hasPrevPage: page > 1,
			},
			filters: filter,
		})
	} catch (error: any) {
		console.error('Error fetching cars:', error)
		return NextResponse.json(
			{
				success: false,
				error: error.message || 'Failed to fetch cars',
			},
			{ status: 500 }
		)
	}
}

