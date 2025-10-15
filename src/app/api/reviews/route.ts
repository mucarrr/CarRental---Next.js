import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/review'
import Car from '@/models/car'
import { auth } from '@/auth'
import mongoose from 'mongoose'

// GET reviews for a specific car
export async function GET(request: NextRequest) {
	try {
		await connectDB()

		const searchParams = request.nextUrl.searchParams
		const carId = searchParams.get('carId')

		if (!carId) {
			return NextResponse.json(
				{ success: false, error: 'Car ID is required' },
				{ status: 400 }
			)
		}

		if (!mongoose.Types.ObjectId.isValid(carId)) {
			return NextResponse.json(
				{ success: false, error: 'Invalid car ID' },
				{ status: 400 }
			)
		}

		const reviews = await Review.find({ carId: new mongoose.Types.ObjectId(carId) })
			.sort({ createdAt: -1 })
			.lean()

		return NextResponse.json({
			success: true,
			data: reviews,
			count: reviews.length,
		})
	} catch (error: any) {
		console.error('Error fetching reviews:', error)
		return NextResponse.json(
			{ success: false, error: error.message || 'Failed to fetch reviews' },
			{ status: 500 }
		)
	}
}

// POST create a new review
export async function POST(request: NextRequest) {
	try {
		await connectDB()

		const session = await auth()
		if (!session?.user) {
			return NextResponse.json(
				{ success: false, error: 'Authentication required' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { carId, rating, comment } = body

		// Validation
		if (!carId || !rating || !comment) {
			return NextResponse.json(
				{ success: false, error: 'Car ID, rating, and comment are required' },
				{ status: 400 }
			)
		}

		if (!mongoose.Types.ObjectId.isValid(carId)) {
			return NextResponse.json(
				{ success: false, error: 'Invalid car ID' },
				{ status: 400 }
			)
		}

		if (rating < 1 || rating > 5) {
			return NextResponse.json(
				{ success: false, error: 'Rating must be between 1 and 5' },
				{ status: 400 }
			)
		}

		if (comment.length < 10 || comment.length > 500) {
			return NextResponse.json(
				{ success: false, error: 'Comment must be between 10 and 500 characters' },
				{ status: 400 }
			)
		}

		// Check if car exists
		const car = await Car.findById(carId)
		if (!car) {
			return NextResponse.json(
				{ success: false, error: 'Car not found' },
				{ status: 404 }
			)
		}

		// Check if user already reviewed this car
		const existingReview = await Review.findOne({
			carId: new mongoose.Types.ObjectId(carId),
			userId: new mongoose.Types.ObjectId(session.user.id),
		})

		if (existingReview) {
			return NextResponse.json(
				{ success: false, error: 'You have already reviewed this car' },
				{ status: 400 }
			)
		}

		// Create review
		const review = await Review.create({
			carId: new mongoose.Types.ObjectId(carId),
			userId: new mongoose.Types.ObjectId(session.user.id),
			userName: `${session.user.firstName} ${session.user.lastName}`,
			userEmail: session.user.email,
			rating,
			comment,
		})

		// Update car's average rating and total reviews
		const allReviews = await Review.find({ carId: new mongoose.Types.ObjectId(carId) })
		const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
		const averageRating = totalRating / allReviews.length

		await Car.findByIdAndUpdate(carId, {
			averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
			totalReviews: allReviews.length,
		})

		return NextResponse.json({
			success: true,
			data: review,
			message: 'Review created successfully',
		})
	} catch (error: any) {
		console.error('Error creating review:', error)
		return NextResponse.json(
			{ success: false, error: error.message || 'Failed to create review' },
			{ status: 500 }
		)
	}
}

