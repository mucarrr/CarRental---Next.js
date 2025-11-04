import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Sign Up',
	description: 'Create your DRIVIO account to start renting premium cars. Quick registration with secure authentication.',
	robots: {
		index: false,
		follow: false,
	},
}

export default function SignupLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}

