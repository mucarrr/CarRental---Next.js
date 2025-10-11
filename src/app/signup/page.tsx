'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Check, X } from 'lucide-react'

interface PasswordStrength {
	score: number
	label: string
	color: string
	requirements: {
		minLength: boolean
		hasUpperCase: boolean
		hasLowerCase: boolean
		hasNumber: boolean
		hasSpecialChar: boolean
	}
}

export default function SignupPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		phone: '',
	})
	const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

	const passwordStrength = useMemo((): PasswordStrength => {
		const password = formData.password
		const requirements = {
			minLength: password.length >= 8,
			hasUpperCase: /[A-Z]/.test(password),
			hasLowerCase: /[a-z]/.test(password),
			hasNumber: /[0-9]/.test(password),
			hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
		}

		const score = Object.values(requirements).filter(Boolean).length
		
		let label = 'Weak'
		let color = 'bg-red-500'
		
		if (score === 5) {
			label = 'Strong'
			color = 'bg-green-500'
		} else if (score >= 3) {
			label = 'Medium'
			color = 'bg-yellow-500'
		}

		return { score, label, color, requirements }
	}, [formData.password])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		
		// Validate password strength
		if (passwordStrength.score < 5) {
			toast.error('Please meet all password requirements')
			return
		}

		// Validate password match
		if (formData.password !== formData.confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		setIsLoading(true)

		try {
			const formDataToSend = new FormData(e.currentTarget)
			const { registerUser } = await import('@/app/actions/auth')
			const result = await registerUser(formDataToSend)

			if (!result.success) {
				toast.error(result.error || 'Registration failed')
				return
			}

			toast.success('Account created successfully! Please login.')
			router.push('/login')
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
					<h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
					<p className="mt-2 text-sm text-gray-600">
						Already have an account?{' '}
						<Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
							Sign in
						</Link>
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4 rounded-lg bg-white p-8 shadow-md">
						<div>
							<label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
								First Name
							</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							required
							value={formData.firstName}
							onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
							className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="John"
						/>
						</div>

					<div>
						<label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
							Last Name
						</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							required
							value={formData.lastName}
							onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
							className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="Doe"
						/>
					</div>

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
							<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
								Phone (Optional)
							</label>
						<input
							id="phone"
							name="phone"
							type="tel"
							value={formData.phone}
							onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
							className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="+1 (555) 123-4567"
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
							onFocus={() => setShowPasswordRequirements(true)}
							className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="••••••••"
						/>
						
						{/* Password Strength Indicator */}
						{formData.password && (
							<div className="mt-2">
								<div className="flex items-center justify-between mb-1">
									<span className="text-xs font-medium text-gray-700">
										Password strength: <span className={
											passwordStrength.score === 5 ? 'text-green-600' : 
											passwordStrength.score >= 3 ? 'text-yellow-600' : 
											'text-red-600'
										}>{passwordStrength.label}</span>
									</span>
								</div>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((level) => (
										<div
											key={level}
											className={`h-1 flex-1 rounded-full transition-colors ${
												level <= passwordStrength.score
													? passwordStrength.color
													: 'bg-gray-200'
											}`}
										/>
									))}
								</div>
							</div>
						)}

						{/* Password Requirements */}
						{showPasswordRequirements && (
							<div className="mt-3 space-y-1.5 rounded-lg bg-gray-50 p-3">
								<p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
								<RequirementItem
									met={passwordStrength.requirements.minLength}
									text="At least 8 characters"
								/>
								<RequirementItem
									met={passwordStrength.requirements.hasUpperCase}
									text="One uppercase letter"
								/>
								<RequirementItem
									met={passwordStrength.requirements.hasLowerCase}
									text="One lowercase letter"
								/>
								<RequirementItem
									met={passwordStrength.requirements.hasNumber}
									text="One number"
								/>
								<RequirementItem
									met={passwordStrength.requirements.hasSpecialChar}
									text="One special character (!@#$%^&*)"
								/>
							</div>
						)}
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							required
							value={formData.confirmPassword}
							onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
							className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
							placeholder="••••••••"
						/>
						{formData.confirmPassword && (
							<div className="mt-1.5 flex items-center gap-1.5">
								{formData.password === formData.confirmPassword ? (
									<>
										<Check className="h-3.5 w-3.5 text-green-600" />
										<span className="text-xs text-green-600">Passwords match</span>
									</>
								) : (
									<>
										<X className="h-3.5 w-3.5 text-red-600" />
										<span className="text-xs text-red-600">Passwords do not match</span>
									</>
								)}
							</div>
						)}
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? 'Creating account...' : 'Create account'}
					</button>
					</div>
				</form>
			</div>
		</div>
	)
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
	return (
		<div className="flex items-center gap-2">
			{met ? (
				<Check className="h-3.5 w-3.5 text-green-600" />
			) : (
				<X className="h-3.5 w-3.5 text-gray-400" />
			)}
			<span className={`text-xs ${met ? 'text-green-600' : 'text-gray-600'}`}>
				{text}
			</span>
		</div>
	)
}

