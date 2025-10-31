export interface IOrder {
	userId: string
	carId: string
	pickupLocation: string
	dropoffLocation: string
	pickupDate: string
	dropoffDate: string
	pickupTime: string
	dropoffTime: string
	days: number
	total: number
	status: 'pending' | 'paid' | 'cancelled'
	stripeSessionId?: string
	createdAt?: string
	updatedAt?: string
}


