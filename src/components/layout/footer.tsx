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
						<div className="text-2xl font-bold text-blue-600">
							CarRental
						</div>
						<p className="text-sm text-gray-600">
							Your trusted partner for the best car rental experience.
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
							<span className="text-gray-600">info@carrental.com</span>
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
						© {currentYear} CarRental. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

