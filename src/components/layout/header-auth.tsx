'use client'

import { Search, Heart, Bell, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

export default function HeaderAuth() {
	const { data: session, status } = useSession()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSignOut = async () => {
		setIsDropdownOpen(false)
		await signOut({ redirect: true, callbackUrl: '/' })
	}

	if (status === 'loading') {
		return (
			<div className="flex items-center space-x-2">
				<div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
				<div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
			</div>
		)
	}

	if (session) {
		return (
			<>
				<button
					className="rounded-full p-2 transition-colors hover:bg-gray-100"
					aria-label="Favorites"
				>
					<Heart className="h-5 w-5 text-gray-600" />
				</button>
				
				<button
					className="relative rounded-full p-2 transition-colors hover:bg-gray-100"
					aria-label="Notifications"
				>
					<Bell className="h-5 w-5 text-gray-600" />
					<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
				</button>
				
				<button
					className="rounded-full p-2 transition-colors hover:bg-gray-100"
					aria-label="Settings"
				>
					<Settings className="h-5 w-5 text-gray-600" />
				</button>
				
				<div className="relative z-50" ref={dropdownRef}>
					<button 
						className="flex items-center"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					>
						<div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-600 ring-2 ring-gray-300 transition-all hover:ring-blue-500">
							{session.user?.image ? (
								<Image
									src={session.user.image}
									alt="Profile"
									width={36}
									height={36}
									className="object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
									{session.user?.firstName?.charAt(0).toUpperCase() || ''}
									{session.user?.lastName?.charAt(0).toUpperCase() || ''}
								</div>
							)}
						</div>
					</button>

					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
							<div className="px-4 py-3 border-b border-gray-100">
								<p className="text-sm font-medium text-gray-900">
									{session.user?.firstName} {session.user?.lastName}
								</p>
								<p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
							</div>
							<div className="py-1">
								<Link
									href="/profile"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
									onClick={() => setIsDropdownOpen(false)}
								>
									My Profile
								</Link>
								<Link
									href="/orders"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
									onClick={() => setIsDropdownOpen(false)}
								>
									My Orders
								</Link>
								<button
									onClick={handleSignOut}
									className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
								>
									<LogOut className="mr-2 h-4 w-4" />
									Sign out
								</button>
							</div>
						</div>
					)}
				</div>
			</>
		)
	}

	return (
		<div className="flex items-center space-x-2">
			<Link
				href="/login"
				className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
			>
				Login
			</Link>
			<Link
				href="/signup"
				className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
			>
				Sign up
			</Link>
		</div>
	)
}

