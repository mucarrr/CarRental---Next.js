'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'

export default function PaymentSuccessModal() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [show, setShow] = useState(false)

	useEffect(() => {
		const success = searchParams.get('success')
		const sessionId = searchParams.get('session_id')
		
		if (success === 'true' && sessionId) {
			setShow(true)
			
			// Payment durumunu kontrol et ve order'ı güncelle
			fetch('/api/orders/verify-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId }),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.success && data.status === 'paid') {
						console.log('Order verified and updated to paid')
					}
				})
				.catch((err) => {
					console.error('Error verifying payment:', err)
				})
			
			// Clear query parameters from URL
			const url = new URL(window.location.href)
			url.searchParams.delete('success')
			url.searchParams.delete('session_id')
			window.history.replaceState(null, '', url.toString())
		}
	}, [searchParams])

	if (!show) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
				<div className="flex flex-col items-center text-center">
					<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-50 ring-4 ring-green-100">
						<CheckCircle className="h-12 w-12 text-green-600" />
					</div>
					<h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Successful</h2>
					<p className="mb-6 text-sm leading-relaxed text-gray-600">
						Your order has been successfully placed. Thank you for choosing us!
					</p>
					<div className="w-full space-y-3">
						<Link
							href="/orders"
							onClick={() => setShow(false)}
							className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:shadow-green-500/40 active:scale-[0.98]"
						>
							<ShoppingBag className="h-5 w-5" />
							<span className="whitespace-nowrap">View My Orders</span>
						</Link>
						<div className="grid grid-cols-2 gap-3">
							<Link
								href="/"
								onClick={() => setShow(false)}
								className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
							>
								<Home className="h-5 w-5" />
								<span className="whitespace-nowrap">Home</span>
							</Link>
							<Link
								href="/cars"
								onClick={() => setShow(false)}
								className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
							>
								<span className="whitespace-nowrap">Browse More</span>
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

