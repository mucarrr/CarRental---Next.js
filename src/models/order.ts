import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import { IOrder as IOrderBase } from '@/types/order'

export interface IOrderDoc extends Document, Omit<IOrderBase, 'userId' | 'carId' | 'createdAt' | 'updatedAt'> {
	userId: Types.ObjectId
	carId: Types.ObjectId
	createdAt: Date
	updatedAt: Date
}

const OrderSchema = new Schema<IOrderDoc>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
		pickupLocation: { type: String, required: true, trim: true },
		dropoffLocation: { type: String, required: true, trim: true },
		pickupDate: { type: String, required: true },
		dropoffDate: { type: String, required: true },
		pickupTime: { type: String, required: true },
		dropoffTime: { type: String, required: true },
		days: { type: Number, required: true, min: 1 },
		total: { type: Number, required: true, min: 0 },
		status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
		stripeSessionId: { type: String },
	},
	{ timestamps: true }
)

OrderSchema.index({ userId: 1, createdAt: -1 })

const Order: Model<IOrderDoc> =
	mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema)

export default Order


