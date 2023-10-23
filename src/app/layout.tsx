import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
	title: 'Breadit',
	description: 'A Reddit clone built with Next.js and TypeScript.',
	openGraph: {
		type: 'website',
		siteName: 'Breadit',
		title: 'Breadit',
		description: 'A Reddit clone built with Next.js and TypeScript.',
		url: 'https://malifor-reddit-clone.vercel.app',
		images: '/og.png',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Breadit',
		description: 'A Reddit clone built with Next.js and TypeScript.',
		site: 'https://malifor-reddit-clone.app',
		images: '/og.png',
	},
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
	children,
	authModal,
}: {
	children: React.ReactNode
	authModal: React.ReactNode
}) {
	return (
		<html
			lang='en'
			// eslint-disable-next-line tailwindcss/no-custom-classname
			className={cn(
				'light bg-white text-slate-900 antialiased',
				inter.className,
			)}
		>
			<Providers>
				<body className='min-h-screen bg-slate-50 p-4 antialiased sm:p-12'>
					<Navbar />

					{authModal}

					<div className='container mx-auto h-full max-w-7xl pt-12'>
						{children}
					</div>
					<Toaster />
				</body>
			</Providers>
		</html>
	)
}
