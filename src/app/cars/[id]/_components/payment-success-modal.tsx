'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessModal() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [show, setShow] = useState(false)

	useEffect(() => {
		const success = searchParams.get('success')
		if (success === 'true') {
			setShow(true)
			// URL'den query parametresini temizle
			const url = new URL(window.location.href)
			url.searchParams.delete('success')
			window.history.replaceState(null, '', url.toString())
		}
	}, [searchParams])

	if (!show) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<div className="flex flex-col items-center text-center">
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-10 w-10 text-green-600" />
					</div>
					<h2 className="mb-2 text-2xl font-bold text-gray-900">Ödemeniz Gerçekleştirildi</h2>
					<p className="mb-6 text-gray-600">Siparişiniz başarıyla alındı. Teşekkür ederiz!</p>
					<div className="flex w-full gap-3">
						<Link
							href="/"
							onClick={() => setShow(false)}
							className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							Ana Sayfa
						</Link>
						<Link
							href="/orders"
							onClick={() => setShow(false)}
							className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700"
						>
							My Orders
						</Link>
					</div>
					<button
						onClick={() => setShow(false)}
						className="mt-4 text-sm text-gray-500 underline hover:text-gray-700"
					>
						Kapat
					</button>
				</div>
			</div>
		</div>
	)
}

