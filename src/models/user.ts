import mongoose, { Schema, models } from 'mongoose'

export interface IUser {
	email: string
	password: string
	firstName: string
	lastName: string
	phone?: string
	image?: string
	createdAt: Date
	updatedAt: Date
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters'],
		},
		firstName: {
			type: String,
			required: [true, 'First name is required'],
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
			trim: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
)

const User = models.User || mongoose.model<IUser>('User', UserSchema)

export default User

