import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="text-center">
				<h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
				<h2 className="mb-4 text-2xl font-bold text-gray-700">Car Not Found</h2>
				<p className="mb-8 text-gray-600">
					The car you're looking for doesn't exist or has been removed.
				</p>
				<Link
					href="/cars"
					className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					Browse All Cars
				</Link>
			</div>
		</div>
	)
}

