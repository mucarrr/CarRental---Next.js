import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: 'DRIVIO - Premium Car Rental',
		template: '%s | DRIVIO',
	},
	description: 'Your journey awaits. Experience premium car rental with DRIVIO - modern, reliable, and affordable. Rent premium cars at the best prices with easy booking and flexible options.',
	keywords: ['car rental', 'premium cars', 'car hire', 'rental service', 'luxury cars', 'vehicle rental'],
	authors: [{ name: 'DRIVIO' }],
	creator: 'DRIVIO',
	publisher: 'DRIVIO',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
	alternates: {
		canonical: '/',
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: '/',
		title: 'DRIVIO - Premium Car Rental',
		description: 'Your journey awaits. Experience premium car rental with DRIVIO - modern, reliable, and affordable.',
		siteName: 'DRIVIO',
		images: [
			{
				url: '/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'DRIVIO - Premium Car Rental',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'DRIVIO - Premium Car Rental',
		description: 'Your journey awaits. Experience premium car rental with DRIVIO.',
		images: ['/og-image.jpg'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	verification: {
		// google: 'your-google-verification-code',
		// yandex: 'your-yandex-verification-code',
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
