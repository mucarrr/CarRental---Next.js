import { Search } from 'lucide-react'
import Link from 'next/link'
import HeaderAuth from '@/components/layout/header-auth'

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
					<HeaderAuth />
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

