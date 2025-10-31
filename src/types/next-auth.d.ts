import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
	interface User {
		id: string
		email: string
		firstName: string
		lastName: string
		phone?: string
		image?: string | null
	}

	interface Session {
		user: {
			id: string
			firstName: string
			lastName: string
			phone?: string
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string
		firstName: string
		lastName: string
		phone?: string
	}
}

export interface CheckoutBody {
	pickupLocation: string
	dropoffLocation: string
	pickupDate: string
	dropoffDate: string
	pickupTime: string
	dropoffTime: string
	additionalNote: string
	days: number
	total: number
}

