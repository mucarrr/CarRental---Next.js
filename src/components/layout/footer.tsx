import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="border-t border-gray-200 bg-gray-50">
			<div className="container mx-auto px-4 py-12 md:px-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
				{/* Company Info */}
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-md">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-4 w-4">
								<path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
								<path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
								<path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
							</svg>
						</div>
						<span className="text-2xl font-bold text-gray-900">DRIVIO</span>
					</div>
					<p className="text-sm text-gray-600">
						Your journey awaits. Premium car rental experience.
					</p>
				</div>

					{/* Quick Links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold text-gray-900">
							Quick Links
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/about" className="text-gray-600 transition-colors hover:text-blue-600">
									About Us
								</Link>
							</li>
							<li>
								<Link href="/cars" className="text-gray-600 transition-colors hover:text-blue-600">
									Cars
								</Link>
							</li>
							<li>
								<Link href="/pricing" className="text-gray-600 transition-colors hover:text-blue-600">
									Pricing
								</Link>
							</li>
							<li>
								<Link href="/contact" className="text-gray-600 transition-colors hover:text-blue-600">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="mb-4 text-sm font-semibold text-gray-900">
							Support
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/faq" className="text-gray-600 transition-colors hover:text-blue-600">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/terms" className="text-gray-600 transition-colors hover:text-blue-600">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/privacy" className="text-gray-600 transition-colors hover:text-blue-600">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/help" className="text-gray-600 transition-colors hover:text-blue-600">
									Help Center
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="mb-4 text-sm font-semibold text-gray-900">
							Contact
						</h3>
					<ul className="space-y-3 text-sm">
						<li className="flex items-start space-x-3">
							<Phone className="h-4 w-4 text-gray-400 mt-0.5" />
							<span className="text-gray-600">+1 (416) 555-0123</span>
						</li>
					<li className="flex items-start space-x-3">
						<Mail className="h-4 w-4 text-gray-400 mt-0.5" />
						<span className="text-gray-600">info@drivio.com</span>
					</li>
						<li className="flex items-start space-x-3">
							<MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
							<span className="text-gray-600">Toronto, Canada</span>
						</li>
					</ul>
					</div>
				</div>

			{/* Bottom */}
			<div className="mt-8 border-t border-gray-200 pt-8 text-center">
				<p className="text-sm text-gray-600">
					© {currentYear} DRIVIO. All rights reserved.
				</p>
			</div>
			</div>
		</footer>
	)
}

