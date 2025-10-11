'use client'

import { Search, Heart, Bell, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
				{/* Left: Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<div className="text-2xl font-bold text-blue-600">
						CarRental
					</div>
				</Link>

				{/* Center: Search */}
				<div className="hidden flex-1 max-w-md mx-8 md:flex">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search cars..."
							className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
						/>
					</div>
				</div>

				{/* Right: Icons and Profile */}
				<div className="flex items-center space-x-4">
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
						{/* Notification badge */}
						<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
					</button>
					
					<button
						className="rounded-full p-2 transition-colors hover:bg-gray-100"
						aria-label="Settings"
					>
						<Settings className="h-5 w-5 text-gray-600" />
					</button>
					
					<button className="flex items-center">
						<div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-200 ring-2 ring-gray-300 transition-all hover:ring-blue-500">
							<Image
								src="/default-avatar.png"
								alt="Profile"
								width={36}
								height={36}
								className="object-cover"
								onError={(e) => {
									// Show default if image fails to load
									const target = e.target as HTMLImageElement
									target.style.display = 'none'
									target.parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center bg-blue-600 text-sm font-medium text-white">U</div>'
								}}
							/>
						</div>
					</button>
				</div>
			</div>

			{/* Mobile Search */}
			<div className="border-t border-gray-200 px-4 py-3 md:hidden">
				<div className="relative w-full">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search cars..."
						className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
					/>
				</div>
			</div>
		</header>
	)
}

