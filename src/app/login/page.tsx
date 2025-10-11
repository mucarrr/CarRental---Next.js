'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function LoginPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const formDataToSend = new FormData(e.currentTarget)
			const { loginUser } = await import('@/app/actions/auth')
			const result = await loginUser(formDataToSend)

			if (!result.success) {
				toast.error(result.error || 'Login failed')
				return
			}

			toast.success('Login successful!')
			router.push('/')
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
					<p className="mt-2 text-sm text-gray-600">
						Don't have an account?{' '}
						<Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
							Sign up
						</Link>
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4 rounded-lg bg-white p-8 shadow-md">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email
							</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="you@example.com"
						/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
							</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="••••••••"
						/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

