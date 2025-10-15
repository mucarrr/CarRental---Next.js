'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

export default function LoginPage() {
	const router = useRouter()
	const { update } = useSession()
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
			// router.push('/')
			// router.refresh() is not working. because this is a server component.
			// Force hard reload to update session
			// window.location.href = '/' is working but refresh all page.
			// Update session without full page reload
			await update()
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
						<label htmlFor="email" className="label-field">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							className="input-field"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="label-field">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							className="input-field"
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

