import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Car from '@/models/car'
import mongoose from 'mongoose'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB()

		const { id } = await params

		// Validate MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invalid car ID',
				},
				{ status: 400 }
			)
		}

		const car = await Car.findById(id).select('-__v').lean()

		if (!car) {
			return NextResponse.json(
				{
					success: false,
					error: 'Car not found',
				},
				{ status: 404 }
			)
		}

		return NextResponse.json({
			success: true,
			data: car,
		})
	} catch (error: any) {
		console.error('Error fetching car:', error)
		return NextResponse.json(
			{
				success: false,
				error: error.message || 'Failed to fetch car',
			},
			{ status: 500 }
		)
	}
}

