'use server'

import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/user'
import { AuthError } from 'next-auth'

function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
	if (password.length < 8) {
		return { valid: false, error: 'Password must be at least 8 characters' }
	}
	if (!/[A-Z]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one uppercase letter' }
	}
	if (!/[a-z]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one lowercase letter' }
	}
	if (!/[0-9]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one number' }
	}
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one special character' }
	}
	return { valid: true }
}

export async function registerUser(formData: FormData) {
	try {
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const firstName = formData.get('firstName') as string
		const lastName = formData.get('lastName') as string
		const phone = formData.get('phone') as string

		// Validation
		if (!email || !password || !firstName || !lastName) {
			return {
				success: false,
				error: 'Missing required fields',
			}
		}

		// Validate password strength
		const passwordValidation = validatePasswordStrength(password)
		if (!passwordValidation.valid) {
			return {
				success: false,
				error: passwordValidation.error,
			}
		}

		await connectDB()

		// Check if user already exists
		const existingUser = await User.findOne({ email })

		if (existingUser) {
			return {
				success: false,
				error: 'User with this email already exists',
			}
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10)

		// Create user
		const user = await User.create({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			phone: phone || undefined,
		})

		return {
			success: true,
			message: 'Account created successfully',
			user: {
				id: user._id.toString(),
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		}
	} catch (error: any) {
		console.error('Registration error:', error)
		return {
			success: false,
			error: error.message || 'Something went wrong',
		}
	}
}

export async function loginUser(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	if (!email || !password) {
		return {
			success: false,
			error: 'Email and password are required',
		}
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirect: false,
		})

		return {
			success: true,
			message: 'Login successful',
		}
	} catch (error) {
		if (error instanceof AuthError) {
			return {
				success: false,
				error: 'Invalid email or password',
			}
		}
		return {
			success: false,
			error: 'Something went wrong',
		}
	}
}

