import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Login',
	description: 'Sign in to your DRIVIO account to access your bookings, manage orders, and rent premium cars.',
	robots: {
		index: false,
		follow: false,
	},
}

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}

