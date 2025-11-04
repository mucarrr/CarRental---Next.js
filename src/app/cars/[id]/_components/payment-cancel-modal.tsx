'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RotateCcw, Car, Home } from 'lucide-react'

interface PaymentCancelModalProps {
	carId: string
}

export default function PaymentCancelModal({ carId }: PaymentCancelModalProps) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [show, setShow] = useState(false)

	useEffect(() => {
		const success = searchParams.get('success')
		const sessionId = searchParams.get('session_id')
		
		if (success === 'false') {
			setShow(true)
			
			// Cancel order if session_id exists
			if (sessionId) {
				fetch('/api/orders/cancel', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ sessionId }),
				}).catch(console.error)
			}
			
			// Clear query parameters from URL
			const url = new URL(window.location.href)
			url.searchParams.delete('success')
			url.searchParams.delete('session_id')
			window.history.replaceState(null, '', url.toString())
		}
	}, [searchParams])

	const handleRetry = () => {
		setShow(false)
		// Reload page (form clears, user can try again)
		window.location.reload()
	}

	if (!show) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
				<div className="flex flex-col items-center text-center">
					<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-4 ring-red-100">
						<XCircle className="h-12 w-12 text-red-600" />
					</div>
					<h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Cancelled</h2>
					<p className="mb-6 text-sm leading-relaxed text-gray-600">
						Payment process has been cancelled. Your order has been marked as cancelled.
					</p>
					<div className="w-full space-y-3">
						<button
							onClick={handleRetry}
							className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]"
						>
							<RotateCcw className="h-5 w-5" />
							<span className="whitespace-nowrap">Try Again</span>
						</button>
						<div className="grid grid-cols-2 gap-3">
							<Link
								href="/cars"
								onClick={() => setShow(false)}
								className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
							>
								<Car className="h-5 w-5" />
								<span className="whitespace-nowrap">Browse Cars</span>
							</Link>
							<Link
								href="/"
								onClick={() => setShow(false)}
								className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
							>
								<Home className="h-5 w-5" />
								<span className="whitespace-nowrap">Home</span>
							</Link>
						</div>
					</div>
					<button
						onClick={() => setShow(false)}
						className="mt-5 text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-700 hover:decoration-gray-500"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	)
}

