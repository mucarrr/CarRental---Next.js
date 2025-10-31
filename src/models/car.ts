import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface ICar extends Document {
	_id: Types.ObjectId
	brand: string
	modelName: string
	year: number
	transmission: 'automatic' | 'manual'
	fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
	seats: number
	pricePerDay: number
	images: string[]
	description: string
	features: string[]
	location: string
	isAvailable: boolean
	averageRating: number
	totalReviews: number
	mileage: number
	color: string
	licensePlate: string
	carType: 'sedan' | 'suv' | 'hatchback' | 'sports' | 'luxury' | 'van'
	createdAt: Date
	updatedAt: Date
}

const CarSchema = new Schema<ICar>(
	{
		brand: {
			type: String,
			required: [true, 'Brand is required'],
			trim: true,
		},
		modelName: {
			type: String,
			required: [true, 'Model name is required'],
			trim: true,
		},
		year: {
			type: Number,
			required: [true, 'Year is required'],
			min: 2000,
			max: new Date().getFullYear() + 1,
		},
		transmission: {
			type: String,
			enum: ['automatic', 'manual'],
			required: [true, 'Transmission is required'],
		},
		fuelType: {
			type: String,
			enum: ['petrol', 'diesel', 'electric', 'hybrid'],
			required: [true, 'Fuel type is required'],
		},
		seats: {
			type: Number,
			required: [true, 'Number of seats is required'],
			min: 2,
			max: 9,
		},
		pricePerDay: {
			type: Number,
			required: [true, 'Price per day is required'],
			min: 0,
		},
		images: {
			type: [String],
			required: [true, 'At least one image is required'],
			validate: {
				validator: (v: string[]) => v.length > 0,
				message: 'At least one image is required',
			},
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			trim: true,
			minlength: 20,
			maxlength: 1000,
		},
		features: {
			type: [String],
			default: [],
		},
		location: {
			type: String,
			required: [true, 'Location is required'],
			trim: true,
		},
		isAvailable: {
			type: Boolean,
			default: true,
		},
		averageRating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		totalReviews: {
			type: Number,
			default: 0,
			min: 0,
		},
		mileage: {
			type: Number,
			required: [true, 'Mileage is required'],
			min: 0,
		},
		color: {
			type: String,
			required: [true, 'Color is required'],
			trim: true,
		},
		licensePlate: {
			type: String,
			required: [true, 'License plate is required'],
			unique: true,
			trim: true,
			uppercase: true,
		},
		carType: {
			type: String,
			enum: ['sedan', 'suv', 'hatchback', 'sports', 'luxury', 'van'],
			required: [true, 'Car type is required'],
		},
	},
	{
		timestamps: true,
	}
)

// Index for efficient queries
CarSchema.index({ location: 1, isAvailable: 1 })
CarSchema.index({ pricePerDay: 1 })
CarSchema.index({ carType: 1 })
CarSchema.index({ transmission: 1 })
CarSchema.index({ fuelType: 1 })

const Car: Model<ICar> = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema)

export default Car

