import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview extends Document {
	carId: mongoose.Types.ObjectId
	userId: mongoose.Types.ObjectId
	userName: string
	userEmail: string
	rating: number
	comment: string
	createdAt: Date
	updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
	{
		carId: {
			type: Schema.Types.ObjectId,
			ref: 'Car',
			required: [true, 'Car ID is required'],
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User ID is required'],
		},
		userName: {
			type: String,
			required: [true, 'User name is required'],
			trim: true,
		},
		userEmail: {
			type: String,
			required: [true, 'User email is required'],
			trim: true,
			lowercase: true,
		},
		rating: {
			type: Number,
			required: [true, 'Rating is required'],
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: [true, 'Comment is required'],
			trim: true,
			minlength: 10,
			maxlength: 500,
		},
	},
	{
		timestamps: true,
	}
)

// Index for efficient queries
ReviewSchema.index({ carId: 1, createdAt: -1 })
ReviewSchema.index({ userId: 1 })

// Ensure one review per user per car
ReviewSchema.index({ carId: 1, userId: 1 }, { unique: true })

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

export default Review

