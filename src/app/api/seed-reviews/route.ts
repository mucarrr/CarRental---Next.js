import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/review'
import Car from '@/models/car'
import User from '@/models/user'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

// Mock users for reviews
const mockUsers = [
	{ firstName: 'Sophia', lastName: 'Anderson', email: 'sophia.anderson@example.com' },
	{ firstName: 'James', lastName: 'Miller', email: 'james.miller@example.com' },
	{ firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@example.com' },
	{ firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com' },
	{ firstName: 'Olivia', lastName: 'Davis', email: 'olivia.davis@example.com' },
	{ firstName: 'William', lastName: 'Garcia', email: 'william.garcia@example.com' },
	{ firstName: 'Ava', lastName: 'Martinez', email: 'ava.martinez@example.com' },
	{ firstName: 'Alexander', lastName: 'Rodriguez', email: 'alexander.rodriguez@example.com' },
	{ firstName: 'Isabella', lastName: 'Hernandez', email: 'isabella.hernandez@example.com' },
	{ firstName: 'Ethan', lastName: 'Lopez', email: 'ethan.lopez@example.com' },
	{ firstName: 'Mia', lastName: 'Gonzalez', email: 'mia.gonzalez@example.com' },
	{ firstName: 'Daniel', lastName: 'Perez', email: 'daniel.perez@example.com' },
	{ firstName: 'Charlotte', lastName: 'Taylor', email: 'charlotte.taylor@example.com' },
	{ firstName: 'Matthew', lastName: 'Thomas', email: 'matthew.thomas@example.com' },
	{ firstName: 'Amelia', lastName: 'Moore', email: 'amelia.moore@example.com' },
	{ firstName: 'David', lastName: 'Jackson', email: 'david.jackson@example.com' },
]

// Review templates by car type
const reviewTemplates = {
	luxury: [
		{ rating: 5, comment: 'Absolutely stunning car! The interior is gorgeous and the ride is incredibly smooth. Worth every penny.' },
		{ rating: 5, comment: 'Premium experience from start to finish. The comfort level is unmatched and all features worked perfectly.' },
		{ rating: 4, comment: 'Great luxury car with excellent features. Only minor issue was the pickup process took a bit longer than expected.' },
		{ rating: 5, comment: 'This car exceeded all my expectations. Perfect for business trips and special occasions.' },
	],
	sports: [
		{ rating: 5, comment: 'What an incredible driving experience! The acceleration is mind-blowing and the handling is perfect.' },
		{ rating: 5, comment: 'Living the dream with this beast! Turned heads everywhere I went. Absolutely thrilling to drive.' },
		{ rating: 4, comment: 'Amazing performance car. A bit challenging to park in tight spaces but totally worth it for the experience.' },
		{ rating: 5, comment: 'Pure adrenaline! The sound of the engine alone is worth it. Best rental experience ever.' },
	],
	sedan: [
		{ rating: 5, comment: 'Perfect car for daily use. Comfortable, fuel-efficient, and very reliable. Highly recommend!' },
		{ rating: 4, comment: 'Great sedan with good fuel economy. Clean and well-maintained. Would rent again.' },
		{ rating: 5, comment: 'Excellent choice for city driving. Smooth ride and all the features you need for a comfortable journey.' },
		{ rating: 4, comment: 'Solid, dependable car. Perfect for business meetings and getting around town efficiently.' },
	],
	suv: [
		{ rating: 5, comment: 'Spacious and comfortable! Perfect for our family road trip. Plenty of room for luggage and kids loved it.' },
		{ rating: 4, comment: 'Great SUV with good visibility and comfortable seats. Handled mountain roads beautifully.' },
		{ rating: 5, comment: 'Fantastic vehicle for exploring! The extra space and safety features made our trip worry-free.' },
		{ rating: 4, comment: 'Very practical and comfortable. Good fuel economy for an SUV. Would definitely rent again.' },
	],
	hatchback: [
		{ rating: 5, comment: 'Perfect city car! Easy to park, great fuel economy, and surprisingly spacious inside.' },
		{ rating: 4, comment: 'Excellent little car for getting around. Responsive and fun to drive. Very economical.' },
		{ rating: 5, comment: 'Great choice for urban driving. Compact but comfortable, and the trunk space is decent too.' },
		{ rating: 4, comment: 'Nice and nimble car. Perfect for navigating narrow streets and finding parking spots.' },
	],
	van: [
		{ rating: 5, comment: 'Perfect for our group trip! Comfortable for 8 people plus luggage. Great sound system too.' },
		{ rating: 4, comment: 'Spacious and practical. Ideal for moving or group travel. Only wish it had better fuel economy.' },
		{ rating: 5, comment: 'Exceeded expectations! Comfortable seating, plenty of space, and easy to drive despite the size.' },
		{ rating: 4, comment: 'Great for family vacations. Kids had plenty of room and we fit all our gear easily.' },
	],
}

export async function POST() {
	try {
		await connectDB()

		// Clear existing reviews
		await Review.deleteMany({})
		console.log('Cleared existing reviews')

		// Get all cars
		const cars = await Car.find({})
		if (cars.length === 0) {
			return NextResponse.json({
				success: false,
				error: 'No cars found. Please seed cars first.',
			})
		}

		// Create or get mock users
		const users: any[] = []
		for (const userData of mockUsers) {
			let user = await User.findOne({ email: userData.email })
			if (!user) {
				const hashedPassword = await bcrypt.hash('password123', 10)
				user = await User.create({
					...userData,
					password: hashedPassword,
				})
			}
			users.push(user)
		}

		console.log(`Created/found ${users.length} mock users`)

		// Create 2 reviews for each car
		const reviews = []
		let userIndex = 0

		for (const car of cars) {
			const carType = car.carType as keyof typeof reviewTemplates
			const templates = reviewTemplates[carType] || reviewTemplates.sedan

			// Get 2 random reviews from templates
			const shuffled = [...templates].sort(() => 0.5 - Math.random())
			const selectedReviews = shuffled.slice(0, 2)

			for (const template of selectedReviews) {
				const user = users[userIndex % users.length]
				userIndex++

				const review = {
					carId: car._id,
					userId: user._id,
					userName: `${user.firstName} ${user.lastName}`,
					userEmail: user.email,
					rating: template.rating,
					comment: template.comment,
					createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
				}

				reviews.push(review)
			}
		}

		// Insert all reviews
		const result = await Review.insertMany(reviews)
		console.log(`Created ${result.length} reviews`)

		// Update car ratings
		for (const car of cars) {
			const carReviews = await Review.find({ carId: car._id })
			if (carReviews.length > 0) {
				const totalRating = carReviews.reduce((sum, r) => sum + r.rating, 0)
				const averageRating = totalRating / carReviews.length

				await Car.findByIdAndUpdate(car._id, {
					averageRating: Math.round(averageRating * 10) / 10,
					totalReviews: carReviews.length,
				})
			}
		}

		console.log('Updated car ratings')

		return NextResponse.json({
			success: true,
			message: 'Reviews seeded successfully',
			reviewsCount: result.length,
			carsCount: cars.length,
		})
	} catch (error: any) {
		console.error('Error seeding reviews:', error)
		return NextResponse.json(
			{
				success: false,
				error: error.message || 'Failed to seed reviews',
			},
			{ status: 500 }
		)
	}
}

