import { Search } from 'lucide-react'
import Link from 'next/link'
import HeaderAuth from '@/components/layout/header-auth'

export default function Header() {

	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
			<nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6" aria-label="Main navigation">
				{/* Left: Logo */}
				<Link href="/" className="flex items-center space-x-3" aria-label="DRIVIO Home">
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg ring-2 ring-blue-100">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5">
						<path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
						<path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
						<path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
					</svg>
				</div>
				<div className="flex flex-col leading-none">
					<span className="text-xl font-bold tracking-tight text-gray-900">DRIVIO</span>
					<span className="text-[10px] font-medium tracking-wider text-blue-600">YOUR JOURNEY AWAITS</span>
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
			</nav>

			{/* Mobile Search */}
			<div className="border-t border-gray-200 px-4 py-3 md:hidden" aria-label="Mobile search">
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

